from typing import Dict, List, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps doctor_id to a list of connected websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, doctor_id: str):
        await websocket.accept()
        if doctor_id not in self.active_connections:
            self.active_connections[doctor_id] = []
        self.active_connections[doctor_id].append(websocket)

    def disconnect(self, websocket: WebSocket, doctor_id: str):
        if doctor_id in self.active_connections:
            if websocket in self.active_connections[doctor_id]:
                self.active_connections[doctor_id].remove(websocket)
            if not self.active_connections[doctor_id]:
                del self.active_connections[doctor_id]

    async def broadcast(self, message: dict, doctor_id: str):
        if doctor_id in self.active_connections:
            for connection in self.active_connections[doctor_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Failed to send message over websocket: {e}")

manager = ConnectionManager()
