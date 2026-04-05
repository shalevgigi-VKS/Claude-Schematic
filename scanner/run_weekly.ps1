# Schematic Evolution — Weekly Scanner Runner v2
# Runs every Sunday at 11:00 IL time (set via Windows Task Scheduler)
# After scan: regenerates React data file + builds + deploys to Vercel

$ProjectDir = "e:\Claude\Shalev's_Projects\8_EvolutionSchematic"
$ReactDir   = "$ProjectDir\react-app"
$LogFile    = "$ProjectDir\scanner\scan.log"
$Date       = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "[$Date] Starting weekly scan..."
Add-Content $LogFile "[$Date] Starting weekly scan..."

# Step 1: Run scanner → updates data/snapshot.json
python "$ProjectDir\scanner\scan_system.py"
if ($LASTEXITCODE -ne 0) {
    $Err = "[$Date] ERROR: scan_system.py failed ($LASTEXITCODE)"
    Write-Host $Err; Add-Content $LogFile $Err; exit 1
}

# Step 2: Regenerate React data file from snapshot.json
python "$ProjectDir\scanner\gen_react_data.py"
if ($LASTEXITCODE -ne 0) {
    $Warn = "[$Date] WARNING: gen_react_data.py failed ($LASTEXITCODE)"
    Write-Host $Warn; Add-Content $LogFile $Warn
}

# Step 3: Build React app
Set-Location $ReactDir
npx vite build 2>&1 | Add-Content $LogFile
if ($LASTEXITCODE -ne 0) {
    $Err = "[$Date] ERROR: vite build failed ($LASTEXITCODE)"
    Write-Host $Err; Add-Content $LogFile $Err; exit 1
}

# Step 4: Deploy to Vercel + alias canonical domain
Set-Location $ProjectDir
$DeployOut = vercel deploy --prod --yes 2>&1
$DeployOut | Add-Content $LogFile
$DeployUrl = ($DeployOut | Select-String -Pattern "https://claude-brain-\w+-shalevgigi").Matches.Value
if ($LASTEXITCODE -eq 0 -and $DeployUrl) {
    vercel alias set $DeployUrl claude-brain-sg.vercel.app 2>&1 | Add-Content $LogFile
    $OK = "[$Date] Deploy OK — https://claude-brain-sg.vercel.app"
    Write-Host $OK; Add-Content $LogFile $OK
} else {
    $Warn = "[$Date] WARNING: vercel deploy failed ($LASTEXITCODE)"
    Write-Host $Warn; Add-Content $LogFile $Warn
}

# Step 5: Git push snapshot + data changes
$DateStr = Get-Date -Format "yyyy-MM-dd"
Set-Location $ProjectDir
git add "data/"
git diff --staged --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "feat: weekly schematic snapshot $DateStr [auto]"
    git push origin master
    if ($LASTEXITCODE -eq 0) {
        $OK = "[$Date] Git push OK"
        Write-Host $OK; Add-Content $LogFile $OK
    } else {
        $Warn = "[$Date] WARNING: git push failed ($LASTEXITCODE)"
        Write-Host $Warn; Add-Content $LogFile $Warn
    }
} else {
    $Info = "[$Date] No data changes — skipping commit"
    Write-Host $Info; Add-Content $LogFile $Info
}
