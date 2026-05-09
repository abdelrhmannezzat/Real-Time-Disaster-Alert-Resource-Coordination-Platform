from datetime import datetime

from pydantic import BaseModel

from model.enums import DisasterType, DisasterSeverity, DisasterStatus


class DisasterCreateResponse(BaseModel):
    id: int
    title: str
    description: str
    type: DisasterType
    severity: DisasterSeverity
    status: DisasterStatus
    radius: float
    start_time: datetime
    end_time: datetime

    class Config:
        from_attributes = True
