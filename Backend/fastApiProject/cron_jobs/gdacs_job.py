from config.settings import settings
from cron_jobs import scheduler, job_service

scheduler.add_job(
    job_service.run_gdacs,
    "interval",
    minutes=settings.CRON_JOBS_INTERVAL_GDACS
)
