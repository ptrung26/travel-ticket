dotnet nuget add source http://nuget.orenda.vn/v3/index.json -n OrendaCo
dotnet tool install -g Volo.Abp.Cli
dotnet tool update -g Volo.Abp.Cli
abp login hungvt -p 123456a@
dotnet restore QCC.sln

echo "DONE!!!"
Start-Sleep -Seconds 30
