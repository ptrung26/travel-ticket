using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateBookingAddThongTinChuyenKhoan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SoTaiKhoan",
                table: "sys_Booking",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienHoan",
                table: "sys_Booking",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ThoiGianHoanTien",
                table: "sys_Booking",
                type: "datetime(6)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoTaiKhoan",
                table: "sys_Booking");

            migrationBuilder.DropColumn(
                name: "SoTienHoan",
                table: "sys_Booking");

            migrationBuilder.DropColumn(
                name: "ThoiGianHoanTien",
                table: "sys_Booking");
        }
    }
}
