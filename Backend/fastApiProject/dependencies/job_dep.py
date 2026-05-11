from config.database import SessionLocal
from repository.disaster_repo import DisasterRepository
from repository.location_repo import LocationRepository
from service.disaster_service import DisasterService
from service.jobs_service import JobService
from service.location_service import LocationService


def build_job_service() -> JobService:
    db = SessionLocal()
    disaster_repo = DisasterRepository()
    location_repo = LocationRepository()
    location_service = LocationService(location_repo)
    disaster_service = DisasterService(disaster_repo, location_service)
    return JobService(disaster_service, db)
