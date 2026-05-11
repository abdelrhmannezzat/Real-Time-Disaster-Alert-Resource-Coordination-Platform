from fastapi import Depends
from sqlalchemy.orm import Session

from api.integrations.gdacs_client import GDACSClient
from api.integrations.usgs_client import USGSClient
from config.database import get_db
from dependencies.disaster_dep import get_disaster_service
from service.disaster_service import DisasterService
from normalizers.normalize_gdacs_response import normalize_gdacs_response
from normalizers.normalize_usgs_response import normalize_usgs_response


class JobService:
    def __init__(self,
                 disaster_service: DisasterService = Depends(get_disaster_service),
                 db: Session = Depends(get_db)
    ):
        self.gdacs_client = GDACSClient()
        self.usgs_client = USGSClient()
        self.disaster_service = disaster_service
        self.db = db

    def run_usgs(self):
        raw = self.usgs_client.fetch_earthquakes()

        normalized = normalize_usgs_response(raw)

        self.disaster_service.persist_disasters_third_party(normalized, self.db)

    def run_gdacs(self):
        raw = self.gdacs_client.fetch_disasters()

        normalized = normalize_gdacs_response(raw)

        self.disaster_service.persist_disasters_third_party(normalized, self.db)
