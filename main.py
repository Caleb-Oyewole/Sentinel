import json
import os
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from twilio.twiml.messaging_response import MessagingResponse

# Load environment variables
load_dotenv(Path(__file__).resolve().parent / ".env")

from branch_nodes import haversine
from graph import sentinel_graph
from intake import ROSTER_PATH, load_donor_roster
from services.notifier import SMSNotifier
from tools.lookup_shelf_life import _SHELF_LIFE_DB, _ALIASES, _resolve, lookup_shelf_life

app = FastAPI(title="Sentinel - Autonomous Community Fridge AI & Dispatch Hub")

# Enable CORS for development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production environment credentials
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER", "")
FRIDGE_ID = os.getenv("FRIDGE_ID", "sentinel-community-fridge")
FRIDGE_LOCATION = {"lat": 6.5244, "lon": 3.3792}

notifier = SMSNotifier(TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER)

# In-memory audit history and metrics store
checkin_history: List[Dict[str, Any]] = []
fridge_stats = {
    "total_checkins": 0,
    "risk_count": 0,
    "critically_empty_count": 0,
    "all_fine_count": 0,
    "current_fill_pct": 72,
    "fridge_status": "all_fine",
}

# --- Pydantic Request Models ---

class CheckinPayload(BaseModel):
    text: str = Field(..., description="Check-in message text", example="Milk smells bad and expired yesterday")
    sender: Optional[str] = Field(default="+15551234567", description="Volunteer phone number")

class DonorCreatePayload(BaseModel):
    name: str
    phone: str
    lat: float
    lon: float

class LookupPayload(BaseModel):
    item: str


# --- Core Helper Functions ---

def record_checkin_event(
    incoming_text: str,
    sender: str,
    final_state: Dict[str, Any],
    source: str = "api",
    duration_ms: float = 0.0,
) -> Dict[str, Any]:
    """Records check-in result into history log and updates aggregate metrics."""
    status = final_state.get("status", "all_fine")
    event = {
        "id": f"chk_{uuid.uuid4().hex[:8]}",
        "incoming_text": incoming_text,
        "sender": sender,
        "status": status,
        "assessment_reasoning": final_state.get("assessment_reasoning", "No reasoning recorded"),
        "extracted_data": final_state.get("extracted_data", {}),
        "action_taken": final_state.get("action_taken", "Logged silently"),
        "notified_donor": final_state.get("notified_donor"),
        "sms_sid": final_state.get("sms_sid"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "execution_time_ms": round(duration_ms, 2),
    }

    checkin_history.insert(0, event)
    if len(checkin_history) > 100:
        checkin_history.pop()

    # Update stats
    fridge_stats["total_checkins"] += 1
    if status == "risk":
        fridge_stats["risk_count"] += 1
        fridge_stats["fridge_status"] = "risk"
    elif status == "critically_empty":
        fridge_stats["critically_empty_count"] += 1
        fridge_stats["current_fill_pct"] = 12
        fridge_stats["fridge_status"] = "critically_empty"
    else:
        fridge_stats["all_fine_count"] += 1
        fridge_stats["current_fill_pct"] = min(92, fridge_stats["current_fill_pct"] + 8)
        fridge_stats["fridge_status"] = "all_fine"

    return event


def get_annotated_donors() -> List[Dict[str, Any]]:
    """Loads donors and attaches computed Haversine distance from fridge."""
    roster = load_donor_roster()
    f_lat, f_lon = FRIDGE_LOCATION["lat"], FRIDGE_LOCATION["lon"]

    annotated = []
    for d in roster:
        dist_km = haversine(f_lat, f_lon, d["lat"], d["lon"])
        annotated.append({
            **d,
            "distance_km": round(dist_km, 3),
            "distance_miles": round(dist_km * 0.621371, 3),
        })

    annotated.sort(key=lambda x: x["distance_km"])
    return annotated


# --- API Endpoints ---

@app.get("/health")
async def health_check():
    """AgentCore health probe and service metadata."""
    return {
        "status": "healthy",
        "service": "Sentinel Backend",
        "version": "1.0.0",
        "fridge_id": FRIDGE_ID,
        "fridge_location": FRIDGE_LOCATION,
        "donors_registered": len(load_donor_roster()),
        "model_configured": bool(os.getenv("SENTINEL_MODEL_ID")),
    }


@app.get("/api/stats")
async def get_stats():
    """Aggregate community fridge operations telemetry."""
    donors = load_donor_roster()
    return {
        **fridge_stats,
        "active_donors_count": len(donors),
        "last_checkin_time": checkin_history[0]["timestamp"] if checkin_history else None,
    }


@app.post("/api/checkin")
async def process_checkin(payload: CheckinPayload):
    """Direct API execution of Sentinel Strands workflow."""
    start_time = time.time()
    try:
        invocation_state = {
            "notifier": notifier,
            "sender": payload.sender,
            "fridge_id": FRIDGE_ID,
            "donor_roster": load_donor_roster(),
            "fridge_location": FRIDGE_LOCATION,
        }
        initial_state = {"incoming_text": payload.text}

        final_state = sentinel_graph.run(initial_state, invocation_state=invocation_state)
        duration_ms = (time.time() - start_time) * 1000

        event = record_checkin_event(
            incoming_text=payload.text,
            sender=payload.sender or "+15551234567",
            final_state=final_state,
            source="simulator",
            duration_ms=duration_ms,
        )
        return event

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph Execution Error: {str(e)}")


@app.post("/webhook/sms")
async def handle_sms_webhook(Body: str = Form(...), From: str = Form(...)):
    """Twilio incoming webhook endpoint."""
    start_time = time.time()
    try:
        invocation_state = {
            "notifier": notifier,
            "sender": From,
            "fridge_id": FRIDGE_ID,
            "donor_roster": load_donor_roster(),
            "fridge_location": FRIDGE_LOCATION,
        }
        initial_state = {"incoming_text": Body}

        final_state = sentinel_graph.run(initial_state, invocation_state=invocation_state)
        duration_ms = (time.time() - start_time) * 1000

        record_checkin_event(
            incoming_text=Body,
            sender=From,
            final_state=final_state,
            source="webhook",
            duration_ms=duration_ms,
        )

        resp = MessagingResponse()
        if final_state.get("status") != "all_fine":
            resp.message(f"Sentinel Alert: {final_state.get('action_taken')}")

        return Response(content=str(resp), media_type="application/xml")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph Execution Error: {str(e)}")


@app.get("/api/donors")
async def list_donors():
    """Returns donor roster with Haversine distance from the fridge."""
    return get_annotated_donors()


@app.post("/api/donors")
async def add_donor(payload: DonorCreatePayload):
    """Registers a new restock volunteer donor."""
    roster = load_donor_roster()
    new_id = f"donor_{len(roster) + 1}"
    new_entry = {
        "id": new_id,
        "name": payload.name,
        "phone": payload.phone,
        "lat": payload.lat,
        "lon": payload.lon,
    }
    roster.append(new_entry)

    with ROSTER_PATH.open("w", encoding="utf-8") as f:
        json.dump(roster, f, indent=4)

    f_lat, f_lon = FRIDGE_LOCATION["lat"], FRIDGE_LOCATION["lon"]
    dist_km = haversine(f_lat, f_lon, payload.lat, payload.lon)
    return {
        **new_entry,
        "distance_km": round(dist_km, 3),
        "distance_miles": round(dist_km * 0.621371, 3),
    }


@app.get("/api/shelflife")
async def get_shelflife_data():
    """Returns full USDA shelf-life database and alias lookups."""
    return {
        "items": _SHELF_LIFE_DB,
        "aliases": _ALIASES,
    }


@app.post("/api/shelflife/lookup")
async def lookup_item_shelf_life(payload: LookupPayload):
    """Performs item shelf-life inquiry using Sentinel tool."""
    category, matched = _resolve(payload.item)
    entry = _SHELF_LIFE_DB.get(category, {})
    description = lookup_shelf_life(payload.item)
    return {
        "item": payload.item,
        "matched": matched,
        "category": category,
        "details": entry,
        "description": description,
    }


@app.get("/api/history")
async def get_checkin_history():
    """Returns recent check-in audit records."""
    return checkin_history


@app.delete("/api/history")
async def clear_checkin_history():
    """Clears check-in audit records."""
    checkin_history.clear()
    fridge_stats["total_checkins"] = 0
    fridge_stats["risk_count"] = 0
    fridge_stats["critically_empty_count"] = 0
    fridge_stats["all_fine_count"] = 0
    fridge_stats["fridge_status"] = "all_fine"
    fridge_stats["current_fill_pct"] = 75
    return {"cleared": True}


# --- Static Frontend Mount & Fallback ---

DIST_DIR = Path(__file__).resolve().parent / "frontend" / "dist"

if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_candidate = DIST_DIR / full_path
        if full_path and file_candidate.is_file():
            return FileResponse(file_candidate)
        return FileResponse(DIST_DIR / "index.html")

else:
    @app.get("/")
    async def root():
        """Fallback browser landing page if frontend is not yet built."""
        return HTMLResponse(content="""
        <html>
          <body style="font-family: sans-serif; background: #07090e; color: #fff; text-align: center; padding: 4rem;">
            <h1>Sentinel Backend Running</h1>
            <p>Frontend is currently compiling. Access <code>/health</code> or <code>/api/donors</code>.</p>
          </body>
        </html>
        """)