import time
from graph import sentinel_graph

def run_local_demo():
    """Simulates live incoming check-ins for demo video backup."""
    
    mock_scenarios = [
        {
            "label": "Scenario 1: Spoilage / Risk Detected",
            "payload": {"incoming_text": "Milk smells bad and expired yesterday"},
            "expected_branch": "alert_pull"
        },
        {
            "label": "Scenario 2: Critically Empty Shelf",
            "payload": {"incoming_text": "The main shelf is completely empty!"},
            "expected_branch": "alert_empty"
        },
        {
            "label": "Scenario 3: Silent Resolution (All Fine)",
            "payload": {"incoming_text": "Checked fridge, fully stocked and clean"},
            "expected_branch": "log_ok"
        }
    ]

    print("==================================================")
    print("      SENTINEL BACKEND DEMO RUNNER (FALLBACK)     ")
    print("==================================================\n")

    for scenario in mock_scenarios:
        print(f"--> Executing {scenario['label']}")
        print(f"    Input Payload: '{scenario['payload']['incoming_text']}'")
        
        start_time = time.time()
        final_state = sentinel_graph.run(scenario["payload"])
        duration = round(time.time() - start_time, 4)
        
        print(f"    Status Result : {final_state.get('status')}")
        print(f"    Action Taken  : {final_state.get('action_taken')}")
        print(f"    Execution Time: {duration}s")
        print("-" * 50)

if __name__ == "__main__":
    run_local_demo()