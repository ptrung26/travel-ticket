using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateChietTinhXeChoPhepGiaNul : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "GiaNett",
                table: "ChietTinh_DichVuXe",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "GiaNett",
                table: "ChietTinh_DichVuXe",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);
        }
    }
}
