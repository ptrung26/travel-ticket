using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateBookingThemThanhTien : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhuongThucCod",
                table: "Sys_ChiTietBookingDichVuLe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ThanhTien",
                table: "sys_Booking",
                type: "decimal(65,30)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhuongThucCod",
                table: "Sys_ChiTietBookingDichVuLe");

            migrationBuilder.DropColumn(
                name: "ThanhTien",
                table: "sys_Booking");
        }
    }
}
