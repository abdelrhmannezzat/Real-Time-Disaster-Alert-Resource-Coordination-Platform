from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, WebSocketException
from starlette import status

from model.enums import UserRole
from utils.jwt import decode_access_token
from websocket.websocket_manager import manager

router = APIRouter()


# Websocket endpoint, only volunteer can access
@router.websocket("")
async def websocket_endpoint(
    websocket: WebSocket,
    lat: float,
    lng: float
):
    token = websocket.query_params.get("token")

    if not token:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

    payload = decode_access_token(token)
    role = payload['role']
    user_id = payload['user_id']

    if role != UserRole.VOLUNTEER:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

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
