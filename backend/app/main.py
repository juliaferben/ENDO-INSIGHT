from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apis.api import router as predict_router

app = FastAPI(title="NSMP Recurrence Risk Model")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)