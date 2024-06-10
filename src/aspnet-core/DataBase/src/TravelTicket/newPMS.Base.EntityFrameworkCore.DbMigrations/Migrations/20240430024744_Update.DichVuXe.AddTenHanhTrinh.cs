using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateDichVuXeAddTenHanhTrinh : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ten",
                table: "DV_Xe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ten",
                table: "DV_Xe");
        }
    }
}
