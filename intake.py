import json
from typing import Dict, Any

def load_donor_roster():
    with open("donor_roster.json", "r") as f:
        return json.load(f)

def intake_node(state: Dict[str, Any]) -> Dict[str, Any]:
    raw_text = state.get("incoming_text", "")
    
    # Simple structured parsing (can be enhanced with an LLM call)
    parsed_payload = {
        "items": ["milk"] if "milk" in raw_text.lower() else ["apples"],
        "freshness_signal": "near_expiry" if "old" in raw_text.lower() else "fresh",
        "fill_level": "low" if "empty" in raw_text.lower() else "full"
    }
    
    state["extracted_data"] = parsed_payload
    return state