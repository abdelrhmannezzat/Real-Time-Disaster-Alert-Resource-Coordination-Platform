from typing import Protocol

from sqlalchemy.orm import Session

from model import Location
from schema.request.location_create_request import LocationCreateRequest


class ILocationRepository(Protocol):

    def create_location(self, location: LocationCreateRequest, db: Session):
        ...

    def create_location_no_commit(self, location: Location, db: Session):
        ...
