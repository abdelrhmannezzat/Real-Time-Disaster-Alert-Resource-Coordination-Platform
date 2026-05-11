from fastapi import Depends
from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from config.database import get_db
from model import Location
from schema.request.location_create_request import LocationCreateRequest


class LocationRepository:
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

