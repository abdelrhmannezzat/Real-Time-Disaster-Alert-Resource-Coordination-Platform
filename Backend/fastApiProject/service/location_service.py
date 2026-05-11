from sqlalchemy.orm import Session

from model import Location
from repository.location_repo import LocationRepository
from schema.request.location_create_request import LocationCreateRequest


class LocationService:
    def __init__(self, location_repo: LocationRepository):
        self.location_repo = location_repo

    def create_location(self, location: LocationCreateRequest, db: Session):
        return self.location_repo.create_location(location, db)

    def create_location_no_commit(self, location: Location, db: Session):
        return self.location_repo.create_location_no_commit(location, db)
