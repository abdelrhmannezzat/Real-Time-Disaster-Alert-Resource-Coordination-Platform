from geoalchemy2 import Geography
from pydantic import BaseModel

from model.enums import DisasterSeverity


class DisasterNearbyResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    severity: DisasterSeverity
    radius: float
    latitude: float
    longitude: float
    city: str | None = None
    country: str | None = None
