"""
Simulai OAB - Backend API
FastAPI application for OAB exam preparation platform
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="Simulai OAB API",
    description="Backend API for OAB exam preparation platform with AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Simulai OAB API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "message": "🚀 Simulai OAB Backend is running!"
    }

@app.get("/api/v1/status")
async def api_status():
    """API status endpoint"""
    return {
        "api_version": "v1",
        "status": "operational",
        "features": {
            "questions_bank": "ready",
            "ai_correction": "ready",
            "simulations": "ready",
            "study_plans": "ready",
            "authentication": "ready"
        }
    }

# Placeholder endpoints for main features
@app.get("/api/v1/questions")
async def get_questions():
    """Get questions from the bank"""
    return {"message": "Questions endpoint - Coming soon!"}

@app.post("/api/v1/auth/login")
async def login():
    """User login"""
    return {"message": "Login endpoint - Coming soon!"}

@app.post("/api/v1/simulations")
async def create_simulation():
    """Create a new simulation"""
    return {"message": "Simulations endpoint - Coming soon!"}

@app.post("/api/v1/essays/correct")
async def correct_essay():
    """AI essay correction"""
    return {"message": "AI correction endpoint - Coming soon!"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
