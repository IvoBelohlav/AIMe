from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse, Response
import os
import pathlib

# Get base directory
BASE_DIR = pathlib.Path(__file__).parent.parent.resolve()

# Import the chat router
from app.api.chat import router as chat_router

# Initialize FastAPI app
app = FastAPI(
    title="AI Portfolio with Animated Avatar",
    description="A personal portfolio website with an animated AI assistant",
    version="1.0.0"
)

# Mount static files
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "app/static")), name="static")

# Set up templates
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "app/templates"))

# Include API routers
app.include_router(chat_router, prefix="/api")

@app.get("/")
async def home(request: Request):
    """Render home page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/favicon.ico")
async def favicon():
    """Handle favicon requests"""
    # Return 204 No Content to avoid error
    return Response(status_code=204)

@app.get("/avatar-test")
async def avatar_test_page(request: Request):
    """Dedicated avatar animation test page"""
    return templates.TemplateResponse("avatar_test_page.html", {"request": request})

@app.get("/simple-test")
async def simple_test(request: Request):
    """Simple avatar test page"""
    return templates.TemplateResponse("simple_test.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
