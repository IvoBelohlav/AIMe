# Stop any running processes
$processes = Get-Process -Name python -ErrorAction SilentlyContinue
if ($processes) {
    $processes | Where-Object {$_.CommandLine -like '*run.py*'} | Stop-Process -Force
}

# Load .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "Set environment variable: $key"
        }
    }
}

# Start the application
python run.py
