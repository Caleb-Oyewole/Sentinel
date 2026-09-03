import math
from typing import Any, Dict, cast
from twilio.rest import Client

def haversine(lat1, lon1, lat2, lon2):
    """Calculates distance between two geo points in kilometers."""
    R = 6371.0
    dlat, dlon = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def alert_empty_node(state: Dict[str, Any], invocation_state: Dict[str, Any]) -> Dict[str, Any]:
    """Selects nearest donor securely using invocation_state."""
    # Secure parameters extracted from invocation_state
    roster = invocation_state.get("donor_roster", [])
    twilio_client = cast(Client | None, invocation_state.get("twilio_client"))
    fridge_location = invocation_state.get("fridge_location", {"lat": 6.5244, "lon": 3.3792})
    
    if twilio_client is None:
        raise ValueError("A Twilio client is required to send an empty-fridge alert.")

    # Find nearest donor
    nearest_donor = min(
        roster,
        key=lambda d: haversine(fridge_location["lat"], fridge_location["lon"], d["lat"], d["lon"])
    )
    
    # Send SMS via Twilio Client
    message = twilio_client.messages.create(
        body=f"Hi {nearest_donor['name']}, the community fridge is empty! Could you help restock?",
        from_=invocation_state.get("twilio_number"),
        to=nearest_donor["phone"]
    )
    
    state["notified_donor"] = nearest_donor["name"]
    state["sms_sid"] = message.sid
    return state