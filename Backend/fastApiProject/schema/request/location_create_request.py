from pydantic import BaseModel


class LocationCreateRequest(BaseModel):
    latitude: float
    longitude: float
    city: str | None = None
    country: str | None = None

    class Config:
        from_attributes = True
