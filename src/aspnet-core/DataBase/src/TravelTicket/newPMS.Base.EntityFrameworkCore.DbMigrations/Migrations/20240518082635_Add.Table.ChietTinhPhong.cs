using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddTableChietTinhPhong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoaiPhong",
                table: "DV_HangPhong");

            migrationBuilder.DropColumn(
                name: "LoaiPhong",
                table: "DV_GiaPhong");

            migrationBuilder.AlterColumn<int>(
                name: "SoLuongPhong",
                table: "DV_HangPhong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "SoKhachToiDa",
                table: "DV_HangPhong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "SlPhongFOC",
                table: "DV_HangPhong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "KichThuocPhong",
                table: "DV_HangPhong",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "LoaiPhongCode",
                table: "DV_HangPhong",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayApDungTu",
                table: "DV_GiaPhong",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayApDungDen",
                table: "DV_GiaPhong",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTNettNgayThuong",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTNettNgayLe",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTBanNgayThuong",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTBanNgayLe",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AddColumn<string>(
                name: "LoaiPhongCode",
                table: "DV_GiaPhong",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Ct_DichVuPhong",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KhoangKhachCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoLuongChoNgoi = table.Column<int>(type: "int", nullable: true),
                    DichVuPhongId = table.Column<long>(type: "bigint", nullable: true),
                    NhaCungCapKhachSanId = table.Column<long>(type: "bigint", nullable: true),
                    TourSanPhamId = table.Column<long>(type: "bigint", nullable: false),
                    NgayThu = table.Column<int>(type: "int", nullable: false),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
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
                    table.PrimaryKey("PK_Ct_DichVuPhong", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_HuongDanVien",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true),
                    SysuserId = table.Column<long>(type: "bigint", nullable: true),
                    Ma = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoDienThoai = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    DiaChi = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Email = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NguoiTaoId = table.Column<long>(type: "bigint", nullable: true),
                    TenNguoiTao = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ThongThaoNgonNguJSON = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NgayLamViec = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    TrangThai = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_Sys_HuongDanVien", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ct_DichVuPhong");

            migrationBuilder.DropTable(
                name: "Sys_HuongDanVien");

            migrationBuilder.DropColumn(
                name: "LoaiPhongCode",
                table: "DV_HangPhong");

            migrationBuilder.DropColumn(
                name: "LoaiPhongCode",
                table: "DV_GiaPhong");

            migrationBuilder.AlterColumn<int>(
                name: "SoLuongPhong",
                table: "DV_HangPhong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SoKhachToiDa",
                table: "DV_HangPhong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SlPhongFOC",
                table: "DV_HangPhong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "KichThuocPhong",
                table: "DV_HangPhong",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoaiPhong",
                table: "DV_HangPhong",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayApDungTu",
                table: "DV_GiaPhong",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayApDungDen",
                table: "DV_GiaPhong",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTNettNgayThuong",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTNettNgayLe",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTBanNgayThuong",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaFOTBanNgayLe",
                table: "DV_GiaPhong",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoaiPhong",
                table: "DV_GiaPhong",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
