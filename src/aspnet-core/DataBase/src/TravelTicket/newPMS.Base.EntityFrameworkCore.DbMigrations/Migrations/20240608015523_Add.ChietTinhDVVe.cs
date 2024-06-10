using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddChietTinhDVVe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ct_DichVuPhong");

            migrationBuilder.DropColumn(
                name: "SoLuongChoNgoi",
                table: "ct_DichVuXe");

            migrationBuilder.CreateTable(
                name: "ChietTinhDichVuVeEntity",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KhoangKhachCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    DichVuVeId = table.Column<long>(type: "bigint", nullable: true),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: true),
                    TourSanPhamId = table.Column<long>(type: "bigint", nullable: false),
                    NgayThu = table.Column<int>(type: "int", nullable: false),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
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
                    table.PrimaryKey("PK_ChietTinhDichVuVeEntity", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChietTinhDichVuVeEntity");

            migrationBuilder.AddColumn<int>(
                name: "SoLuongChoNgoi",
                table: "ct_DichVuXe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Ct_DichVuPhong",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreationTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatorId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeleterId = table.Column<Guid>(type: "char(36)", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DichVuPhongId = table.Column<long>(type: "bigint", nullable: true),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    KhoangKhachCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "char(36)", nullable: true),
                    NgayThu = table.Column<int>(type: "int", nullable: false),
                    NhaCungCapKhachSanId = table.Column<long>(type: "bigint", nullable: true),
                    SoLuongChoNgoi = table.Column<int>(type: "int", nullable: true),
                    TourSanPhamId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ct_DichVuPhong", x => x.Id);
                });
        }
    }
}
