from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from model import Disaster
from model.enums import DisasterSource
from schema.request.disaster_create_request import DisasterCreateRequest


class DisasterRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int, loc_id: int):
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
        self.db.add(new_disaster)
        self.db.commit()
        self.db.refresh(new_disaster)
        return new_disaster

    def get_disaster(self, disaster_id):
        disaster = self.db.query(Disaster).filter(Disaster.id == disaster_id).first()

        if disaster is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Disaster not found"
            )

        return disaster
