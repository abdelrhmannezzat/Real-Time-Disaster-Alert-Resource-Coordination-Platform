from fastapi import Depends

from repository.location_repo import LocationRepository
from schema.request.location_create_request import LocationCreateRequest


class LocationService:
    def __init__(self, location_repo: LocationRepository = Depends(LocationRepository)):
        self.location_repo = location_repo

    def create_location(self, location: LocationCreateRequest):
        return self.location_repo.create_location(location)
