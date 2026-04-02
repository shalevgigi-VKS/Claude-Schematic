$ErrorActionPreference = "Stop"
$ProjectPath = "E:\Claude\Shalev's_Projects\8_EvolutionSchematic"
Set-Location $ProjectPath

Write-Host "--- Schematic Evolution Update ---"
Write-Host "Running Scanner..."
python scanner\scan_system.py

Write-Host "Deploying to Vercel (Production)..."
npx vercel --prod --yes

if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
    Write-Host "Vercel Deploy Success! Sending Notification."
    $now = Get-Date -Format "dd.MM.yyyy HH:mm IL"
    Invoke-RestMethod -Uri "https://ntfy.sh/CloudeCode" -Method Post -Headers @{
        "Title" = "אבולוציה סכמטית — מיפוי ואומת ופרסם ע״ג Vercel ✅";
        "Tags" = "globe_with_meridians";
        "Priority" = "default";
        "Click" = "https://evolution-schematic.vercel.app"
    } -Body "עדכון אוטומטי מקומי הושלם ופורסם בהצלחה מ-Vercel — $now"
} else {
    Write-Host "Deploy failed! Exit Code: $LASTEXITCODE"
    $now = Get-Date -Format "dd.MM.yyyy HH:mm IL"
    Invoke-RestMethod -Uri "https://ntfy.sh/CloudeCode" -Method Post -Headers @{
        "Title" = "אבולוציה סכמטית — עדכון Vercel נכשל ⚠️";
        "Tags" = "x";
        "Priority" = "high";
    } -Body "שגיאה בפריסה המקומית - בדוק לוגים — $now"
}
