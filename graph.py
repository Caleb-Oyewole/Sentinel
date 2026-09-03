import json
import os
from typing import Any, Dict

from pydantic import BaseModel, Field
from strands import Agent

from branch_nodes import alert_empty_node
from intake import intake_node
from tools.lookup_shelf_life import lookup_shelf_life


class Assessment(BaseModel):
    status: str = Field(description="One of risk, critically_empty, or all_fine")
    reasoning: str = Field(description="Brief explanation of the evidence and tool result used")


assessment_agent = Agent(
    model=os.getenv("SENTINEL_MODEL_ID") or None,
    tools=[lookup_shelf_life],
    structured_output_model=Assessment,
    system_prompt=(
        "You assess community fridge check-ins. Use lookup_shelf_life when an item or freshness "
        "claim needs verification. Return risk for unsafe or likely spoiled food, critically_empty "
        "for an empty or nearly empty fridge, and all_fine when food is safe and adequately stocked."
    ),
)


class SentinelGraph:
    """Five-node Sentinel workflow with Strands-backed assessment."""

    def run(self, state: Dict[str, Any], invocation_state: Dict[str, Any] | None = None) -> Dict[str, Any]:
        runtime_state = invocation_state or {}
        intake_node(state)
        assess_node(state, runtime_state)
        next_node = route_next(state)
        if next_node == "alert_empty":
            alert_empty_node(state, runtime_state)
        elif next_node == "alert_pull":
            alert_pull_node(state, runtime_state)
        else:
            log_ok_node(state, runtime_state)
        return state


def assess_node(state: Dict[str, Any], invocation_state: Dict[str, Any]) -> Dict[str, Any]:
    """Uses Strands reasoning and a shelf-life tool to classify the check-in."""
    result = assessment_agent(
        json.dumps(state["extracted_data"]),
        invocation_state=invocation_state,
    )
    assessment = result.structured_output
    if not isinstance(assessment, Assessment):
        raise ValueError("The assessment agent did not return structured output.")
    if assessment.status not in {"risk", "critically_empty", "all_fine"}:
        raise ValueError(f"Unsupported assessment status: {assessment.status}")
    state["status"] = assessment.status
    state["assessment_reasoning"] = assessment.reasoning
    return state


def alert_pull_node(state: Dict[str, Any], invocation_state: Dict[str, Any]) -> Dict[str, Any]:
    """Handles flagged spoilage items."""
    notifier = invocation_state.get("notifier")
    sender = invocation_state.get("sender")
    if notifier is not None and sender:
        result = notifier.send_sms_safe(
            to_number=sender,
            message_body="Sentinel flagged a potentially unsafe item. Please remove it from the fridge.",
        )
        state["sms_sid"] = result.get("sid")
        state["action_taken"] = "SMS sent to volunteer to pull item." if result["status"] == "success" else "Volunteer SMS failed to send."
    else:
        state["action_taken"] = "Volunteer notification could not be sent."
    return state


def log_ok_node(state: Dict[str, Any], invocation_state: Dict[str, Any]) -> Dict[str, Any]:
    """Silent resolution path."""
    state["action_taken"] = "Logged silently. No contact made."
    return state


def route_next(state: Dict[str, Any]) -> str:
    """Routes based on the assessment produced by the agent."""
    return {
        "risk": "alert_pull",
        "critically_empty": "alert_empty",
        "all_fine": "log_ok",
    }[state["status"]]


sentinel_graph = SentinelGraph()