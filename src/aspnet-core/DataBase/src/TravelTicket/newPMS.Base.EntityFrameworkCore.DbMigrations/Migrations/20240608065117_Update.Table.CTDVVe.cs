using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateTableCTDVVe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ChietTinhDichVuVeEntity",
                table: "ChietTinhDichVuVeEntity");

            migrationBuilder.RenameTable(
                name: "ChietTinhDichVuVeEntity",
                newName: "ct_DichVuVe");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ct_DichVuVe",
                table: "ct_DichVuVe",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ct_DichVuVe",
                table: "ct_DichVuVe");

            migrationBuilder.RenameTable(
                name: "ct_DichVuVe",
                newName: "ChietTinhDichVuVeEntity");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChietTinhDichVuVeEntity",
                table: "ChietTinhDichVuVeEntity",
                column: "Id");
        }
    }
}
