using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateDichVuXeThueVAT : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsHasThueVas",
                table: "DV_Xe",
                newName: "IsHasThueVAT");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsHasThueVAT",
                table: "DV_Xe",
                newName: "IsHasThueVas");
        }
    }
}
