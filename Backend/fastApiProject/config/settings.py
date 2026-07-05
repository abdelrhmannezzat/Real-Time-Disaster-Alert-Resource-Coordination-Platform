from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CRON_JOBS_INTERVAL_USGS: int
    CRON_JOBS_INTERVAL_GDACS: int
    RABBITMQ_URL: str

    class Config:
        env_file = ".env"


settings = Settings()
