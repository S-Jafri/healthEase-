from sqlmodel import Session
from app.database import engine
from sqlmodel import SQLModel, select
from app.models import Hospital, Department, Doctor, Patient, Appointment, SuperAdmin, HospitalAdmin, Notification
import sys
import random
from datetime import datetime, timedelta

def seed_database():
    print("Initializing Database with Comprehensive Mock Data...")
    sys.stdout.flush()
    # Drop and recreate tables to ensure a clean slate for the big mock insertion
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        print("Seeding Hospitals...")
        sys.stdout.flush()
        hospitals = [
            Hospital(id="h-1", name="Swaroop Rani Nehru (SRN) Hospital", address="MG Marg, Allahabad", registrationNumber="UP-PRJ-Gov-001", contactEmail="admin@srnhospital.gov.in", isActive=True),
            Hospital(id="h-2", name="Kamla Nehru Memorial Hospital", address="Tagore Town", registrationNumber="UP-PRJ-Pvt-042", contactEmail="contact@knmh.org", isActive=True),
            Hospital(id="h-3", name="Jeevan Jyoti Hospital", address="Bai-Ka-Bagh", registrationNumber="UP-PRJ-Pvt-015", contactEmail="info@jeevanjyoti.in", isActive=True),
            Hospital(id="h-4", name="Apollo Spectra Hospitals", address="Civil Lines", registrationNumber="UP-PRJ-Pvt-055", contactEmail="care@apollo.in", isActive=True),
            Hospital(id="h-5", name="Nazareth Hospital", address="Kamla Nehru Road", registrationNumber="UP-PRJ-Pvt-022", contactEmail="admin@nazareth.org", isActive=False) # Testing inactive pending state
        ]
        session.add_all(hospitals)
        session.commit()

        print("Seeding Departments...")
        departments = [
            Department(id="d-1", hospitalId="h-1", name="Cardiology"),
            Department(id="d-2", hospitalId="h-1", name="Neurology"),
            Department(id="d-3", hospitalId="h-2", name="Oncology"),
            Department(id="d-4", hospitalId="h-2", name="Gynecology"),
            Department(id="d-5", hospitalId="h-3", name="Orthopedics"),
            Department(id="d-6", hospitalId="h-3", name="General Medicine"),
            Department(id="d-7", hospitalId="h-4", name="Pediatrics"),
            Department(id="d-8", hospitalId="h-4", name="Dermatology")
        ]
        session.add_all(departments)
        session.commit()

        print("Seeding Doctors & Admins...")
        docs = [
            Doctor(id="doc-1", email="dr.sharma@srn.gov.in", name="Dr. Arvind Sharma", role="DOCTOR", contactNumber="+91-9876543210", hospitalId="h-1", departmentId="d-1", qualifications="MBBS, MD", specialization="Cardiologist", experienceYears=18, licenseNumber="UPMC-45123", consultationFee=500.0, isActive=True),
            Doctor(id="doc-2", email="dr.verma@srn.gov.in", name="Dr. Sunita Verma", role="DOCTOR", contactNumber="+91-9876543211", hospitalId="h-1", departmentId="d-2", qualifications="MBBS, MS", specialization="Neurologist", experienceYears=12, licenseNumber="UPMC-45892", consultationFee=500.0, isActive=True),
            Doctor(id="doc-3", email="dr.gupta@knmh.org", name="Dr. Rakesh Gupta", role="DOCTOR", contactNumber="+91-9876543212", hospitalId="h-2", departmentId="d-3", qualifications="MBBS, DM", specialization="Oncologist", experienceYears=20, licenseNumber="UPMC-12345", consultationFee=800.0, isActive=True),
            Doctor(id="doc-4", email="dr.rani@knmh.org", name="Dr. Anjali Rani", role="DOCTOR", contactNumber="+91-9876543213", hospitalId="h-2", departmentId="d-4", qualifications="MBBS, MS", specialization="Gynecologist", experienceYears=15, licenseNumber="UPMC-78901", consultationFee=600.0, isActive=True),
            Doctor(id="doc-5", email="dr.singh@jeevanjyoti.in", name="Dr. Vikram Singh", role="DOCTOR", contactNumber="+91-9876543214", hospitalId="h-3", departmentId="d-5", qualifications="MBBS, MS", specialization="Orthopedics", experienceYears=25, licenseNumber="UPMC-23456", consultationFee=400.0, isActive=True),
            Doctor(id="doc-6", email="dr.desai@apollo.in", name="Dr. Neha Desai", role="DOCTOR", contactNumber="+91-9876543215", hospitalId="h-4", departmentId="d-7", qualifications="MBBS, MD", specialization="Pediatrician", experienceYears=8, licenseNumber="UPMC-34567", consultationFee=700.0, isActive=True),
            # Pending approvals
            Doctor(id="doc-7", email="dr.pending1@test.com", name="Dr. Amanda Foster", role="DOCTOR", contactNumber="+91-1112223333", hospitalId="h-1", departmentId="d-1", qualifications="MD", specialization="Cardiologist", experienceYears=5, licenseNumber="UPMC-PEND1", consultationFee=300.0, isActive=False),
            Doctor(id="doc-8", email="dr.pending2@test.com", name="Dr. Kevin Park", role="DOCTOR", contactNumber="+91-4445556666", hospitalId="h-3", departmentId="d-6", qualifications="DO", specialization="General Medicine", experienceYears=3, licenseNumber="UPMC-PEND2", consultationFee=200.0, isActive=False),
        ]
        session.add_all(docs)

        s_admin = SuperAdmin(id="sa-1", email="admin@healthease.com", name="Super Admin", role="SUPER_ADMIN")
        h_admin = HospitalAdmin(id="ha-1", email="admin@srnhospital.gov.in", name="SRN Admin", role="HOSPITAL_ADMIN", hospitalId="h-1")
        session.add_all([s_admin, h_admin])
        session.commit()

        print("Seeding Patients...")
        patient_names = ["Rahul Singh", "Priya Mishra", "Amit Verma", "Sneha Kumari", "Vikash Gupta", "Pooja Patel", "Rohan Das", "Ananya Reddy", "Kartik Sharma", "Meera Joshi", "Suresh Kumar", "Nisha Yadav", "Ramesh Tiwari"]
        patients = []
        for i, name in enumerate(patient_names):
            patients.append(Patient(
                id=f"pat-{i+1}", 
                email=f"patient{i+1}@test.com", 
                name=name, 
                role="PATIENT", 
                contactNumber=f"+91-9900000{i:03d}", 
                age=random.randint(20, 70), 
                bloodGroup=random.choice(["O+", "A+", "B+", "AB+", "O-"]), 
                medicalHistorySummary=random.choice(["No history", "Mild hypertension.", "Diabetic", "Asthma", "Migraines"])
            ))
        session.add_all(patients)
        session.commit()

        print("Seeding Appointments & Generating Queues...")
        # Create a busy schedule for Doctor 1 (Today)
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        apts = []
        for i in range(1, 8):
            apts.append(Appointment(
                id=f"apt-doc1-{i}", patientId=f"pat-{i}", doctorId="doc-1", hospitalId="h-1", 
                date=f"{today}T10:00:00Z", tokenNumber=i, 
                status="completed" if i < 3 else ("waiting" if i >= 3 else "scheduled"),
                estimatedTime=f"10:{i*15:02d}"
            ))
            
        # Add some appointments for Doctor 2
        for i in range(8, 12):
            apts.append(Appointment(
                id=f"apt-doc2-{i}", patientId=f"pat-{i}", doctorId="doc-2", hospitalId="h-1", 
                date=f"{today}T11:00:00Z", tokenNumber=i-7, 
                status="waiting",
                estimatedTime=f"11:{i*10:02d}"
            ))

        # Add some future appointments
        apts.append(Appointment(id="apt-future-1", patientId="pat-1", doctorId="doc-3", hospitalId="h-2", date=f"{tomorrow}T14:00:00Z", tokenNumber=1, status="scheduled", estimatedTime="14:00"))
        
        session.add_all(apts)
        session.commit()

        print("Seeding Notifications...")
        n1 = Notification(id="notif-1", userId="pat-1", title="Welcome back!", message="Your new patient dashboard features are unlocking.", type="info", read=False, createdAt=f"{today}T09:00:00Z")
        n2 = Notification(id="notif-2", userId="doc-1", title="Schedule Update", message="You have 7 waiting patients in the queue for today.", type="warning", read=False, createdAt=f"{today}T08:30:00Z")
        n3 = Notification(id="notif-3", userId="ha-1", title="System Check", message="The automated doctor directory sync was successful.", type="success", read=False, createdAt=f"{today}T08:00:00Z")
        n4 = Notification(id="notif-4", userId="sa-1", title="Pending Approvals", message="You have 2 new doctors waiting for license verification.", type="error", read=False, createdAt=f"{today}T07:30:00Z")
        session.add_all([n1, n2, n3, n4])
        session.commit()

        print("Comprehensive Dummy Database Seeded Successfully!")
        print(f"Total Patients: {len(patients)}")
        print(f"Total Doctors: {len(docs)}")
        print(f"Total Appointments: {len(apts)}")

if __name__ == "__main__":
    seed_database()
