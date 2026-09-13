import json
from pathlib import Path
import os
import sys

from dotenv import load_dotenv
from services.model_provider import get_model

load_dotenv(Path(__file__).resolve().parent / ".env")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import graph as graph_module  # noqa: E402


def _patch_model_from_env():
    """Swap assessment_agent's model to whichever provider has a key set
    (OpenRouter or OpenAI). Returns True if patched, False if left as-is
    (no key found -> Bedrock default, needs AWS creds instead)."""
    from services.model_provider import get_model
    model = get_model()
    if model is None:
        return False
    graph_module.assessment_agent.model = model
    return True


def run(cases: list) -> dict:
    results = []
    for case in cases:
        state = {"extracted_data": case["intake_output"]}
        try:
            state = graph_module.assess_node(state, invocation_state={})
            predicted = state.get("status")
            error = None
        except Exception as e:
            predicted = None
            error = f"{type(e).__name__}: {e}"

        results.append({
            "name": case["name"],
            "expected": case["expected_state"],
            "predicted": predicted,
            "correct": predicted == case["expected_state"],
            "error": error,
            "reasoning": state.get("assessment_reasoning"),   # ADD THIS LINE
 
        })
    return results


def report(results: list):
    n = len(results)
    for r in results:
     if not r["correct"]:
        print(f"WRONG: {r['name']} — predicted={r['predicted']!r}, expected={r['expected']!r}")
        print(f"   reasoning: {r.get('reasoning')}")
    errored = [r for r in results if r["error"]]
    scored = [r for r in results if not r["error"]]

    correct = sum(r["correct"] for r in scored)
    predicted_all_fine = sum(1 for r in scored if r["predicted"] == "all_fine")

    actual_risk = [r for r in results if r["expected"] == "risk"]
    caught_risk = sum(1 for r in actual_risk if r["correct"])

    actual_fine = [r for r in results if r["expected"] == "all_fine"]
    false_alarms = sum(1 for r in actual_fine if r["predicted"] not in ("all_fine", None))

    print(f"=== Real assess_node (graph.py) ===")
    print(f"  n check-ins:              {n}")
    if errored:
        print(f"  ERRORED (not scored):     {len(errored)}")
        for r in errored:
            print(f"    - {r['name']}: {r['error']}")
    print(f"  overall accuracy:         {100 * correct / max(len(scored), 1):.1f}%  (of {len(scored)} scored)")
    print(f"  silent resolution rate:   {100 * predicted_all_fine / max(len(scored), 1):.1f}%  (target: >70%)")
    if actual_risk:
        print(f"  risk recall:              {100 * caught_risk / len(actual_risk):.1f}%  ({len(actual_risk)} actual risk cases) <- most important number")
    if actual_fine:
        print(f"  false alarm rate:         {100 * false_alarms / len(actual_fine):.1f}%  (of {len(actual_fine)} actually-fine cases)")


if __name__ == "__main__":
    patched = _patch_model_from_env()
    print("Model: OPENAI (patched)" if patched else "Model: Bedrock default (no OPENAI_API_KEY found -- needs AWS creds)")
    print()

    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_checkins.json")
    with open(data_path) as f:
        cases = json.load(f)

    results = run(cases)
    report(results)
