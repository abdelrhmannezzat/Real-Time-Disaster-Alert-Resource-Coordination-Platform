from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from model import Disaster
from model.enums import DisasterSource
from schema.request.disaster_create_request import DisasterCreateRequest


class DisasterRepository:
    def __init__(self):
        pass

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int, loc_id: int, db: Session):
        new_disaster = Disaster(
            created_by=user_id,
            title=disaster.title,
            description=disaster.description,
            type=disaster.type,
            severity=disaster.severity,
            status=disaster.status,
            radius=disaster.radius,
            location_id=loc_id,
            source=DisasterSource.MANUAL,
            start_time=disaster.start_time,
            end_time=disaster.end_time,
        )
        db.add(new_disaster)
        db.commit()
        db.refresh(new_disaster)
        return new_disaster

    def get_disaster(self, disaster_id, db: Session):
        disaster = db.query(Disaster).filter(Disaster.id == disaster_id).first()

        if disaster is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Disaster not found"
            )

        return disaster

    def create_disaster_no_commit(self, disaster: Disaster, db: Session):
        db.add(disaster)
        db.flush()
        return disaster

    def external_id_exists(self, external_id: str, db: Session):
        temp = db.query(Disaster).filter(Disaster.external_id == external_id).first()
        if not temp:
            return False
        return True
