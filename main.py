import os
from fastapi import FastAPI, Form, Response, HTTPException
from twilio.twiml.messaging_response import MessagingResponse
from graph import sentinel_graph
from services.notifier import SMSNotifier

app = FastAPI(title="Sentinel Backend - AgentCore Deployment")

# Retrieve production environment credentials
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "mock_sid")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "mock_token")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER", "+1234567890")

notifier = SMSNotifier(TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER)

@app.get("/health")
async def health_check():
    """AgentCore health probe endpoint."""
    return {"status": "healthy", "service": "Sentinel Backend"}

@app.post("/webhook/sms")
async def handle_sms_webhook(Body: str = Form(...), From: str = Form(...)):
    """Continuous webhook endpoint receiving live Twilio check-ins."""
    try:
        # Build state including sensitive runtime objects
        invocation_state = {
            "notifier": notifier,
            "sender": From
        }
        
        initial_state = {"incoming_text": Body}
        
        # Execute the Strands Graph pipeline
        final_state = sentinel_graph.run(initial_state, invocation_state=invocation_state)
        
        # Build TwiML response
        resp = MessagingResponse()
        if final_state.get("status") != "all_fine":
            resp.message(f"Sentinel Alert: {final_state.get('action_taken')}")
            
        return Response(content=str(resp), media_type="application/xml")
        
    except Exception as e:
        # Prevent continuous webhook crashes
        raise HTTPException(status_code=500, detail=f"Graph Execution Error: {str(e)}")