using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddNhaCungCapVe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ChietTinh_DichVuXe",
                table: "ChietTinh_DichVuXe");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "HD_NhaCungCapXe");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "HD_NhaCungCapXe");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "HD_ChiTietHDXe");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "HD_ChiTietHDXe");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "DM_NhaCungCapXe");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "DM_NhaCungCapXe");

            migrationBuilder.RenameTable(
                name: "ChietTinh_DichVuXe",
                newName: "ct_DichVuXe");

            migrationBuilder.AddColumn<long>(
                name: "NhaCungCapId",
                table: "ct_DichVuXe",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ct_DichVuXe",
                table: "ct_DichVuXe",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DM_NhaCungCapVe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Ma = table.Column<string>(type: "varchar(50) CHARACTER SET utf8mb4", maxLength: 50, nullable: false),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    TinhTrang = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    QuocGiaId = table.Column<long>(type: "bigint", nullable: true),
                    TinhId = table.Column<long>(type: "bigint", nullable: true),
                    DiaChi = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Email = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Fax = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Website = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    MoTa = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    AnhDaiDienUrl = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TaiLieuJson = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    IsHasVAT = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DichVu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoSaoDanhGia = table.Column<float>(type: "float", nullable: true),
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
                    table.PrimaryKey("PK_DM_NhaCungCapVe", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DV_VE",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NhaCungCapVeId = table.Column<long>(type: "bigint", nullable: false),
                    Ma = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    LoaiTienTeCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    GiaBan = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    IsHasThueVAT = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    JsonTaiLieu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TuNgay = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DenNgay = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    TinhTrang = table.Column<bool>(type: "tinyint(1)", nullable: false),
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
                    table.PrimaryKey("PK_DV_VE", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DM_NhaCungCapVe");

            migrationBuilder.DropTable(
                name: "DV_VE");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ct_DichVuXe",
                table: "ct_DichVuXe");

            migrationBuilder.DropColumn(
                name: "NhaCungCapId",
                table: "ct_DichVuXe");

            migrationBuilder.RenameTable(
                name: "ct_DichVuXe",
                newName: "ChietTinh_DichVuXe");

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "HD_NhaCungCapXe",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "HD_NhaCungCapXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "HD_ChiTietHDXe",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "HD_ChiTietHDXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "DM_NhaCungCapXe",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "DM_NhaCungCapXe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChietTinh_DichVuXe",
                table: "ChietTinh_DichVuXe",
                column: "Id");
        }
    }
}
