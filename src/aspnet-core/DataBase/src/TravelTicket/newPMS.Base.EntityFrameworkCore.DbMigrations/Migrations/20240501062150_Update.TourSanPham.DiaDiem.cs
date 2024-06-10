using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateTourSanPhamDiaDiem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaQuocGiaCode",
                table: "TourSanPhamEntity");

            migrationBuilder.RenameColumn(
                name: "MaTinhCode",
                table: "TourSanPhamEntity",
                newName: "DiemDen");

            migrationBuilder.AddColumn<long>(
                name: "QuocGiaId",
                table: "TourSanPhamEntity",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TinhId",
                table: "TourSanPhamEntity",
                type: "bigint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuocGiaId",
                table: "TourSanPhamEntity");

            migrationBuilder.DropColumn(
                name: "TinhId",
                table: "TourSanPhamEntity");

            migrationBuilder.RenameColumn(
                name: "DiemDen",
                table: "TourSanPhamEntity",
                newName: "MaTinhCode");

            migrationBuilder.AddColumn<string>(
                name: "MaQuocGiaCode",
                table: "TourSanPhamEntity",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }
    }
}
