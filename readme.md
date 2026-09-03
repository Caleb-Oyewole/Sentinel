# Sentinel

Sentinel is a small FastAPI service that processes community-fridge SMS check-ins. It classifies messages as spoilage risk, critically empty, or all fine, then records the appropriate action.

## Project Structure

- `main.py` - FastAPI application and Twilio webhook endpoint
- `graph.py` - Sentinel state-machine workflow
- `branch_nodes.py` - donor distance calculation and Twilio alert helper
- `services/notifier.py` - safe Twilio SMS service
- `donor_roster.json` - donor contact and location data

## Setup

Create and activate the virtual environment:

```bash
python -m venv .venv
source .venv/Scripts/activate
```

Install the application dependencies:

```bash
pip install fastapi uvicorn twilio python-multipart
```

Set these environment variables before using live Twilio messaging:

```text
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_NUMBER
```

## Run

Start the development server with:

```bash
uvicorn main:app --reload
```

The health check is available at `GET /health`. Configure Twilio to send incoming messages to `POST /webhook/sms` with `Body` and `From` form fields.
