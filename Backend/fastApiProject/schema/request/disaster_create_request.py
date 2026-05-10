from datetime import datetime

from pydantic import BaseModel

from model.enums import DisasterType, DisasterSeverity, DisasterSource, DisasterStatus


class DisasterCreateRequest(BaseModel):
    title: str
    description: str | None = None
    type: DisasterType
    severity: DisasterSeverity
    status: DisasterStatus
    radius: float
    start_time: datetime
    end_time: datetime | None = None
    latitude: float
    longitude: float
    city: str | None = None
    country: str | None = None

    class Config:
        from_attributes = True
