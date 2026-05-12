from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from websocket.websocket_manager import manager

router = APIRouter()


@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):

    await manager.connect(user_id, websocket)

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
