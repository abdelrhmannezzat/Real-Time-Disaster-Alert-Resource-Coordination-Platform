from cron_jobs import scheduler
import cron_jobs.usgs_job
import cron_jobs.gdacs_job

if __name__ == "__main__":
    print("Starting disaster alert publisher service...")
    print("Registered jobs:", scheduler.get_jobs())
    scheduler.start()
