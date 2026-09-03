# Sentinel

Sentinel is a small FastAPI service that processes community-fridge SMS check-ins. It uses a Strands agent and a shelf-life tool to classify messages as spoilage risk, critically empty, or all fine, then records the appropriate action.

## Project Structure

- `main.py` - FastAPI application and Twilio webhook endpoint
- `graph.py` - Sentinel workflow and Strands assessment agent
- `intake.py` - check-in parsing and donor-roster loading
- `branch_nodes.py` - donor distance calculation and SMS alert helper
- `services/notifier.py` - safe Twilio SMS service
- `tools/lookup_shelf_life.py` - Strands shelf-life lookup tool
- `donor_roster.json` - donor contact and location data
- `demo_fallback.py` - local scenario runner
- `.venv/` - local Python virtual environment

## Setup

Create and activate the virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

For Git Bash, use `source .venv/Scripts/activate` instead.

Install the application dependencies:

```bash
pip install strands-agents fastapi uvicorn twilio python-multipart
```

Set these environment variables before using live Twilio messaging:

```text
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_NUMBER
FRIDGE_ID
SENTINEL_MODEL_ID
```

Strands uses configured model-provider credentials. `SENTINEL_MODEL_ID` is optional and selects the model used by the assessment agent.

## Run

Start the development server with:

```bash
uvicorn main:app --reload
```

The health check is available at `GET /health`. Configure Twilio to send incoming messages to `POST /webhook/sms` with `Body` and `From` form fields.

To run the local scenarios, use:

```powershell
python demo_fallback.py
```

The scenario runner still calls the Strands assessment agent, so it requires the same model-provider credentials. It does not send SMS unless notifier context is supplied by the application.
