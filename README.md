# HealthEase

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-005571?style=for-the-badge)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black?style=for-the-badge)

**HealthEase** is a full-stack healthcare management platform for outpatient (OPD) workflows: hospital and doctor discovery, token-based appointment queues with live WebSocket updates, role-based dashboards, and an integrated **RAG-backed medical assistant** that can answer general health questions, triage symptom descriptions, book appointments via tools, and analyze uploaded PDF lab reports.

> **Medical disclaimer:** The assistant and report analyzer provide **general educational information only**. They are **not** a diagnosis, prescription, or substitute for a licensed clinician. Always seek professional care for urgent or serious symptoms.

---

## Table of contents

1. [What this project solves](#what-this-project-solves)
2. [Feature overview](#feature-overview)
3. [Technology stack](#technology-stack)
4. [System architecture](#system-architecture)
5. [Data model](#data-model)
6. [Queue & scheduling logic](#queue--scheduling-logic)
7. [AI / RAG / ML pipeline](#ai--rag--ml-pipeline)
8. [Knowledge bases & datasets](#knowledge-bases--datasets)
9. [Medical agent & tools](#medical-agent--tools)
10. [PDF report analysis](#pdf-report-analysis)
11. [User roles & journeys](#user-roles--journeys)
12. [Repository layout](#repository-layout)
13. [Environment variables](#environment-variables)
14. [Getting started](#getting-started)
15. [API reference (summary)](#api-reference-summary)
16. [Frontend routes](#frontend-routes)
17. [Demo accounts](#demo-accounts)
18. [Operational notes & limitations](#operational-notes--limitations)
19. [License & attribution](#license--attribution)

---

## What this project solves

| Area | Description |
|------|-------------|
| **Problem space** | Coordinate outpatient visits: find hospitals/doctors, book visits, show transparent waiting-room state, and give staff operational tools. |
| **Core product** | Multi-role web app + REST API + real-time queue over WebSockets. |
| **AI layer** | Local LLM (**Ollama**) combined with **dense retrieval** (FAISS + sentence-transformers) over bundled medical Q&A and symptom–disease corpora. Optional **graph-based** symptom context (NetworkX). |

---

## Feature overview

### Core platform

- **Role-based access:** Patient, Doctor, Hospital Admin, Super Admin — separate dashboards, navigation, and protected routes.
- **Hospitals & doctors:** Public search, departments, profiles, registration, and **approval workflows** (inactive doctors/hospitals cannot receive bookings).
- **Appointments:** Book by hospital and doctor; automatic **daily token numbers** and **estimated slot times** (10-minute slots from 09:00).
- **Live queue:** WebSocket channel per doctor/date; patients see position and delay; doctors apply cumulative delay adjustments that broadcast to all clients.
- **Notifications:** In-app notifications (approvals, reminders, etc.).

### AI assistant (integrated in main backend)

| Capability | Endpoint / UI | Technique |
|------------|---------------|-----------|
| Chat + booking | `POST /chatbot/chat`, `/patient/chatbot` | RAG retrieval + Ollama tool-calling agent |
| Legacy chat body | `POST /chatbot/query` | Same pipeline, different JSON shape |
| PDF report upload | `POST /chatbot/analyze-report`, `/patient/reports` | PyMuPDF text extraction + RAG context + Ollama JSON extraction |

---

## Technology stack

### Frontend

| Layer | Technology | Role |
|-------|------------|------|
| Framework | **React 19** | UI components and routing |
| Build | **Vite 7** | Dev server and production bundle |
| Language | **TypeScript 5.9** | Type-safe SPA |
| Styling | **Tailwind CSS 3** | Utility-first layout |
| Components | **shadcn/ui** (Radix primitives) | Accessible dialogs, forms, tables, etc. |
| Routing | **React Router 7** | Public + role-scoped nested routes |
| Data fetching | **TanStack Query 5** + **Axios** | Server state and HTTP client |
| Forms | **React Hook Form** + **Zod** | Validated inputs |
| Charts | **Recharts** | Admin/analytics visuals |
| Motion | **Framer Motion** | UI animations |
| Theming | **next-themes** | Light/dark mode |

### Backend

| Layer | Technology | Role |
|-------|------------|------|
| API | **FastAPI** | REST + WebSocket endpoints |
| ORM | **SQLModel** / **SQLAlchemy 2** | Models and queries |
| Server | **Uvicorn** | ASGI host |
| Realtime | **Starlette WebSockets** | Queue fan-out (`app/sockets.py`) |
| DB (default) | **SQLite** (`healthease.db`) | Local development |
| DB (optional) | **MySQL** via `DATABASE_URL` + PyMySQL | Production-style deployment |
| PDF | **PyMuPDF (`fitz`)** | Extract text from uploaded reports |
| HTTP client | **requests** | Ollama API calls |

### AI / ML / retrieval

| Component | Library / model | Purpose |
|-----------|-----------------|---------|
| Embeddings | **sentence-transformers** — `all-MiniLM-L6-v2` | 384-dim dense vectors for queries and corpus rows |
| Vector index | **FAISS** (`faiss-cpu`) | Fast similarity search (L2 and inner-product indexes) |
| Data prep | **pandas** | Load CSV knowledge bases |
| Graph | **NetworkX** | Disease ↔ symptom neighborhood for agent hints |
| LLM runtime | **Ollama** (default `qwen3:4b-instruct`) | Intent routing, chat, tool calls, structured JSON for reports |
| Legacy chatbot | **LangChain** loaders/splitters (standalone folder only) | Optional PDF chunking in `chatbot/.../src/helper.py`; **not** used by integrated backend |

---

## System architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser (React SPA)                                                     │
│  • REST: auth, CRUD, appointments, queue delay, chatbot, reports       │
│  • WS:   /ws/queue/{doctor_id}?date=YYYY-MM-DD                         │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  FastAPI (backend/app/main.py)                                           │
│  ├── SQLModel → SQLite / MySQL                                           │
│  ├── queue_logic.py + queue_state.py + booking_service.py              │
│  ├── sockets.py (ConnectionManager broadcast)                          │
│  └── services/                                                           │
│       ├── rag_service.py      → FAISS + embeddings + intent routing    │
│       └── medical_agent.py    → Ollama agent, tools, graph, report JSON  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
┌──────────────────────────┐        ┌──────────────────────────┐
│  Ollama (localhost)       │        │  Knowledge on disk        │
│  /api/generate (intent)   │        │  medquad.csv              │
│  /api/chat (agent/tools)  │        │  Symptom2Disease.csv      │
└──────────────────────────┘        │  medquad.index / symptoms.index │
                                  └──────────────────────────┘
```

**Integration note:** The folder `chatbot/RAG-based-Medical-Chatbot-main/` contains a **standalone** FastAPI chatbot (`app.py` + static UI). **HealthEase production flow uses** `backend/app/services/` and reads datasets from `chatbot/.../data/` via `RAG_DATA_DIR`. You do **not** need to run the legacy server for the main app.

---

## Data model

SQLModel tables in `backend/app/models.py`:

| Entity | Key fields | Relationships |
|--------|------------|---------------|
| **SuperAdmin** | email, password, name, role | Platform oversight |
| **Hospital** | name, address, registrationNumber, `isActive` | Parent for departments, doctors |
| **Department** | hospitalId, name | Groups doctors |
| **HospitalAdmin** | hospitalId, email | Manages one hospital |
| **Doctor** | hospitalId, departmentId, specialization, `isActive`, license | Receives appointments |
| **Patient** | age, bloodGroup, medicalHistorySummary | Books visits, uses chatbot |
| **Appointment** | patientId, doctorId, hospitalId, date, tokenNumber, status, estimatedTime | Queue unit |
| **Notification** | userId, title, message, type, read, createdAt | In-app alerts |

**Appointment statuses:** `waiting`, `completed`, `skipped`, `scheduled`, `cancelled` (queue advancement uses `waiting` → `completed` / `skipped`).

**Auth (demo):** `POST /auth/login` checks plain passwords against role tables. The SPA stores the user in **`localStorage`** — **no JWT** in the current build.

---

## Queue & scheduling logic

Implemented in `backend/app/queue_logic.py` (mirrored in `frontend/src/lib/queueConfig.ts`).

| Constant | Value | Meaning |
|----------|-------|---------|
| `SLOT_MINUTES` | 10 | Each token maps to a 10-minute consultation window |
| `OPD_START_HOUR` / `MINUTE` | 09:00 | First slot of the day |

### Algorithms (deterministic, not ML)

1. **Next token:** For a given `doctor_id` + calendar day, `tokenNumber = max(existing tokens) + 1`.
2. **Estimated clock:** Token `n` → minutes from midnight = `(n - 1) × SLOT_MINUTES + (9 × 60)` → `HH:MM` string.
3. **Now serving:** Among appointments with `status == "waiting"` for that day, ordered by `tokenNumber`, the **lowest token** is “now serving.”
4. **Cumulative delay:** Doctors POST extra minutes to `queue_state.py` (in-memory map keyed `doctor_id:YYYY-MM-DD`). Frontend computes wait as `patientsAhead × SLOT_MINUTES + delayMinutes`.
5. **Broadcast:** After booking, status change, or delay update, `booking_service` / main routes call `manager.broadcast()` with a `QUEUE_STATE` payload.

**Important:** Queue delay is **ephemeral** — restarting the API clears cumulative delay unless you add persistence.

---

## AI / RAG / ML pipeline

### High-level flow (chat)

```text
User message
    │
    ├─► rag_service.retrieve_kb_context()
    │       ├─► Ollama classify_intent → SYMPTOMS | QUESTION
    │       ├─► Encode query (MiniLM-L6-v2)
    │       └─► FAISS search → top-1 row from MedQuAD or Symptom2Disease
    │
    └─► medical_agent.chat(kb_context=...)
            ├─► FAISS IndexFlatIP + cosine-style score on symptom descriptions
            ├─► Optional NetworkX neighbors for related symptom phrases
            ├─► Ollama /api/chat with tools (list doctors, appointments, book)
            └─► Session history per session_id (in-memory)
```

### Step 1 — Embedding model

- **Model:** `sentence-transformers/all-MiniLM-L6-v2`
- **Output dimension:** 384
- **Type:** Bi-encoder; query and documents embedded in the same space for similarity search.

### Step 2 — Index construction (`rag_service.py`)

On first run (or if `.index` files are missing):

1. Load `medquad.csv` and `Symptom2Disease.csv`.
2. Flatten each row to a single whitespace-joined string (all columns).
3. `embedder.encode(corpus)` → float32 matrices.
4. Build two **FAISS `IndexFlatL2`** indexes (exact L2 search, no training).
5. Persist `medquad.index` and `symptoms.index` next to the CSVs for fast startup.

### Step 3 — Intent routing (LLM-assisted)

`classify_intent(user_query)` sends a short prompt to Ollama **`/api/generate`** (streaming). Expected labels:

- **`SYMPTOMS`** → search **symptoms** FAISS index
- **`QUESTION`** (default on failure) → search **MedQuAD** index

This is **not** a classical classifier; it is zero-shot instruction following by the local LLM.

### Step 4 — Retrieval

- Encode user query: `embedder.encode([query])`
- `index.search(vector, k=1)` → nearest neighbor row text returned as `kb_context` (passed to the agent, truncated in prompts).

### Step 5 — Agent-side symptom matching (`medical_agent.py`)

Additional ML on the **Symptom2Disease** descriptions:

| Technique | Detail |
|-----------|--------|
| **Normalized embeddings** | `encode(..., normalize_embeddings=True)` |
| **FAISS `IndexFlatIP`** | Inner product on unit vectors ≈ **cosine similarity** |
| **Thresholds** | `SYMPTOM_COSINE_THRESHOLD = 0.55`, `HIGH_CONFIDENCE = 0.75` |
| **Graph** | `networkx.Graph` edges `(disease, symptom)` from CSV; neighbors suggest related phrases **without** asserting diagnosis |
| **Prompt policy** | System rules forbid claiming the patient “has” a disease; triage language only |

When score > 0.55, the user message is rewritten with internal hints + optional KB excerpt before Ollama sees it.

### Step 6 — Generation & tools

- **API:** Ollama **`/api/chat`** with `tools` schema (OpenAI-style function definitions).
- **Tools:** `get_available_doctors`, `list_my_appointments`, `book_appointment` → same validation as `booking_service.create_booking`.
- **Multi-turn:** Tool results appended; second chat call produces the final natural-language reply.
- **Sessions:** `session_id` maps to message history in process memory (lost on API restart).

### Algorithms summary table

| Name | Category | Where | Notes |
|------|----------|-------|-------|
| Dense semantic retrieval | Information retrieval | `rag_service.py` | MiniLM + FAISS L2, top-k=1 |
| Intent routing | LLM prompting | `rag_service.classify_intent` | SYMPTOMS vs QUESTION |
| Cosine similarity search | Vector similarity | `medical_agent.py` | FAISS IndexFlatIP, normalized vectors |
| Graph neighborhood expansion | Graph algorithm | NetworkX | Related symptom phrases for prompts |
| Tool-calling agent | LLM orchestration | Ollama chat + JSON tool args | Books real appointments in DB |
| Structured extraction | LLM JSON mode | `analyze_report_with_rag` | Findings array from report text |
| Token queue math | Deterministic scheduling | `queue_logic.py` | Not machine learning |

---

## Knowledge bases & datasets

Located under `chatbot/RAG-based-Medical-Chatbot-main/data/` (override with `RAG_DATA_DIR`):

| File | Typical use | Index file |
|------|-------------|------------|
| **medquad.csv** | Patient–consumer medical Q&A (MedQuAD-style) | `medquad.index` |
| **Symptom2Disease.csv** | Symptom descriptions labeled with disease names | `symptoms.index` |

**Symptom CSV columns** (agent normalizes): `label` → disease, `text` → description; symptom phrase derived from first 120 chars of description.

**Attribution:** If you redistribute or publish derivatives, retain appropriate credit for **MedQuAD**, **Symptom2Disease**, and any other third-party medical corpora you bundle.

---

## Medical agent & tools

Defined in `backend/app/services/medical_agent.py`.

### Tool schema

| Tool | Requires patient login | Behavior |
|------|------------------------|----------|
| `get_available_doctors` | No | Lists active doctors with `doctor_id`, `hospital_id`, specialization |
| `list_my_appointments` | Yes (`patient_id`) | Recent appointments for patient |
| `book_appointment` | Yes | `create_booking()` — token, estimated time, WebSocket broadcast |

### Safety-oriented system prompt

- Only reference symptoms the user explicitly mentioned.
- Refuse non-medical abuse; short bullet medical guidance.
- Confirm IDs and date before booking.

---

## PDF report analysis

**Endpoint:** `POST /chatbot/analyze-report` (multipart field `file`, PDF only).

**Pipeline:**

1. Save upload to temp file → **PyMuPDF** `page.get_text()` per page.
2. `retrieve_kb_context(first ~2000 chars)` for educational context.
3. Ollama chat with `format: "json"` → array of `{ "status": "normal"|"abnormal"|"borderline", "finding": "..." }`.
4. Response: `{ filename, findings, kb_context }`.

Again: output is **assistive interpretation**, not a clinical diagnosis.

---

## User roles & journeys

| Role | Typical actions |
|------|-----------------|
| **Patient** | Search, book, queue view, chatbot, PDF reports, profile, notifications |
| **Doctor** | Daily queue, delay adjustments, appointments, patients, availability |
| **Hospital admin** | Departments, doctors, approve new doctors, hospital appointments |
| **Super admin** | Users, hospital activation, doctor approvals, platform metrics |

### Booking (UI or chatbot)

1. Select hospital + doctor + date (chatbot uses tool-discovered UUIDs).
2. Backend assigns next token; sets `estimatedTime`; `status = waiting`.
3. WebSocket clients receive updated `QUEUE_STATE`.

### Live queue

1. Connect `WS /ws/queue/{doctor_id}?date=YYYY-MM-DD`.
2. Receive `QUEUE_STATE` (now serving, waiting count, delay).
3. Doctor: `POST /queue/{doctor_id}/delay` or reset; `PATCH /appointments/{id}/status` advances queue.

---

## Repository layout

```text
healthEase-/
├── frontend/                          React SPA
│   ├── src/
│   │   ├── api/client.ts              API base URL (default http://localhost:8000)
│   │   ├── lib/queueConfig.ts         Slot math + WebSocket URL (sync with backend)
│   │   ├── pages/patient/             Book, Queue, Chatbot, Reports, ...
│   │   ├── pages/doctor/              DoctorQueue, ...
│   │   └── components/ui/             shadcn primitives
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py                    Routes: auth, CRUD, queue, chatbot, WS
│   │   ├── models.py                  SQLModel entities
│   │   ├── database.py                Engine + sessions
│   │   ├── queue_logic.py             Token + slot algorithms
│   │   ├── queue_state.py             In-memory delay map
│   │   ├── booking_service.py         Shared booking + broadcast
│   │   ├── sockets.py                 WebSocket manager
│   │   └── services/
│   │       ├── rag_service.py         FAISS + embeddings + intent
│   │       └── medical_agent.py       Ollama agent, graph, report JSON
│   ├── seed_db.py                     Demo hospitals, doctors, patients, queue
│   └── requirements.txt
└── chatbot/RAG-based-Medical-Chatbot-main/
    ├── data/                          CSVs + generated *.index
    ├── app.py                         Legacy standalone API (optional)
    └── src/                           Original helpers (LangChain PDF utilities)
```

---

## Environment variables

Create `backend/.env` for overrides:

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATABASE_URL` | SQLAlchemy URL | `sqlite:///./healthease.db` |
| `RAG_DATA_DIR` | Folder with `medquad.csv` and `Symptom2Disease.csv` | `<repo>/chatbot/RAG-based-Medical-Chatbot-main/data` |
| `OLLAMA_URL` | Ollama generate API (intent classification) | `http://localhost:11434/api/generate` |
| `OLLAMA_CHAT_URL` | Ollama chat API (agent + tools + report JSON) | `http://localhost:11434/api/chat` |
| `OLLAMA_MODEL` | Model name (must support chat + tools) | `qwen3:4b-instruct` |

Frontend API base: `frontend/src/api/client.ts` (default `http://localhost:8000`).

---

## Getting started

### Prerequisites

- **Node.js** (LTS) and npm
- **Python 3.11+** recommended
- **Ollama** for chat and report AI — [ollama.com](https://ollama.com); pull a model matching `OLLAMA_MODEL` with tool-use support

### 1. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python seed_db.py
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API: `http://127.0.0.1:8000`
- OpenAPI: `http://127.0.0.1:8000/docs`

**First RAG use:** Building FAISS indices can take several minutes; later runs load `*.index` from disk.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Vite prints the local URL (often `http://localhost:5173`).

### 3. Ollama

```powershell
ollama pull qwen3:4b-instruct
```

Keep the Ollama daemon running while using chat or report features.

---

## API reference (summary)

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /auth/login` |
| **CRUD** | `/patients`, `/doctors`, `/hospitals`, `/departments`, `/appointments`, `/notifications`, admin creates |
| **Queue** | `GET /queue/state/{doctor_id}?date=`, `POST /queue/{doctor_id}/delay`, `POST .../delay/reset`, `WS /ws/queue/{doctor_id}?date=` |
| **Appointments** | `POST /appointments`, `GET /appointments`, `PATCH /appointments/{id}/status` |
| **Chatbot** | `POST /chatbot/chat`, `POST /chatbot/query`, `POST /chatbot/analyze-report` |

**Chat request body:**

```json
{
  "message": "I have a headache and mild fever",
  "patient_id": "<uuid-if-logged-in>",
  "session_id": "<optional-continue-thread>"
}
```

---

## Frontend routes

| Path | Access |
|------|--------|
| `/`, `/login`, `/register` | Public |
| `/doctors`, `/hospitals` | Public search |
| `/patient/*` | Dashboard, book, queue, appointments, reports, chatbot, history, notifications |
| `/doctor/*` | Dashboard, queue, appointments, patients, availability |
| `/hospital/*` | Dashboard, departments, doctors, appointments, doctor approvals |
| `/admin/*` | Dashboard, metrics, users, hospital/doctor approvals |

---

## Demo accounts

After `python seed_db.py` (see `seed_db.py` for full set):

| Role | Email | Password |
|------|--------|----------|
| Patient (queue demo) | `patient3@test.com` | `pass123` |
| Doctor | `dr.sharma@srn.gov.in` | `pass123` |
| Super Admin | `admin@healthease.com` | `pass123` |

Use seeded `doctorId` / `hospitalId` when testing chatbot booking tools.

---

## Operational notes & limitations

| Topic | Detail |
|-------|--------|
| **Security** | Plain-text passwords, no JWT — suitable for demos only |
| **Queue delay** | In-memory only; API restart clears doctor delay |
| **Slot sync** | Keep `queue_logic.py` and `queueConfig.ts` constants aligned |
| **RAG sessions** | Agent chat history in RAM; restart clears threads |
| **Ollama** | Chat/report endpoints return 503 if model or daemon unavailable |
| **UI primitives** | `frontend/src/components/ui/` are shadcn — treat as design system |

---

## License & attribution

Built for healthcare management education and demos. Include attribution for **MedQuAD**, **Symptom2Disease**, **sentence-transformers**, **FAISS**, and other bundled dependencies when redistributing.

---

## Context prompt (for AI assistants)

```text
HealthEase: FastAPI + SQLModel (SQLite default, optional MySQL), React 19 + Vite + TypeScript + TanStack Query + shadcn. Auth is POST /auth/login, no JWT; user in localStorage. OPD: per-doctor daily tokens, 10-min slots from 09:00 (queue_logic.py + queueConfig.ts must match). Live queue: WS /ws/queue/{doctor_id}; delay in queue_state.py (memory). RAG: backend/app/services — MiniLM-L6-v2, FAISS L2 (MedQuAD/symptoms), intent via Ollama generate; agent uses FAISS IP + NetworkX + Ollama chat tools. Reports: PyMuPDF + JSON Ollama. Not a medical diagnosis system. Minimal diffs.
```

---

*HealthEase — structured OPD workflows, real-time queues, and a local LLM + retrieval stack grounded in open medical Q&A and symptom corpora.*
