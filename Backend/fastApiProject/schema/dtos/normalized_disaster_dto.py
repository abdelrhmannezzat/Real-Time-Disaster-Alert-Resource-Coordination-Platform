from datetime import datetime

from pydantic import BaseModel

from model.enums import DisasterType, DisasterSeverity, DisasterStatus, DisasterSource


class NormalizedDisasterDto(BaseModel):
    title: str
    description: str | None = None
    type: DisasterType
    severity: DisasterSeverity
    source: DisasterSource
    status: DisasterStatus
    radius: float
    external_id: str
    start_time: datetime
    end_time: datetime | None = None
    latitude: float
    longitude: float
    city: str | None = None
    country: str | None = None
