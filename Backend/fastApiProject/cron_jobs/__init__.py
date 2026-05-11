from apscheduler.schedulers.background import BackgroundScheduler

from dependencies.job_dep import build_job_service

scheduler = BackgroundScheduler()
job_service = build_job_service()
