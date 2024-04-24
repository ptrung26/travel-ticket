using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateNhaCungCapKhachSanNgayCuoiTuan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NgayCuoiTuan",
                table: "NhaCungCapKhachSanEntity",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NgayCuoiTuan",
                table: "NhaCungCapKhachSanEntity");
        }
    }
}
