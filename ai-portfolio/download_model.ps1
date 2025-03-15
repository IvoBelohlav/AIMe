# Ensure directory exists
if (-not (Test-Path "app/static/models")) {
    New-Item -ItemType Directory -Path "app/static/models" -Force
}

# Download a reliable sample 3D model from Three.js examples
$modelUrl = "https://threejs.org/examples/models/gltf/Soldier.glb"
$outputPath = "app/static/models/avatar.glb"

# Download the model
Write-Host "Downloading sample 3D model..."
try {
    Invoke-WebRequest -Uri $modelUrl -OutFile $outputPath
    Write-Host "Downloaded sample model to $outputPath"
} catch {
    Write-Host "Error downloading model: $($_.Exception.Message)"
    Write-Host "Please download a model manually from https://readyplayer.me/ and save it to app/static/models/avatar.glb"
}
