using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddHopDongXe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HD_ChiTietHDXe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false),
                    HopDongId = table.Column<long>(type: "bigint", nullable: false),
                    TenXe = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    BienSoXe = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TenDichVu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NguoiLaiXe = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    CMND = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ExtraProperties = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "varchar(40) CHARACTER SET utf8mb4", maxLength: 40, nullable: true),
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
                    table.PrimaryKey("PK_HD_ChiTietHDXe", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HD_NhaCungCapXe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false),
                    Ma = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    LoaiHopDongCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NgayHieuLuc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayHetHan = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NgayKy = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    NguoiLapHopDong = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TinhTrang = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ExtraProperties = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "varchar(40) CHARACTER SET utf8mb4", maxLength: 40, nullable: true),
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
                    table.PrimaryKey("PK_HD_NhaCungCapXe", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HD_ChiTietHDXe");

            migrationBuilder.DropTable(
                name: "HD_NhaCungCapXe");
        }
    }
}
