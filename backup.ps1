$targetDir = "legacy_laravel"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

$excludeList = @("legacy_laravel", ".git", ".trae", "backup.ps1")
Get-ChildItem -Path . -Force | Where-Object { $excludeList -notcontains $_.Name } | Move-Item -Destination $targetDir -Force
