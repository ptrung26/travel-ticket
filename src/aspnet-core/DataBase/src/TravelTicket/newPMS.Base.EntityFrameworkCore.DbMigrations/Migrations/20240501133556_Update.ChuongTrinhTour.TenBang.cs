using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateChuongTrinhTourTenBang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TourSanPhamEntity",
                table: "TourSanPhamEntity");

            migrationBuilder.RenameTable(
                name: "TourSanPhamEntity",
                newName: "SP_TourSanPham");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SP_TourSanPham",
                table: "SP_TourSanPham",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SP_ChuongTrinhTour",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TourSanPhamId = table.Column<long>(type: "bigint", nullable: false),
                    NgayThu = table.Column<int>(type: "int", nullable: false),
                    TenHanhTrinh = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TepDinhKemJson = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NoiDung = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    DiemDen = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ListDichVuJson = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<Guid>(type: "char(36)", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "char(36)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SP_ChuongTrinhTour", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SP_ChuongTrinhTour");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SP_TourSanPham",
                table: "SP_TourSanPham");

            migrationBuilder.RenameTable(
                name: "SP_TourSanPham",
                newName: "TourSanPhamEntity");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TourSanPhamEntity",
                table: "TourSanPhamEntity",
                column: "Id");
        }
    }
}
