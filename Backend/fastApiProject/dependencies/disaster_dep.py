from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from dependencies.location_dep import get_location_service, build_location_service
from messaging.publisher import EventPublisher
from repository.disaster_repo import DisasterRepository
from service.disaster_service import DisasterService
from service.location_service import LocationService


def build_disaster_service(db: Session) -> DisasterService:
    disaster_repo = DisasterRepository()
    location_service = build_location_service(db)
    publisher = EventPublisher()
    return DisasterService(disaster_repo, location_service, publisher, db)


def get_disaster_service(
        db: Session = Depends(get_db),
        location_service: LocationService = Depends(get_location_service),
):
    repo = DisasterRepository()
    publisher = EventPublisher()
    return DisasterService(repo, location_service, publisher, db)
