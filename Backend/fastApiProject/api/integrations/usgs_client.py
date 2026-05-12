from datetime import datetime, timedelta

import httpx

from config.settings import settings


class USGSClient:
    BASE_URL = 'https://earthquake.usgs.gov'

    def fetch_earthquakes(self):
        format = 'geojson'
        start_time = datetime.now() - timedelta(minutes=settings.CRON_JOBS_INTERVAL_USGS + 300)
        end_time = datetime.now()
        response = httpx.get(
            f'{self.BASE_URL}/fdsnws/event/1/query?format={format}&starttime={start_time}%2B03:00&endtime={end_time}%2B03:00'
        )

        return response.json()
