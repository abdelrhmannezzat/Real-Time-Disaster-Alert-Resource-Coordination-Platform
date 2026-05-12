from config.database import SessionLocal
from dependencies.disaster_dep import get_disaster_service
from repository.disaster_repo import DisasterRepository
from repository.location_repo import LocationRepository
from service.disaster_service import DisasterService
from service.jobs_service import JobService
from service.location_service import LocationService


def build_job_service() -> JobService:
    db = SessionLocal()
    disaster_service = get_disaster_service()
    return JobService(disaster_service, db)
