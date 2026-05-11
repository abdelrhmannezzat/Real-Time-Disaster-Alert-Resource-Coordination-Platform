from fastapi import Depends
from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from config.database import get_db
from model import Location, Disaster
from repository.disaster_repo import DisasterRepository
from schema.request.disaster_create_request import DisasterCreateRequest
from schema.request.location_create_request import LocationCreateRequest
from service.location_service import LocationService


class DisasterService:
    def __init__(self,
                 disaster_repo: DisasterRepository,
                 location_service: LocationService
    ):
        self.disaster_repo = disaster_repo
        self.location_service = location_service

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int, db: Session):
        location_dto = LocationCreateRequest(
            latitude=disaster.latitude,
            longitude=disaster.longitude,
            city=disaster.city,
            country=disaster.country
        )
        loc = self.location_service.create_location(location_dto, db)
        return self.disaster_repo.create_disaster_manually(disaster, user_id, loc.id, db)

    def get_disaster(self, disaster_id: int, db: Session):
        return self.disaster_repo.get_disaster(disaster_id, db)

    def persist_disasters_third_party(self, disasters, db: Session):
        for disaster in disasters:
            location = Location(
                latitude=disaster.latitude,
                longitude=disaster.longitude,
                city=disaster.city,
                country=disaster.country,
                coordinates=WKTElement(f"POINT({disaster.longitude} {disaster.latitude})", srid=4326)
            )

            if self.disaster_repo.external_id_exists(disaster.external_id, db):
                continue
            try:

                location = self.location_service.create_location_no_commit(location, db)

                new_disaster = Disaster(
                    title=disaster.title,
                    description=disaster.description,
                    type=disaster.type,
                    severity=disaster.severity,
                    source=disaster.source,
                    status=disaster.status,
                    radius=disaster.radius,
                    location_id=location.id,
                    external_id=disaster.external_id,
                    start_time=disaster.start_time,
                    end_time=disaster.end_time
                )
                new_disaster = self.disaster_repo.create_disaster_no_commit(new_disaster, db)

                db.commit()
                print("Created " + disaster.title)
            except Exception as exp:
                print(exp)
                db.rollback()





