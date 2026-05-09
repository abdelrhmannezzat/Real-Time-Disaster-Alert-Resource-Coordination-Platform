from fastapi import Depends

from repository.disaster_repo import DisasterRepository
from schema.request.disaster_create_request import DisasterCreateRequest


class DisasterService:
    def __init__(self, disaster_repo: DisasterRepository = Depends(DisasterRepository)):
        self.disaster_repo = disaster_repo

    def create_disaster_manually(self, disaster: DisasterCreateRequest, user_id: int):
        return self.disaster_repo.create_disaster_manually(disaster, user_id)



