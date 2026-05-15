from fastapi import WebSocket
from geopy.distance import geodesic


class ConnectionManager:
    def __init__(self):
        # maps user id to the websocket connection
        self.active_connections: dict[int, WebSocket] = {}
        # maps user id to the latitude and longitude
        self.location: dict[int, (float, float)] = {}

    async def connect(self, user_id: int, websocket: WebSocket, lat: float, lng: float):
        # Accept websocket connection
        await websocket.accept()

        # Store connection
        self.active_connections[user_id] = websocket

        # Store location
        self.location[user_id] = (lat, lng)

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
        for user_id, websocket in self.active_connections.items():
            distance = geodesic(self.location[user_id],
                                (message['latitude'], message['longitude'])).kilometers
            if distance <= 300.0:  # Only send if it is within 300.0 kilometer from this user
                message['distance'] = distance
                await websocket.send_json(message)
