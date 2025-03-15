import os
import sys
import pathlib

# Add the project root to the Python path
project_root = pathlib.Path(__file__).parent.resolve()
sys.path.insert(0, str(project_root))

try:
    from app.main import app
    import uvicorn
    from app.core.config import APP_HOST, APP_PORT, DEBUG
    
    if __name__ == "__main__":
        print(f"Starting server on {APP_HOST}:{APP_PORT}")
        uvicorn.run("app.main:app", host=APP_HOST, port=APP_PORT, reload=DEBUG)
except ImportError as e:
    print(f"Error importing app: {str(e)}")
    print("Make sure all required files exist and dependencies are installed.")
    sys.exit(1)
