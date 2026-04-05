# Schematic Evolution — Daily Runner
# Runs every night at 03:00 (Windows Task Scheduler: SchematicEvolution_WeeklyScanner)
# Pipeline: scan → gen → build → deploy → alias → git push → iPhone notify

$ProjectDir = "e:\Claude\Shalev's_Projects\8_EvolutionSchematic"
$ReactDir   = "$ProjectDir\react-app"
$LogFile    = "$ProjectDir\scanner\scan.log"
$Date       = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$DateStr    = Get-Date -Format "yyyy-MM-dd"

Add-Content $LogFile "[$Date] === Daily scan started ==="

# Step 1: Scan system → data/snapshot.json
python "$ProjectDir\scanner\scan_system.py"
if ($LASTEXITCODE -ne 0) {
    $Msg = "[$Date] ERROR: scan_system.py failed"
    Add-Content $LogFile $Msg
    Invoke-RestMethod -Uri "https://ntfy.sh" -Method Post -ContentType "application/json" -Body '{"topic":"CloudeCode","title":"אבולוציה סכמטית — שגיאה ❌","message":"scan_system.py failed","priority":4,"tags":["x"]}'
    exit 1
}

# Step 2: Gen React data
python "$ProjectDir\scanner\gen_react_data.py"
if ($LASTEXITCODE -ne 0) {
    Add-Content $LogFile "[$Date] WARNING: gen_react_data.py failed"
}

# Step 3: Build
Set-Location $ReactDir
npx vite build 2>&1 | Add-Content $LogFile
if ($LASTEXITCODE -ne 0) {
    $Msg = "[$Date] ERROR: vite build failed"
    Add-Content $LogFile $Msg
    Invoke-RestMethod -Uri "https://ntfy.sh" -Method Post -ContentType "application/json" -Body '{"topic":"CloudeCode","title":"אבולוציה סכמטית — שגיאה ❌","message":"vite build failed","priority":4,"tags":["x"]}'
    exit 1
}

# Step 4: Deploy + alias
Set-Location $ProjectDir
$DeployOut = vercel deploy --prod --yes 2>&1
$DeployOut | Add-Content $LogFile
$DeployUrl = ($DeployOut | Select-String -Pattern "https://claude-brain-\S+-shalevgigi-vks-projects\.vercel\.app").Matches.Value
if ($LASTEXITCODE -eq 0 -and $DeployUrl) {
    vercel alias set $DeployUrl claude-brain-sg.vercel.app 2>&1 | Add-Content $LogFile
    Add-Content $LogFile "[$Date] Deploy OK"
} else {
    Add-Content $LogFile "[$Date] WARNING: deploy failed"
}

# Step 5: Git push data changes
git add "data/" "react-app/src/data/"
git diff --staged --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "auto: daily schematic update $DateStr"
    git push origin master
    Add-Content $LogFile "[$Date] Git push OK"
}

# Step 6: iPhone notification
Invoke-RestMethod -Uri "https://ntfy.sh" -Method Post -ContentType "application/json" -Body "{`"topic`":`"CloudeCode`",`"title`":`"אבולוציה סכמטית — עודכן ✅`",`"message`":`"$DateStr`",`"priority`":3,`"tags`":[`"brain`"],`"click`":`"https://claude-brain-sg.vercel.app`"}"

Add-Content $LogFile "[$Date] === Done ==="
