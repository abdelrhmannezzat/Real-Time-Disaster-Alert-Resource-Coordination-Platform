from fastapi import Depends
from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from config.database import get_db
from model import Location
from schema.request.location_create_request import LocationCreateRequest


class LocationRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def create_location(self, location: LocationCreateRequest):
        new_location = Location(
            latitude=location.latitude,
            longitude=location.longitude,
            city=location.city,
            country=location.country,
            coordinates=WKTElement(f"POINT({location.longitude} {location.latitude})", srid=4326)
        )

        self.db.add(new_location)
        self.db.commit()
        self.db.refresh(new_location)
        return new_location
