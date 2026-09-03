import math
from typing import Any, Dict

from services.notifier import SMSNotifier

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
    notifier = invocation_state.get("notifier")
    fridge_location = invocation_state.get("fridge_location", {"lat": 6.5244, "lon": 3.3792})
    
    if not isinstance(notifier, SMSNotifier):
        raise ValueError("An SMS notifier is required to send an empty-fridge alert.")
    if not roster:
        state["action_taken"] = "No donor is available for an empty-fridge alert."
        return state

    # Find nearest donor
    nearest_donor = min(
        roster,
        key=lambda d: haversine(fridge_location["lat"], fridge_location["lon"], d["lat"], d["lon"])
    )
    
    result = notifier.send_sms_safe(
        to_number=nearest_donor["phone"],
        message_body=f"Hi {nearest_donor['name']}, the community fridge is empty! Could you help restock?",
    )

    state["notified_donor"] = nearest_donor["name"]
    state["sms_sid"] = result.get("sid")
    state["action_taken"] = "SMS sent to nearest donor." if result["status"] == "success" else "Donor SMS failed to send."
    return state