from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXPIRATION_MINUTES: int
    CRON_JOBS_INTERVAL_USGS: int
    CRON_JOBS_INTERVAL_GDACS: int
    RABBITMQ_URL: str

    class Config:
        env_file = ".env"


settings = Settings()
