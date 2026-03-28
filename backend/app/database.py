import os
from sqlmodel import create_engine, SQLModel, Session
from dotenv import load_dotenv

load_dotenv()

# MySQL Database connection with password "tiger"
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:tiger@localhost:3306/healthease")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
