from datetime import datetime

from pydantic import BaseModel

from model.enums import DisasterSeverity, DisasterSource, DisasterStatus


class DisasterFetchResponse(BaseModel):
    id: int
    created_by: int
    title: str
    description: str
    severity: DisasterSeverity
    source: DisasterSource
    status: DisasterStatus
    radius: float
    start_time: datetime
    end_time: datetime
    city: str | None = None
    country: str | None = None

    class Config:
        from_attributes = True
