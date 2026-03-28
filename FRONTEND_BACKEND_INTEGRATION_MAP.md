# HealthEase V2: Frontend-to-Backend Integration Map

This document outlines all the data points, models, and API endpoints required to fully connect the React frontend to the Node.js/Prisma backend. 

Currently, the frontend uses `src/data/mockData.ts` and `AuthContext.tsx` to simulate these interactions. The goal is to replace these mocks with real `axios` calls to the backend API.

---

## 1. Authentication & User Management

**Frontend State:** `AuthContext.tsx`
**Current Data:** LocalStorage `user` object.

| Feature | Frontend Action | Required Backend Endpoint | Payload (Request) | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | Form submit on `/login` | `POST /api/auth/login` | `{ email, password }` | `{ token, user: UserData }` |
| **Registration** | Form submit on `/register` | `POST /api/auth/register` | `User Registration Payload` (Dynamic by Role) | `{ message, userId }` or `{ token, user }` if auto-login |
| **Get Session** | On app load (`AuthContext`) | `GET /api/auth/me` | *Requires JWT Header* | `{ user: UserData }` |
| **Logout** | Click "Logout" | *Client-side (Clear Token)* | N/A | N/A |

### 1.1 Role-Specific Registration Payloads
*   **Patient:** `name`, `email`, `password`, `contactNumber`, `dob`, `bloodGroup`
*   **Doctor:** `name`, `email`, `password`, `contactNumber`, `hospitalId`, `departmentId`, `specialization`, `qualifications`, `licenseNumber`, `experienceYears`, `consultationFee`
*   **Hospital Admin:** `name`, `email`, `password`, `contactNumber`, `registrationNumber`, `hospitalAddress`

---

## 2. Public Data (Unauthenticated)

**Frontend State:** `/public/SearchDoctors.tsx`, `/public/SearchHospitals.tsx`, `PatientBook.tsx`
**Current Data:** `MOCK_HOSPITALS`, `MOCK_DEPARTMENTS`, `MOCK_DOCTORS`

| Feature | Frontend Action | Required Backend Endpoint | Query Params | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| **List Hospitals** | Page Load / Search | `GET /api/hospitals` | `?search=term&city=name` | `Hospital[]` |
| **List Departments** | Selecting a Hospital | `GET /api/hospitals/:id/departments` | None | `Department[]` |
| **List Doctors** | Page Load / Search | `GET /api/doctors` | `?hospitalId=X&departmentId=Y&specialization=Z` | `Doctor[]` |
| **Doctor Details**| Click Doctor Profile | `GET /api/doctors/:id` | None | `DoctorDetails` |

---

## 3. Patient Module

**Frontend State:** `/patient/*` routes.
**Current Data:** `MOCK_APPOINTMENTS` (filtered by patientId), `patient.medicalHistorySummary`

| Feature | Frontend Action | Required Backend Endpoint | Payload / Query | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard Stats** | Load `/patient/dashboard` | `GET /api/patient/dashboard` | None | `{ upcomingCount, ... }` |
| **Book Appointment**| Form submit on `/patient/book` | `POST /api/appointments` | `{ doctorId, hospitalId, date, time }` | `{ success, appointmentId, tokenNumber }` |
| **My Appointments** | Load `/patient/appointments`| `GET /api/appointments/patient` | `?status=upcoming\|past` | `Appointment[]` |
| **Live Queue** | Load `/patient/queue` | `GET /api/queue/:appointmentId` | None | `{ currentToken, yourToken, estimatedTime }` |
| **Update Profile** | Submit Edit Profile Modal | `PUT /api/patient/profile` | `{ dob, contactNumber, bloodGroup }` | `{ success, user }` |

---

## 4. Doctor Module

**Frontend State:** `/doctor/*` routes.
**Current Data:** `MOCK_APPOINTMENTS` (filtered by doctorId).

| Feature | Frontend Action | Required Backend Endpoint | Payload / Query | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard Stats** | Load `/doctor/dashboard` | `GET /api/doctor/dashboard` | None | `{ todayPatients, ... }` |
| **Today's Schedule**| Load `/doctor/queue` | `GET /api/appointments/doctor`| `?date=YYYY-MM-DD` | `Appointment[]` |
| **Update Appt Status**| Click "Complete" or "Skip" | `PATCH /api/appointments/:id` | `{ status: 'completed' \| 'skipped' }`| `{ success }` |
| **Set Availability**| Load `/doctor/availability` | `PUT /api/doctor/availability`| `{ schedule: WeeklySlots }` | `{ success }` |
| **Update Profile** | Submit Edit Profile Modal | `PUT /api/doctor/profile` | `{ consultationFee, experience, ... }` | `{ success, user }` |

---

## 5. Hospital Admin Module

**Frontend State:** `/hospital/*` routes.

| Feature | Frontend Action | Required Backend Endpoint | Payload / Query | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| **Manage Doctors** | Load `/hospital/doctors` | `GET /api/hospital/doctors` | None | `Doctor[]` |
| **Approve Doctor** | Click "Approve" (New Doctor) | `PATCH /api/hospital/doctors/:id`| `{ isActive: true }` | `{ success }` |
| **Manage Depts** | Load `/hospital/departments` | `GET /api/hospital/departments`| None | `Department[]` |
| **All Appointments**| Load `/hospital/appointments` | `GET /api/appointments/hospital`| `?date=YYYY-MM-DD` | `Appointment[]` |

---

## 6. Super Admin Module

**Frontend State:** `/admin/*` routes.

| Feature | Frontend Action | Required Backend Endpoint | Payload / Query | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard Stats** | Load `/admin/dashboard` | `GET /api/admin/metrics` | None | `{ totalPatients, totalDoctors, ... }`|
| **Manage Users** | Load `/admin/users` | `GET /api/admin/users` | `?role=PATIENT\|DOCTOR` | `User[]` |
| **Pending Hospitals**| Load `/admin/hospitals` | `GET /api/admin/hospitals/pending`| None | `Hospital[]` |
| **Approve Hospital** | Click "Approve" | `PATCH /api/admin/hospitals/:id`| `{ isActive: true }` | `{ success }` |

---

## 7. Real-Time Services (WebSockets/Socket.io)

For the "Live Queue" feature, standard REST APIs (polling) can work, but WebSockets are strongly recommended matching the V1/V2 design.

*   **Socket Event:** `queueUpdate`
*   **Room:** `doctor_queue_${doctorId}_${date}`
*   **Payload emitted by server:** `{ doctorId, currentTokenNumber, status: 'active' | 'delayed' }`
*   **Frontend Action:** The `PatientQueue.tsx` component listens to this room to instantly update the "Current Token Running" UI without a page refresh.

---

## Migration Strategy (Next Steps)

To transition from `mockData.ts` to the Backend:
1.  **Setup Axios:** Create an `/src/api/axios.ts` or `apiClient.ts` instance with base URL and JWT interceptors.
2.  **Swap AuthContext:** Replace the `login()` and `register()` mock functions in `AuthContext` to formulate absolute API payloads and store real JWTs.
3.  **React Query (TanStack):** Ensure data fetching inside components (like `useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors })`) replaces static filtering from `mockData.json`.
