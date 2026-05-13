from geoalchemy2 import WKTElement
from sqlalchemy import func
from sqlalchemy.orm import Session
from messaging.publisher import EventPublisher
from model import Location, Disaster
from repository.interfaces.disaster_repo_interface import IDisasterRepository
from schema.request.disaster_create_request import DisasterCreateRequest
from schema.request.location_create_request import LocationCreateRequest
from service.location_service import LocationService


class DisasterService:
    def __init__(self,
                 disaster_repo: IDisasterRepository,
                 location_service: LocationService,
                 publisher: EventPublisher,
                 db: Session
    ):
        self.disaster_repo = disaster_repo
        self.location_service = location_service
        self.publisher = publisher
        self.db = db

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int):
        location_dto = LocationCreateRequest(
            latitude=disaster.latitude,
            longitude=disaster.longitude,
            city=disaster.city,
            country=disaster.country
        )
        loc = self.location_service.create_location(location_dto, self.db)
        disaster = self.disaster_repo.create_disaster_manually(disaster, user_id, loc.id, self.db)

        payload = {
            'id': disaster.id,
            'title': disaster.title,
            'severity': disaster.severity,
            'latitude': loc.latitude,
            'longitude': loc.longitude
        }

        self.publisher.publish_disaster_created(payload)

        return disaster

    def get_disaster(self, disaster_id: int):
        return self.disaster_repo.get_disaster(disaster_id, self.db)

    def persist_disasters_third_party(self, disasters):
        for disaster in disasters:
            location = Location(
                latitude=disaster.latitude,
                longitude=disaster.longitude,
                city=disaster.city,
                country=disaster.country,
                coordinates=WKTElement(f"POINT({disaster.longitude} {disaster.latitude})", srid=4326)
            )

            if self.disaster_repo.external_id_exists(disaster.external_id, self.db):
                continue
            try:

                location = self.location_service.create_location_no_commit(location, self.db)

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
                new_disaster = self.disaster_repo.create_disaster_no_commit(new_disaster, self.db)

                self.db.commit()

                payload = {
                    'id': new_disaster.id,
                    'title': new_disaster.title,
                    'severity': new_disaster.severity,
                    'latitude': location.latitude,
                    'longitude': location.longitude
                }

                self.publisher.publish_disaster_created(payload)
                # print("Created " + disaster.title)
            except Exception as exp:
                # print(exp)
                self.db.rollback()

    def get_disaster_nearby(self, lat, lng, rad, sev, typ):
        return self.disaster_repo.get_disaster_nearby(lat, lng, rad, sev, typ, self.db)





