using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateGiaPhongThemTenPhong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HD_ChiTietHDXe");

            migrationBuilder.DropTable(
                name: "HD_NhaCungCapXe");

            migrationBuilder.RenameColumn(
                name: "TenPhong",
                table: "DV_HangPhong",
                newName: "TenHangPhong");

            migrationBuilder.AddColumn<long>(
                name: "SysUserId",
                table: "Sys_KhachHang",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DonGia",
                table: "Sys_ChiTietBookingDichVuLe",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NhaCungCapCode",
                table: "Sys_ChiTietBookingDichVuLe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "NhaCungCapId",
                table: "Sys_ChiTietBookingDichVuLe",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TrangThai",
                table: "Sys_ChiTietBookingDichVuLe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TenPhong",
                table: "DV_GiaPhong",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DM_HopDongNCC",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false),
                    Ma = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    LoaiHopDongCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NgayHieuLuc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayHetHan = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayKy = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NguoiLapHopDong = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TinhTrang = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<Guid>(type: "char(36)", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "char(36)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DM_HopDongNCC", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DM_HopDongNCC");

            migrationBuilder.DropColumn(
                name: "SysUserId",
                table: "Sys_KhachHang");

            migrationBuilder.DropColumn(
                name: "DonGia",
                table: "Sys_ChiTietBookingDichVuLe");

            migrationBuilder.DropColumn(
                name: "NhaCungCapCode",
                table: "Sys_ChiTietBookingDichVuLe");

            migrationBuilder.DropColumn(
                name: "NhaCungCapId",
                table: "Sys_ChiTietBookingDichVuLe");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "Sys_ChiTietBookingDichVuLe");

            migrationBuilder.DropColumn(
                name: "TenPhong",
                table: "DV_GiaPhong");

            migrationBuilder.RenameColumn(
                name: "TenHangPhong",
                table: "DV_HangPhong",
                newName: "TenPhong");

            migrationBuilder.CreateTable(
                name: "HD_ChiTietHDXe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeleterId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    HopDongId = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "char(36)", nullable: true),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HD_ChiTietHDXe", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HD_NhaCungCapXe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeleterId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "char(36)", nullable: true),
                    LoaiHopDongCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Ma = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    MoTa = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NgayHetHan = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayHieuLuc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayKy = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NguoiLapHopDong = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false),
                    TinhTrang = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HD_NhaCungCapXe", x => x.Id);
                });
        }
    }
}
