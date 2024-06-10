using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateHopDongXeUpdateChiTiet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BienSoXe",
                table: "HD_ChiTietHDXe");

            migrationBuilder.DropColumn(
                name: "CMND",
                table: "HD_ChiTietHDXe");

            migrationBuilder.DropColumn(
                name: "NguoiLaiXe",
                table: "HD_ChiTietHDXe");

            migrationBuilder.DropColumn(
                name: "TenDichVu",
                table: "HD_ChiTietHDXe");

            migrationBuilder.DropColumn(
                name: "TenXe",
                table: "HD_ChiTietHDXe");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BienSoXe",
                table: "HD_ChiTietHDXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CMND",
                table: "HD_ChiTietHDXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NguoiLaiXe",
                table: "HD_ChiTietHDXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenDichVu",
                table: "HD_ChiTietHDXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenXe",
                table: "HD_ChiTietHDXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }
    }
}
