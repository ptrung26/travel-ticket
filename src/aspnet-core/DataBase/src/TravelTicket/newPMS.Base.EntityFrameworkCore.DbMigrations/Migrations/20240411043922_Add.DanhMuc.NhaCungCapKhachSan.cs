using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddDanhMucNhaCungCapKhachSan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "NhaCungCapKhachSanId",
                table: "DV_GiaPhong",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "NhaCungCapKhachSanEntity",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Ma = table.Column<string>(type: "varchar(50) CHARACTER SET utf8mb4", maxLength: 50, nullable: false),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    LoaiKhachSanCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TinhTrang = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    QuocGiaId = table.Column<int>(type: "int", nullable: true),
                    TinhId = table.Column<int>(type: "int", nullable: true),
                    DiaChi = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Email = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Fax = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Website = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    MoTa = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    AnhDaiDienUrl = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TaiLieuJson = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    IsHasVAT = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DichVu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NgayHetHanHopDong = table.Column<DateTime>(type: "datetime(6)", nullable: false),
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
                    table.PrimaryKey("PK_NhaCungCapKhachSanEntity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TourSanPhamEntity",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Ma = table.Column<string>(type: "varchar(50) CHARACTER SET utf8mb4", maxLength: 50, nullable: false),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    LoaiHinhDuLichCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoNgay = table.Column<int>(type: "int", nullable: false),
                    SoDem = table.Column<int>(type: "int", nullable: false),
                    MaQuocGiaCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    MaTinhCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    DiemKhoiHanh = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TinhTrang = table.Column<int>(type: "int", nullable: false),
                    LoaiTourCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TepDinhKemJson = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_TourSanPhamEntity", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NhaCungCapKhachSanEntity");

            migrationBuilder.DropTable(
                name: "TourSanPhamEntity");

            migrationBuilder.DropColumn(
                name: "NhaCungCapKhachSanId",
                table: "DV_GiaPhong");
        }
    }
}
