import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Form, Response, HTTPException
from fastapi.responses import HTMLResponse
from twilio.twiml.messaging_response import MessagingResponse

from graph import sentinel_graph
from intake import load_donor_roster
from services.notifier import SMSNotifier

load_dotenv(dotenv_path=Path(__file__).resolve().with_name(".env"), override=False)

app = FastAPI(title="Sentinel Backend - AgentCore Deployment")

# Retrieve production environment credentials
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER", "")

notifier = SMSNotifier(TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER)

@app.get("/")
async def root():
    """Friendly browser landing page for the Sentinel API."""
    html = """
    <html>
      <head>
        <title>Sentinel</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f3f8f4;
            color: #1f2d1f;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background: white;
            padding: 2rem 2.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            text-align: center;
            max-width: 520px;
          }
          h1 { margin-bottom: 0.5rem; }
          p { margin: 0.5rem 0; }
          code {
            background: #eef5ee;
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Sentinel</h1>
          <p>Community fridge monitoring is running.</p>
          <p>Check <code>/health</code> for the service status.</p>
          <p>Use <code>/webhook/sms</code> for Twilio webhook traffic.</p>
        </div>
      </body>
    </html>
    """
    return HTMLResponse(content=html)

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
            "sender": From,
            "fridge_id": os.getenv("FRIDGE_ID", "sentinel-community-fridge"),
            "donor_roster": load_donor_roster(),
            "fridge_location": {"lat": 6.5244, "lon": 3.3792},
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