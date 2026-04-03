$ErrorActionPreference = "Stop"
$ProjectPath = "E:\Claude\Shalev's_Projects\8_EvolutionSchematic"
$ReactDir    = "$ProjectPath\react-app"

Write-Host "--- Schematic Evolution Update ---"
Write-Host "Running Scanner..."
Set-Location $ProjectPath
python scanner\scan_system.py

Write-Host "Regenerating React data..."
python scanner\gen_react_data.py

Write-Host "Building React app..."
Set-Location $ReactDir
pnpm build

Write-Host "Deploying to Vercel (Production)..."
Set-Location $ProjectPath
vercel deploy --prod --yes

if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
    Write-Host "Vercel Deploy Success! Sending Notification."
    $now = Get-Date -Format "dd.MM.yyyy HH:mm IL"
    Invoke-RestMethod -Uri "https://ntfy.sh/CloudeCode" -Method Post -Headers @{
        "Title" = "אבולוציה סכמטית — עודכן ✅";
        "Tags" = "white_check_mark";
        "Priority" = "default";
        "Click" = "https://evolution-schematic.vercel.app"
    }
} else {
    Write-Host "Deploy failed! Exit Code: $LASTEXITCODE"
    Invoke-RestMethod -Uri "https://ntfy.sh/CloudeCode" -Method Post -Headers @{
        "Title" = "אבולוציה סכמטית — שגיאה בפריסה ⚠️";
        "Tags" = "x";
        "Priority" = "high"
    }
}
