from api.integrations.gdacs_client import GDACSClient
from api.integrations.usgs_client import USGSClient
from normalizers.normalize_gdacs_response import normalize_gdacs_response
from normalizers.normalize_usgs_response import normalize_usgs_response
from messaging.publisher import publish_message


class JobService:
    def __init__(self):
        self.gdacs_client = GDACSClient()
        self.usgs_client = USGSClient()

    def run_usgs(self):
        raw = self.usgs_client.fetch_earthquakes()
        normalized = normalize_usgs_response(raw)

        for alert in normalized:
            publish_message(alert.model_dump(mode="json"))

    def run_gdacs(self):
        raw = self.gdacs_client.fetch_disasters()
        if raw is None:
            return
        normalized = normalize_gdacs_response(raw)

        for alert in normalized:
            publish_message(alert.model_dump(mode="json"))
