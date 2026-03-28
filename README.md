# 🩺 HealthEase Application

![HealthEase Banner](https://img.shields.io/badge/HealthEase-Comprehensive%20Medical%20App-blue?style=for-the-badge&logo=health)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**HealthEase** is a modern, full-stack medical application designed to streamline healthcare management by enabling seamless interactions between Patients, Doctors, and Hospital Administrators.

It features secure role-based portals, an advanced real-time queue live tracker using WebSockets, and a robust REST API backend.

---

## ✨ Features

- **🔐 Multi-Role Authentication:** Dedicated dashboards and permission sets for Patients, Doctors, Hospital Admins, and Super Admins.
- **⏱️ Real-Time Live Tracker:** Patients can track their place in the doctor's queue in real-time, powered by FastAPI WebSockets.
- **🧑‍⚕️ Doctor & Hospital Directory:** Easy search and discovery of hospitals and specialized doctors.
- **📅 Appointment Management:** Comprehensive token and scheduling systems.
- **🤖 Isolated Chatbot Module:** Ready-to-use architecture for integrating AI/RAG-based medical chatbot services safely.

---

## 📂 Project Structure

The repository is modularly structured to cleanly separate concerns:

- 📁 `frontend/` - Contains the React + Vite web application using TypeScript, TailwindCSS, and shadcn/ui.
- 📁 `backend/` - Contains the FastAPI server, MySQL/SQLModel database schema, and core REST API endpoints.
- 📁 `chatbot/` - Contains the foundational service module intended for AI/RAG capabilities.

---

## 🚀 Getting Started

Follow these steps to run the complete environment locally.

### 1. Database and Backend Environment

You will need a **MySQL** instance running locally. Ensure your MySQL credentials match what is specified in `backend/app/database.py`.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Command Prompt (CMD)**:
     ```cmd
     venv\Scripts\activate
     ```
   - **PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Seed Mock Data:**
   We have included a comprehensive data-seeding script that generates hospitals, departments, doctors, patients, appointments, and live queue tracking scenarios. This will drop existing tables and provide a clean, fully-populated database to test with:
   ```bash
   .\venv\Scripts\python.exe seed_db.py
   ```
5. Start the backend development server:
   ```bash
   .\venv\Scripts\uvicorn.exe app.main:app --reload
   ```
   *The server will typically start on `http://127.0.0.1:8000`. You can view interactive API documentation at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Environment

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will be running on `http://localhost:5173/`.*

---

## 🧪 Testing with Mock Data

If you successfully ran `seed_db.py`, you can log in to the system immediately using these dummy accounts:

- **Patient (Queue live tracking demo):**
  - Email: `patient3@test.com`
  - Password: `pass123`
- **Doctor (Advance the queue):**
  - Email: `dr.sharma@srn.gov.in`
  - Password: `pass123`
- **Super Admin:**
  - Email: `admin@healthease.com`
  - Password: `pass123`

---

## ⚠️ Notes for Contributors  

- Make sure not to delete vital components in `frontend/src/components/ui/` as they contain core **shadcn** components configured for the application's specific styling.
- All AI configurations and chatbot API logic should remain isolated within the `chatbot/` directory.

---

*Built with ❤️ for better healthcare management.*
