from dotenv import load_dotenv
load_dotenv()
import json
import graph as graph_module

from services.notifier import SMSNotifier

class StubNotifier(SMSNotifier):
    """Fake notifier — passes isinstance checks but doesn't call real Twilio."""
    def __init__(self):
        pass  # skip the real init, which requires account_sid/auth_token/from_number

    def send_sms_safe(self, to_number, message_body):
        print(f"[STUB SMS] to={to_number}: {message_body}")
        return {"status": "success", "sid": "stub-sid"}

with open("data/sample_checkins.json") as f:
    cases = json.load(f)

targets = ["risk_expired_lettuce", "critically_empty_edge_at_threshold", "fine_hard_cheese_early_in_window"]
stub_invocation_state = {
    "notifier": StubNotifier(),
    "sender": "+15555550100",
    "donor_roster": [{"name": "Test Donor", "phone": "+15555550199", "lat": 6.5244, "lon": 3.3792}],
}

for case in cases:
    if case["name"] in targets:
        state = {"extracted_data": case["intake_output"]}
        graph_module.assess_node(state, stub_invocation_state)
        next_node = graph_module.route_next(state)
        if next_node == "alert_empty":
            graph_module.alert_empty_node(state, stub_invocation_state)
        elif next_node == "alert_pull":
            graph_module.alert_pull_node(state, stub_invocation_state)
        else:
            graph_module.log_ok_node(state, stub_invocation_state)
        print(f"{case['name']}: status={state.get('status')}, action={state.get('action_taken')}\n")