from fastapi import HTTPException, status
from fastapi_pagination.ext.sqlalchemy import paginate
from geoalchemy2 import WKTElement
from sqlalchemy import func
from sqlalchemy.orm import Session
from model import Disaster, Location
from model.enums import DisasterSource
from repository.interfaces.disaster_repo_interface import IDisasterRepository
from schema.request.disaster_create_request import DisasterCreateRequest


class DisasterRepository(IDisasterRepository):
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

    def get_disaster_nearby(self, lat, lng, rad, sev, typ, db):
        point = WKTElement(f"POINT({lng} {lat})", srid=4326)
        query = (
            db.query(
                Disaster.id,
                Disaster.title,
                Disaster.description,
                Disaster.severity,
                Disaster.radius,
                Location.longitude,
                Location.latitude,
                Location.city,
                Location.country
            )
            .join(Disaster.location)
        )
        if sev:
            query = query.filter(Disaster.severity == sev)

        if typ:
            query = query.filter(Disaster.type == typ)

        query = query.filter(
            Location.coordinates.isnot(None),
            func.ST_DWithin(Location.coordinates, point, rad * 1000)
        )

        return paginate(query)
