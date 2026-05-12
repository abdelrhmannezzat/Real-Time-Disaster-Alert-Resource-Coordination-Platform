from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # maps user id to the websocket connection
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        # Accept websocket connection
        await websocket.accept()

        # Store connection
        self.active_connections[user_id] = websocket

        print(f"User {user_id} connected")

    def disconnect(self, user_id: int):
        # Remove disconnected user
        self.active_connections.pop(user_id, None)

        print(f"User {user_id} disconnected")

    async def send_personal_message(self, user_id: int, message: dict):
        websocket = self.active_connections.get(user_id)

        if websocket:
            await websocket.send_json(message)

    async def broadcast(self, message: dict):
        # Send message to all connected users
        for websocket in self.active_connections.values():
            await websocket.send_json(message)
