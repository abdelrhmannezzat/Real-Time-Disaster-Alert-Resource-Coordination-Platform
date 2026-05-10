from fastapi import Depends

from repository.disaster_repo import DisasterRepository
from schema.request.disaster_create_request import DisasterCreateRequest
from schema.request.location_create_request import LocationCreateRequest
from service.location_service import LocationService


class DisasterService:
    def __init__(self,
                 disaster_repo: DisasterRepository = Depends(DisasterRepository),
                 location_service: LocationService = Depends(LocationService)):
        self.disaster_repo = disaster_repo
        self.location_service = location_service

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int):
        location_dto = LocationCreateRequest(
            latitude=disaster.latitude,
            longitude=disaster.longitude,
            city=disaster.city,
            country=disaster.country
        )
        loc = self.location_service.create_location(location_dto)
        return self.disaster_repo.create_disaster_manually(disaster, user_id, loc.id)



