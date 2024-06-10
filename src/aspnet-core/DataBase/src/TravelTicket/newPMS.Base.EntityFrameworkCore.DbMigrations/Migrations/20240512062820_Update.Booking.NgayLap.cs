using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateBookingNgayLap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "BookingId",
                table: "Sys_ChiTietBookingDichVuTour",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "BookingTourId",
                table: "Sys_ChiTietBookingDichVuTour",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayLap",
                table: "sys_Booking",
                type: "datetime(6)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookingId",
                table: "Sys_ChiTietBookingDichVuTour");

            migrationBuilder.DropColumn(
                name: "BookingTourId",
                table: "Sys_ChiTietBookingDichVuTour");

            migrationBuilder.DropColumn(
                name: "NgayLap",
                table: "sys_Booking");
        }
    }
}
