using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateBookingChoPhepNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TourId",
                table: "Sys_ChiTietThanhVienDoanBooking",
                newName: "BookingId");

            migrationBuilder.AlterColumn<long>(
                name: "TinhId",
                table: "sys_Booking",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "NhanVienId",
                table: "sys_Booking",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookingId",
                table: "Sys_ChiTietThanhVienDoanBooking",
                newName: "TourId");

            migrationBuilder.AlterColumn<long>(
                name: "TinhId",
                table: "sys_Booking",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "NhanVienId",
                table: "sys_Booking",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);
        }
    }
}
