from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from repository.location_repo import LocationRepository
from service.location_service import LocationService


def build_location_service(db: Session) -> LocationService:
    location_repo = LocationRepository()
    return LocationService(location_repo, db)


def get_location_service(db: Session = Depends(get_db)):
    location_repo = LocationRepository()
    return LocationService(location_repo, db)
