from fastapi import FastAPI, Form, Response
from twilio.twiml.messaging_response import MessagingResponse
from graph import sentinel_graph

app = FastAPI(title="Sentinel Backend")

@app.post("/sms/webhook")
async def sms_webhook(Body: str = Form(...), From: str = Form(...)):
    """Receives Twilio SMS and runs the Strands Graph."""
    
    # Run the graph
    initial_state = {"incoming_text": Body, "sender": From}
    final_state = sentinel_graph.run(initial_state)
    
    # Respond via Twilio MessagingResponse
    resp = MessagingResponse()
    action = final_state.get("action_taken", "")
    
    if final_state.get("status") != "all_fine":
        resp.message(f"Sentinel Alert: {action}")
    
    return Response(content=str(resp), media_type="application/xml")