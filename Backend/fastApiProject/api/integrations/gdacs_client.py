from datetime import datetime, timedelta

import httpx

from config.settings import settings


class GDACSClient:
    BASE_URL = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist'

    def fetch_disasters(self):
        print("Running GDACS Job....")
        start_time = datetime.now() - timedelta(minutes=settings.CRON_JOBS_INTERVAL_GDACS)
        end_time = datetime.now()
        try:
            response = httpx.get(
                f'{self.BASE_URL}/SEARCH?fromDate={start_time}%2B03:00&toDate={end_time}%2B03:00&eventlist=EQ;FL;VO;WF'
            )
        except Exception as e:
            print("Couldn't Fetch Disasters from GDACS")
            return None

        if response.status_code == 204:
            return None
        return response.json()
