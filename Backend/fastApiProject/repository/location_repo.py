from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session
from model import Location
from repository.interfaces.location_repo_interface import ILocationRepository
from schema.request.location_create_request import LocationCreateRequest


class LocationRepository(ILocationRepository):
    def __init__(self):
        pass

    def create_location(self, location: LocationCreateRequest, db: Session):
        new_location = Location(
            latitude=location.latitude,
            longitude=location.longitude,
            city=location.city,
            country=location.country,
            coordinates=WKTElement(f"POINT({location.longitude} {location.latitude})", srid=4326)
        )

        db.add(new_location)
        db.commit()
        db.refresh(new_location)
        return new_location

    def create_location_no_commit(self, location: Location, db: Session):
        db.add(location)
        db.flush()
        return location

