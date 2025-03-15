@app.get("/favicon.ico")
async def favicon():
    """Serve favicon"""
    return FileResponse("app/static/images/favicon.png")
