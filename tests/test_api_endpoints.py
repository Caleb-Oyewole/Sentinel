import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Sentinel Backend"
    print("[PASS] Health endpoint OK")

def test_donors():
    response = client.get("/api/donors")
    assert response.status_code == 200
    donors = response.json()
    assert len(donors) >= 5
    assert "distance_km" in donors[0]
    print(f"[PASS] Donors endpoint OK (Nearest: {donors[0]['name']} at {donors[0]['distance_km']} km)")

def test_shelflife():
    response = client.get("/api/shelflife")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data and "aliases" in data
    print("[PASS] Shelf-life database endpoint OK")

    lookup_res = client.post("/api/shelflife/lookup", json={"item": "milk"})
    assert lookup_res.status_code == 200
    lookup_data = lookup_res.json()
    assert lookup_data["matched"] is True
    print("[PASS] Shelf-life lookup OK")

def test_checkin_spoilage():
    response = client.post(
        "/api/checkin",
        json={"text": "Milk smells bad and expired yesterday", "sender": "+15551234567"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "risk"
    print(f"[PASS] Spoilage Checkin OK: status={data['status']}, action={data['action_taken']}")

def test_checkin_empty():
    response = client.post(
        "/api/checkin",
        json={"text": "The main shelf is completely empty!", "sender": "+15551234567"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "critically_empty"
    assert data["notified_donor"] == "Alice"
    print(f"[PASS] Empty Checkin OK: status={data['status']}, notified_donor={data['notified_donor']}")

def test_checkin_nominal():
    response = client.post(
        "/api/checkin",
        json={"text": "Checked fridge, fully stocked and clean", "sender": "+15551234567"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "all_fine"
    print(f"[PASS] Nominal Checkin OK: status={data['status']}")

def test_webhook_sms():
    response = client.post(
        "/webhook/sms",
        data={"Body": "Milk is spoiled and sour", "From": "+15559876543"}
    )
    assert response.status_code == 200
    assert "xml" in response.headers.get("content-type", "")
    assert "<Response>" in response.text
    print("[PASS] Twilio SMS Webhook OK")

def test_spa_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "<!doctype html>" in response.text.lower()
    assert "Sentinel" in response.text
    print("[PASS] SPA Frontend root serving OK")

if __name__ == "__main__":
    print("--- RUNNING SENTINEL ENDPOINT INTEGRATION TESTS ---")
    test_health()
    test_donors()
    test_shelflife()
    test_checkin_spoilage()
    test_checkin_empty()
    test_checkin_nominal()
    test_webhook_sms()
    test_spa_root()
    print("--- ALL TESTS PASSED SUCCESSFULLY! ---")
