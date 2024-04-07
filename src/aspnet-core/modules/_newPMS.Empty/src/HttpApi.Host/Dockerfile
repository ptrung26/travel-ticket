#FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim-amd64
FROM harbor.orenda.vn/netcore/netcore:5.0
# RUN apt-get update && apt-get install -y libfontconfig1 
# RUN apt-get update && apt-get install -y libgdiplus

# # adding debian contrib package sources (https://www.debian.org/doc/debian-policy/ch-archive.html)
# RUN apt-get update
# RUN apt-get install -y --no-install-recommends software-properties-common
# RUN apt-add-repository contrib
# RUN apt-get update

# # installing mscorefonts
# RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections
# RUN apt-get install -y --no-install-recommends fontconfig ttf-mscorefonts-installer
# RUN fc-cache -f -v

WORKDIR /app
COPY . .

ENV TZ=Asia/Ho_Chi_Minh
ENTRYPOINT ["dotnet", ".HttpApi.Host.dll"]
