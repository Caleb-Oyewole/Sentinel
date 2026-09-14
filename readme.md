# Sentinel — Autonomous Community Fridge AI & Dispatch Hub

Sentinel is an intelligent operations and mutual-aid dispatch platform for community fridges. It combines a Strands assessment agent, a verified USDA food shelf-life tool, Twilio SMS connectivity, and a high-tech **Mission Control** frontend to safeguard food safety and dispatch restocking volunteers autonomously.

---

## Features

- **Mission Control Dashboard**: Live operations HUD with animated capacity gauges, internal temperature and humidity sensors, and health indicators.
- **SMS & Check-in Simulator**: Interactive mobile phone console allowing volunteers to simulate check-in reports or send real Twilio webhook traffic with instant TwiML feedback.
- **Strands AI Pipeline Visualizer**: Real-time 5-node agent pipeline flow (`Intake` ➔ `Shelf-Life Tool` ➔ `Assessment Agent` ➔ `Smart Router` ➔ `Resolution`) with structured reasoning explainability.
- **Geo-Spatial Haversine Radar**: Interactive SVG radar tracking registered donors and autonomously connecting to the closest donor when an empty fridge (<20%) alert is triggered.
- **USDA Food Safety & Shelf-Life Matrix**: Searchable database of refrigeration, pantry, and freezer shelf-life safety rules and alias mappings.
- **Live Audit Stream**: Real-time chronological audit trail of all check-ins, classifications, and dispatches.

---

## Project Structure

- `frontend/` - React 19 + TypeScript + Vite modern frontend dashboard
  - `src/components/FridgeStatusHUD.tsx` - Vital metrics, fill gauges, and telemetry
  - `src/components/SmsSimulator.tsx` - Mobile phone SMS simulator with preset scenarios
  - `src/components/AgentGraphVisualizer.tsx` - 5-node Strands agent execution visualizer
  - `src/components/DonorRadarMap.tsx` - Geo-spatial SVG radar and nearest donor restock dispatcher
  - `src/components/ShelfLifeExplorer.tsx` - Interactive food shelf-life safety database
  - `src/components/ActivityLog.tsx` - Real-time audit stream
  - `src/services/api.ts` - Frontend API client
- `main.py` - FastAPI application, REST endpoints, Twilio webhook, and static frontend mount
- `graph.py` - Sentinel workflow and Strands assessment agent
- `intake.py` - check-in parsing and donor-roster loading
- `branch_nodes.py` - Haversine donor distance calculation and SMS alert helpers
- `services/notifier.py` - safe Twilio SMS service
- `tools/lookup_shelf_life.py` - Strands shelf-life lookup tool
- `donor_roster.json` - donor contact and location data
- `tests/test_api_endpoints.py` - End-to-end integration test suite

---

## Setup & Installation

1. **Create and activate the virtual environment**:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

2. **Install Python backend dependencies**:
   ```bash
   pip install -r requirements.txt python-multipart
   ```

3. **Install Frontend dependencies**:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Environment Configuration**:
   Create a `.env` file based on `.env.example`:
   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_NUMBER=+15551234567
   FRIDGE_ID=sentinel-community-fridge
   SENTINEL_MODEL_ID=your_model_id
   ```

---

## Running the Application

### Option A: Complete Unified Server (Frontend + Backend)
Start the FastAPI server:
```powershell
uvicorn main:app --port 8000 --reload
```
Open **`http://127.0.0.1:8000/`** in your browser. The full Mission Control dashboard is served directly by FastAPI.

### Option B: Frontend Hot-Reload Development
Start the FastAPI backend:
```powershell
uvicorn main:app --port 8000 --reload
```
In a second terminal, launch the Vite dev server:
```powershell
cd frontend
npm run dev
```
Open **`http://localhost:5173/`** with instant hot-reloading and proxying to the backend.

---

## Running Verification Tests
To run the automated API and graph integration tests:
```powershell
python tests/test_api_endpoints.py
```
