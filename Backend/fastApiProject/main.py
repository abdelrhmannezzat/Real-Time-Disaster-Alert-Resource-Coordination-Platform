from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi_pagination import add_pagination

from api.routes.auth_route import router as auth_router
from api.routes.user_route import router as user_router
from api.routes.disaster_route import router as disaster_router
from cron_jobs.usgs_job import scheduler
from api.routes.websocket_route import router as websocket_router
import asyncio
from messaging.consumer import consume_disaster_events


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    asyncio.create_task(consume_disaster_events())

    yield

    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

add_pagination(app)


v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(auth_router, prefix='/auth')
v1_router.include_router(user_router, prefix='/users')
v1_router.include_router(disaster_router, prefix='/disasters')
v1_router.include_router(websocket_router, prefix='/ws')

app.include_router(v1_router)



@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
