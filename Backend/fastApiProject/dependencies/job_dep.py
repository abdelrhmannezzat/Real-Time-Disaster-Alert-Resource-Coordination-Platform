from config.database import SessionLocal
from dependencies.disaster_dep import build_disaster_service
from service.jobs_service import JobService


def build_job_service() -> JobService:
    db = SessionLocal()
    disaster_service = build_disaster_service(db)
    return JobService(disaster_service, db)
