from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

app = FastAPI(
    title="Simple API Server",
    description="API Server พื้นฐานสำหรับการใช้งานทั่วไป",
    version="1.0.0"
)

# CORS middleware เพื่อให้ Next.js สามารถเรียก API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class MessageRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    message: str
    timestamp: str
    status: str = "success"

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str

@app.get("/")
async def root():
    return {
        "message": "Simple API Server",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """ตรวจสอบสถานะของ API"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0"
    )

# Storage สำหรับข้อมูลง่ายๆ (ในที่นี้ใช้ memory, ในการใช้งานจริงอาจใช้ database)
messages_store = []

def generate_id() -> str:
    """สร้าง ID ง่ายๆ"""
    import uuid
    return str(uuid.uuid4())[:8]

@app.post("/messages", response_model=MessageResponse)
async def create_message(request: MessageRequest):
    """สร้างข้อความใหม่"""
    message_id = generate_id()
    timestamp = datetime.now().isoformat()
    
    message_data = {
        "id": message_id,
        "message": request.message,
        "user_id": request.user_id,
        "timestamp": timestamp
    }
    
    messages_store.append(message_data)
    
    return MessageResponse(
        id=message_id,
        message=request.message,
        timestamp=timestamp,
        status="success"
    )

@app.get("/messages")
async def get_messages():
    """ดึงข้อความทั้งหมด"""
    return {
        "messages": messages_store,
        "total": len(messages_store),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/messages/{message_id}")
async def get_message(message_id: str):
    """ดึงข้อความตาม ID"""
    for message in messages_store:
        if message["id"] == message_id:
            return message
    
    raise HTTPException(status_code=404, detail="Message not found")

@app.delete("/messages/{message_id}")
async def delete_message(message_id: str):
    """ลบข้อความตาม ID"""
    for i, message in enumerate(messages_store):
        if message["id"] == message_id:
            deleted_message = messages_store.pop(i)
            return {
                "message": "Message deleted successfully",
                "deleted_message": deleted_message,
                "timestamp": datetime.now().isoformat()
            }
    
    raise HTTPException(status_code=404, detail="Message not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

