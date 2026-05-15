from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from dependencies.auth import require_roles
from model import User
from model.enums import UserRole
from websocket.websocket_manager import manager

router = APIRouter()


@router.websocket("/{user_id}")
async def websocket_endpoint(
        websocket: WebSocket,
        user_id: int,
        lat: float,
        lng: float,
        _: User = Depends(require_roles(UserRole.VOLUNTEER))
):

    await manager.connect(user_id, websocket, lat, lng)

    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(user_id)


@router.post("/test")
async def test_message():

    await manager.broadcast({
        "title": "Earthquake",
        "severity": "high"
    })

    return {"message": "sent"}
