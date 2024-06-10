using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateNhaCungCapAddMaSoThue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SoSaoDanhGia",
                table: "DM_NhaCungCapXe",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaSoThue",
                table: "DM_NhaCungCapXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SoSaoDanhGia",
                table: "DM_NhaCungCapVe",
                type: "int",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaSoThue",
                table: "DM_NhaCungCapVe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaSoThue",
                table: "DM_NhaCungCapXe");

            migrationBuilder.DropColumn(
                name: "MaSoThue",
                table: "DM_NhaCungCapVe");

            migrationBuilder.AlterColumn<float>(
                name: "SoSaoDanhGia",
                table: "DM_NhaCungCapXe",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "SoSaoDanhGia",
                table: "DM_NhaCungCapVe",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
