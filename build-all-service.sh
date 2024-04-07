#!/bin/bash

# BUILD NGOAI KIEM
dotnet restore "./src/aspnet-core/modules/newPMS.NgoaiKiem/newPMS.NgoaiKiem.sln"
dotnet publish /nr:false "./src/aspnet-core/modules/newPMS.NgoaiKiem/src/HttpApi.Host/newPMS.NgoaiKiem.HttpApi.Host.csproj" -c Release -o ../publish_ngoaikiem_qcc
rsync -rq ../publish_ngoaikiem_qcc/* /home/deployment/qcc-hcm-microservice/ngoaikiem/publish --exclude 'appsettings.*' --delete

# BUILD DAO TAO
dotnet restore "./src/aspnet-core/modules/newPMS.DaoTao/newPMS.DaoTao.sln"
dotnet publish /nr:false "./src/aspnet-core/modules/newPMS.DaoTao/src/HttpApi.Host/newPMS.DaoTao.HttpApi.Host.csproj" -c Release -o ../publish_qcc_daotao
rsync -rq ../publish_qcc_daotao/* /home/deployment/qcc-hcm-microservice/daotao/publish --exclude 'appsettings.*' --delete

#BUILD TAI KHOAN
dotnet restore "./src/aspnet-core/modules/newPMS.QuanLyTaiKhoan/newPMS.QuanLyTaiKhoan.sln"
dotnet publish /nr:false "./src/aspnet-core/modules/newPMS.QuanLyTaiKhoan/src/HttpApi.Host/newPMS.QuanLyTaiKhoan.HttpApi.Host.csproj" -c Release -o ../publish_qcc_qltk
rsync -rq ../publish_qcc_qltk/* /home/deployment/qcc-hcm-microservice/taikhoan/publish --exclude 'appsettings.*' --delete

# BUILD HO TRO
dotnet restore "./src/aspnet-core/modules/newPMS.HoTro/newPMS.HoTro.sln"
dotnet publish /nr:false "./src/aspnet-core/modules/newPMS.HoTro/src/HttpApi.Host/newPMS.HoTro.HttpApi.Host.csproj" -c Release -o ../publish_qcc_hotro
rsync -rq ../publish_qcc_hotro/* /home/deployment/qcc-hcm-microservice/hotro/publish --exclude 'appsettings.*' --delete

# BUILD KHO
dotnet restore "./src/aspnet-core/modules/newPMS.Kho/newPMS.Kho.sln"
dotnet publish /nr:false "./src/aspnet-core/modules/newPMS.Kho/src/HttpApi.Host/newPMS.Kho.HttpApi.Host.csproj" -c Release -o ../publish_qcc_kho
rsync -rq ../publish_qcc_kho/* /home/deployment/qcc-hcm-microservice/kho/publish --exclude 'appsettings.*' --delete

# BUILD DANH MUC
dotnet restore "./src/aspnet-core/modules/newPMS.DanhMuc/newPMS.DanhMuc.sln"
dotnet publish /nr:false "./src/aspnet-core/modules/newPMS.DanhMuc/src/HttpApi.Host/newPMS.DanhMuc.HttpApi.Host.csproj" -c Release -o ../publish_danh_muc
rsync -rq ../publish_danh_muc/* /home/deployment/qcc-hcm-microservice/danhmuc/publish --exclude 'appsettings.*' --delete

# BUILD IDENTITY
dotnet restore "./src/aspnet-core/Identity/newPMS.sln"
dotnet publish /nr:false "./src/aspnet-core/Identity/src/newPMS.Web/newPMS.Web.csproj" -c Release -o ../publish_identity_qcc
rsync -rq ../publish_identity_qcc/* /home/deployment/qcc-hcm-microservice/idenity/publish --exclude 'appsettings.*' --delete 

#BUILD ANGULAR
cd ./src/angular
yarn
node --max_old_space_size=12000 ./node_modules/@angular/cli/bin/ng build --configuration production
rsync -rq dist/* /home/deployment/qcc-hcm-microservice/angular/publish --exclude 'appconfig.*' --delete 
