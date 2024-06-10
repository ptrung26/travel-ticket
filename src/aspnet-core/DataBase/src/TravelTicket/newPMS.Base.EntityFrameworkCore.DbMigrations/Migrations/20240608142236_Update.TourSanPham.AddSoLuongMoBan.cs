using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateTourSanPhamAddSoLuongMoBan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SoLuongMoBan",
                table: "SP_TourSanPham",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ThoiGianMoBan",
                table: "SP_TourSanPham",
                type: "datetime(6)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoLuongMoBan",
                table: "SP_TourSanPham");

            migrationBuilder.DropColumn(
                name: "ThoiGianMoBan",
                table: "SP_TourSanPham");
        }
    }
}
