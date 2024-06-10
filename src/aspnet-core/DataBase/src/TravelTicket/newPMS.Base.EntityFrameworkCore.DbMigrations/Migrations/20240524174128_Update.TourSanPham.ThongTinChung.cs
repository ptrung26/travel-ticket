using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateTourSanPhamThongTinChung : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TinhId",
                table: "SP_TourSanPham",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "QuocGiaId",
                table: "SP_TourSanPham",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThongTinChung",
                table: "SP_TourSanPham",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UrlHinhAnh",
                table: "SP_TourSanPham",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThongTinChung",
                table: "SP_TourSanPham");

            migrationBuilder.DropColumn(
                name: "UrlHinhAnh",
                table: "SP_TourSanPham");

            migrationBuilder.AlterColumn<long>(
                name: "TinhId",
                table: "SP_TourSanPham",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "QuocGiaId",
                table: "SP_TourSanPham",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);
        }
    }
}
