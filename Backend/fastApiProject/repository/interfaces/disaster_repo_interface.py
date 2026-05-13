from typing import Protocol

from sqlalchemy.orm import Session

from model import Disaster
from schema.request.disaster_create_request import DisasterCreateRequest


class IDisasterRepository(Protocol):

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int, loc_id: int, db: Session):
        ...

    def get_disaster(self, disaster_id, db: Session):
        ...

    def create_disaster_no_commit(self, disaster: Disaster, db: Session):
        ...

    def external_id_exists(self, external_id: str, db: Session):
        ...

    def get_disaster_nearby(self, lat, lng, rad, sev, typ, db):
        ...
