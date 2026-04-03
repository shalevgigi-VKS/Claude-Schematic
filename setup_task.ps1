# Setup Daily Evolution Deployment
$TaskName = "EvolutionSchematic_VercelUpdate"
$ScriptPath = "E:\Claude\Shalev's_Projects\8_EvolutionSchematic\vercel_deploy.ps1"

Write-Host "Registering Scheduled Task: $TaskName"
$Trigger = New-ScheduledTaskTrigger -Daily -At "15:45"
# Run powershell completely hidden, bypassing execution policy
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$ScriptPath`""

Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $Action -Description "Daily Evolution Schematic Sync and Vercel Deploy" -RunLevel Highest -Force

Write-Host "Success! Task '$TaskName' has been scheduled to run daily at 15:45."
Write-Host "To test it right now, you can run:"
Write-Host "Start-ScheduledTask -TaskName $TaskName"
