from typing import Dict, Any
from strands-agents import Graph, Node # Assuming standard Strands Graph structure

def intake_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Extracts raw check-in text/media from incoming state."""
    raw_text = state.get("incoming_text", "")
    # Placeholder extraction logic
    state["extracted_data"] = {"raw_text": raw_text}
    return state

def assess_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Classifies fridge state into: risk, critically_empty, or all_fine."""
    # Day 1 placeholder decision logic
    text = state.get("incoming_text", "").lower()
    if "spoil" in text or "bad" in text:
        state["status"] = "risk"
    elif "empty" in text:
        state["status"] = "critically_empty"
    else:
        state["status"] = "all_fine"
    return state

def alert_pull_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Handles flagged spoilage items."""
    state["action_taken"] = "SMS sent to volunteer to pull item."
    return state

def alert_empty_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Handles empty shelf notifications."""
    state["action_taken"] = "SMS sent to nearest donor."
    return state

def log_ok_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Silent resolution path."""
    state["action_taken"] = "Logged silently. No contact made."
    return state

def route_next(state: Dict[str, Any]) -> str:
    """Conditional edge router based on assessment status."""
    status = state.get("status")
    if status == "risk":
        return "alert_pull"
    elif status == "critically_empty":
        return "alert_empty"
    return "log_ok"

# Graph Construction
sentinel_graph = Graph()
sentinel_graph.add_node("intake", intake_node)
sentinel_graph.add_node("assess", assess_node)
sentinel_graph.add_node("alert_pull", alert_pull_node)
sentinel_graph.add_node("alert_empty", alert_empty_node)
sentinel_graph.add_node("log_ok", log_ok_node)

sentinel_graph.set_entry_point("intake")
sentinel_graph.add_edge("intake", "assess")
sentinel_graph.add_conditional_edges("assess", route_next)