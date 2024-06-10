using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddNhaCungCapXe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DichVuCungCapXeEntity",
                table: "DichVuCungCapXeEntity");

            migrationBuilder.DropColumn(
                name: "CategoryCode",
                table: "DichVuCungCapXeEntity");

            migrationBuilder.DropColumn(
                name: "SoCho",
                table: "DichVuCungCapXeEntity");

            migrationBuilder.RenameTable(
                name: "DichVuCungCapXeEntity",
                newName: "DV_Xe");

            migrationBuilder.AlterColumn<string>(
                name: "SoChoCode",
                table: "DV_Xe",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DV_Xe",
                table: "DV_Xe",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DM_NhaCungCapXe",
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
                    table.PrimaryKey("PK_DM_NhaCungCapXe", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DM_NhaCungCapXe");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DV_Xe",
                table: "DV_Xe");

            migrationBuilder.RenameTable(
                name: "DV_Xe",
                newName: "DichVuCungCapXeEntity");

            migrationBuilder.AlterColumn<long>(
                name: "SoChoCode",
                table: "DichVuCungCapXeEntity",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CategoryCode",
                table: "DichVuCungCapXeEntity",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SoCho",
                table: "DichVuCungCapXeEntity",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DichVuCungCapXeEntity",
                table: "DichVuCungCapXeEntity",
                column: "Id");
        }
    }
}
