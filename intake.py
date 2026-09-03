import json
from pathlib import Path
from typing import Any, Dict


ROSTER_PATH = Path(__file__).with_name("donor_roster.json")

def load_donor_roster():
    with ROSTER_PATH.open(encoding="utf-8") as f:
        return json.load(f)

def intake_node(state: Dict[str, Any]) -> Dict[str, Any]:
    raw_text = state.get("incoming_text", "")
    
    lowered_text = raw_text.lower()
    parsed_payload = {
        "raw_text": raw_text,
        "items": [item for item in ("milk", "apples", "bread", "rice", "vegetables") if item in lowered_text],
        "freshness_signal": "near_expiry" if any(word in lowered_text for word in ("old", "expired", "spoiled", "bad")) else "fresh",
        "fill_level": "low" if any(word in lowered_text for word in ("empty", "low", "out")) else "full",
    }
    
    state["extracted_data"] = parsed_payload
    return state