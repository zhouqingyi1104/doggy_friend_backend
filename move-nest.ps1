Get-ChildItem -Path .\nest-temp -Force | Move-Item -Destination . -Force
Remove-Item -Path .\nest-temp -Recurse -Force
