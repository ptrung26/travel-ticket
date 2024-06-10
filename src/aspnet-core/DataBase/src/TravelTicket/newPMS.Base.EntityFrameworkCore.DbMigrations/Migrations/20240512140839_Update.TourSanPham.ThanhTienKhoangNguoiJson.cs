using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateTourSanPhamThanhTienKhoangNguoiJson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThanhTienKhoangNguoiJson",
                table: "SP_TourSanPham",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThanhTienKhoangNguoiJson",
                table: "SP_TourSanPham");
        }
    }
}
