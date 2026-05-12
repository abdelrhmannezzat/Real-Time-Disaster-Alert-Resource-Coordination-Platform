from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from model import Location
from repository.interfaces.location_repo_interface import ILocationRepository
from schema.request.location_create_request import LocationCreateRequest


class LocationService:
    def __init__(self,
                 location_repo: ILocationRepository,
                 db: Session
    ):
        self.location_repo = location_repo
        self.db = db

    def create_location(self, location: LocationCreateRequest):
        return self.location_repo.create_location(location, self.db)

    def create_location_no_commit(self, location: Location, db: Session) -> Location:
        return self.location_repo.create_location_no_commit(location, db)
