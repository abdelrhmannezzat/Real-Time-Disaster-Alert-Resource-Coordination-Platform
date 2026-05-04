from fastapi import FastAPI
from api.routes.disaster_route import router as disaster_router
app = FastAPI()

app.include_router(disaster_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
