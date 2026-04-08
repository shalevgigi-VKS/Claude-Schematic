# Schematic Evolution — Daily Runner
# Runs every night at 03:00 (Windows Task Scheduler: SchematicEvolution_WeeklyScanner)
# Pipeline: scan → gen → build → deploy → alias → git push → iPhone notify

$Python     = "C:\Python314\python.exe"
$Npx        = "C:\Program Files\nodejs\npx.cmd"
$Vercel     = "C:\Users\Shalev\AppData\Roaming\npm\vercel.cmd"
$Git        = "C:\Program Files\Git\bin\git.exe"
$ProjectDir = "e:\Claude\Shalev's_Projects\8_EvolutionSchematic"
$ReactDir   = "$ProjectDir\react-app"
$LogFile    = "$ProjectDir\scanner\scan.log"
$Date       = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$DateStr    = Get-Date -Format "yyyy-MM-dd"

Add-Content $LogFile "[$Date] === Daily scan started ==="

# Step 1: Scan system → data/snapshot.json
& $Python "$ProjectDir\scanner\scan_system.py"
if ($LASTEXITCODE -ne 0) {
    Add-Content $LogFile "[$Date] ERROR: scan_system.py failed (exit $LASTEXITCODE)"
    Invoke-RestMethod -Uri "https://ntfy.sh" -Method Post -ContentType "application/json" -Body '{"topic":"CloudeCode","title":"אבולוציה סכמטית — שגיאה ❌","message":"scan_system.py failed","priority":4,"tags":["x"]}' -ErrorAction SilentlyContinue
    exit 1
}
Add-Content $LogFile "[$Date] scan_system.py OK"

# Step 2: Gen React data
& $Python "$ProjectDir\scanner\gen_react_data.py"
if ($LASTEXITCODE -ne 0) {
    Add-Content $LogFile "[$Date] WARNING: gen_react_data.py failed (non-critical)"
} else {
    Add-Content $LogFile "[$Date] gen_react_data.py OK"
}

# Step 3: Build
Set-Location $ReactDir
& $Npx vite build 2>&1 | Add-Content $LogFile
if ($LASTEXITCODE -ne 0) {
    Add-Content $LogFile "[$Date] ERROR: vite build failed"
    Invoke-RestMethod -Uri "https://ntfy.sh" -Method Post -ContentType "application/json" -Body '{"topic":"CloudeCode","title":"אבולוציה סכמטית — שגיאה ❌","message":"vite build failed","priority":4,"tags":["x"]}' -ErrorAction SilentlyContinue
    exit 1
}
Add-Content $LogFile "[$Date] vite build OK"

# Step 4: Deploy + alias
Set-Location $ProjectDir
$DeployOut = & $Vercel deploy --prod --yes 2>&1
$DeployOut | Add-Content $LogFile
$DeployUrl = ($DeployOut | Select-String -Pattern "https://claude-brain-\S+-shalevgigi-vks-projects\.vercel\.app").Matches.Value
if ($LASTEXITCODE -eq 0 -and $DeployUrl) {
    & $Vercel alias set $DeployUrl claude-brain-sg.vercel.app 2>&1 | Add-Content $LogFile
    Add-Content $LogFile "[$Date] Deploy + alias OK: $DeployUrl"
} else {
    Add-Content $LogFile "[$Date] WARNING: deploy/alias step failed (non-critical)"
}

# Step 5: Git push data changes
Set-Location "e:\Claude"
& $Git add "$ProjectDir\data\" "$ProjectDir\react-app\src\data\" 2>&1 | Out-Null
& $Git diff --staged --quiet
if ($LASTEXITCODE -ne 0) {
    & $Git commit -m "auto: daily schematic update $DateStr" 2>&1 | Add-Content $LogFile
    & $Git push origin master 2>&1 | Add-Content $LogFile
    Add-Content $LogFile "[$Date] Git push OK"
} else {
    Add-Content $LogFile "[$Date] No data changes to commit"
}

# Step 6: iPhone notification
Invoke-RestMethod -Uri "https://ntfy.sh" -Method Post -ContentType "application/json" -Body "{`"topic`":`"CloudeCode`",`"title`":`"אבולוציה סכמטית — עודכן ✅`",`"message`":`"$DateStr`",`"priority`":3,`"tags`":[`"brain`"],`"click`":`"https://claude-brain-sg.vercel.app`"}" -ErrorAction SilentlyContinue

Add-Content $LogFile "[$Date] === Done ==="
exit 0
