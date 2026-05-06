from fastapi import FastAPI, APIRouter
from api.routes.auth_route import router as auth_router
app = FastAPI()


v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(auth_router, prefix='/auth')


app.include_router(v1_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
