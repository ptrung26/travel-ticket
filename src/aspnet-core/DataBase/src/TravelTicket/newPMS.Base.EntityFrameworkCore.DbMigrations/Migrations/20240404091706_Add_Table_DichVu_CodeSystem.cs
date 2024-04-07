using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class Add_Table_DichVu_CodeSystem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DichVuCungCapXeEntity",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CategoryCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Ma = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoKMDuTinh = table.Column<int>(type: "int", nullable: false),
                    LoaiXeCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoCho = table.Column<int>(type: "int", nullable: false),
                    LoaiTienTeCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoChoCode = table.Column<long>(type: "bigint", nullable: true),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GiaBan = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    IsHasThueVas = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    JsonTaiLieu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_DichVuCungCapXeEntity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DichVuNhaHangEntity",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CategoryCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    LoaiTienTeCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    DatBanCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GiaBan = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    IsHasThueVas = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    JsonTaiLieu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_DichVuNhaHangEntity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DM_CodeSystem",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(100) CHARACTER SET utf8mb4", maxLength: 100, nullable: true),
                    Display = table.Column<string>(type: "varchar(1000) CHARACTER SET utf8mb4", maxLength: 1000, nullable: true),
                    ParentId = table.Column<long>(type: "bigint", nullable: true),
                    ParentCode = table.Column<string>(type: "varchar(100) CHARACTER SET utf8mb4", maxLength: 100, nullable: true),
                    Path = table.Column<string>(type: "varchar(500) CHARACTER SET utf8mb4", maxLength: 500, nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_DM_CodeSystem", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DM_CodeSystemMap",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SourceId = table.Column<long>(type: "bigint", nullable: false),
                    DestinationId = table.Column<long>(type: "bigint", nullable: false),
                    CodeType = table.Column<string>(type: "varchar(100) CHARACTER SET utf8mb4", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DM_CodeSystemMap", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DV_GiaPhong",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    HangPhongId = table.Column<long>(type: "bigint", nullable: false),
                    LoaiPhongCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    LoaiTienTeCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    GiaFOTNettNgayThuong = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GiaFOTBanNgayThuong = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GiaFOTNettNgayLe = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GiaFOTBanNgayLe = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    NgayApDungTu = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayApDungDen = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    IsHasThueVas = table.Column<bool>(type: "tinyint(1)", nullable: false),
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
                    table.PrimaryKey("PK_DV_GiaPhong", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DV_HangPhong",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CategoryCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false),
                    TenPhong = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    MoTa = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoLuongPhong = table.Column<int>(type: "int", nullable: false),
                    SoKhachToiDa = table.Column<int>(type: "int", nullable: false),
                    KichThuocPhong = table.Column<int>(type: "int", nullable: false),
                    SlPhongFOC = table.Column<int>(type: "int", nullable: false),
                    TienIchPhong = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    JsonTaiLieu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_DV_HangPhong", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DichVuCungCapXeEntity");

            migrationBuilder.DropTable(
                name: "DichVuNhaHangEntity");

            migrationBuilder.DropTable(
                name: "DM_CodeSystem");

            migrationBuilder.DropTable(
                name: "DM_CodeSystemMap");

            migrationBuilder.DropTable(
                name: "DV_GiaPhong");

            migrationBuilder.DropTable(
                name: "DV_HangPhong");
        }
    }
}
