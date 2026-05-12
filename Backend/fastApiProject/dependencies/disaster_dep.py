from messaging.publisher import EventPublisher
from repository.disaster_repo import DisasterRepository
from repository.location_repo import LocationRepository
from service.disaster_service import DisasterService
from service.location_service import LocationService


def get_disaster_service():
    repo = DisasterRepository()
    location_repo = LocationRepository()
    location_service = LocationService(location_repo)
    publisher = EventPublisher()
    return DisasterService(repo, location_service, publisher)
