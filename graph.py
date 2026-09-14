import json
import os
from pathlib import Path
from typing import Any, Dict

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from services.model_provider import get_model
from strands import Agent

load_dotenv(Path(__file__).resolve().parent / ".env")

from branch_nodes import alert_empty_node
from intake import intake_node
from tools.lookup_shelf_life import lookup_shelf_life


class Assessment(BaseModel):
    status: str = Field(description="One of risk, critically_empty, or all_fine")
    reasoning: str = Field(description="Brief explanation of the evidence and tool result used")

assessment_agent = Agent(
    model=get_model(),
    tools=[lookup_shelf_life],
    structured_output_model=Assessment,
    system_prompt=(
        "You assess community fridge check-ins. Use lookup_shelf_life when an item or freshness "
        "claim needs verification. Return risk for unsafe or likely spoiled food, critically_empty "
        "for an empty or nearly empty fridge, and all_fine when food is safe and adequately stocked."
    ),
)



def fallback_assessment(state: Dict[str, Any]) -> Dict[str, Any]:
    """Deterministic local assessment used when no model credentials exist."""
    extracted = state.get("extracted_data", {})
    raw_text = str(extracted.get("raw_text", "")).lower()
    fill_level = str(extracted.get("fill_level", "")).lower()
    freshness_signal = str(extracted.get("freshness_signal", "")).lower()

    if any(word in raw_text for word in ("empty", "out of food", "needs restocking", "barely any")) or fill_level in {"low", "empty"}:
        state["status"] = "critically_empty"
        state["assessment_reasoning"] = "The check-in indicates the fridge is empty or nearly empty, so it should be flagged for donor restocking."
        return state

    if any(word in raw_text for word in ("spoiled", "expired", "bad", "smells", "unsafe")) or freshness_signal == "near_expiry":
        state["status"] = "risk"
        state["assessment_reasoning"] = "The check-in suggests a spoiled or expired item, so the affected food should be reviewed and removed if necessary."
        return state

    state["status"] = "all_fine"
    state["assessment_reasoning"] = "The check-in suggests the fridge is adequately stocked and food appears safe for the community."
    return state


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
    extracted = state["extracted_data"]
    fill_pct = extracted.get("fill_level_pct")
    empty_threshold = 20
    if fill_pct is not None and fill_pct < empty_threshold:
        state["status"] = "critically_empty"
        state["assessment_reasoning"] = f"fill_level_pct={fill_pct} below empty_threshold={empty_threshold}"
        return state

    if assessment_agent is None:
        return fallback_assessment(state)

    try:
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
    except Exception as e:
        print(f"REAL ERROR: {type(e).__name__}: {e}")
        return fallback_assessment(state)



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