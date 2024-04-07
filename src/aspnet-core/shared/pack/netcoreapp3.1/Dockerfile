#FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim-amd64
FROM harbor.orenda.vn/netcore/netcore:5.0
WORKDIR /app
COPY . .

ENTRYPOINT ["dotnet", "Niis.DanhMuc.HttpApi.Host.dll"]
