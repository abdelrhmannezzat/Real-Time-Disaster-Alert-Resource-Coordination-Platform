from datetime import datetime, timedelta

import httpx

from config.settings import settings


class GDACSClient:
    BASE_URL = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist'

    def fetch_disasters(self):
        start_time = datetime.now() - timedelta(minutes=settings.CRON_JOBS_INTERVAL_GDACS)
        end_time = datetime.now()

        response = httpx.get(
            f'{self.BASE_URL}/SEARCH?fromDate={start_time}%2B03:00&toDate={end_time}%2B03:00&eventlist=EQ;FL;VO;WF'
        )

        return response.json()
