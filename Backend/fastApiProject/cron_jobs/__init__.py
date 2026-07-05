from apscheduler.schedulers.blocking import BlockingScheduler
from cron_jobs.job_service import JobService

scheduler = BlockingScheduler()
job_service = JobService()
