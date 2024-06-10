using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateNhaCungCapKhachSan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_NhaCungCapKhachSanEntity",
                table: "NhaCungCapKhachSanEntity");

            migrationBuilder.DropColumn(
                name: "CategoryCode",
                table: "DV_HangPhong");

            migrationBuilder.DropColumn(
                name: "LoaiPhongCode",
                table: "DV_GiaPhong");

            migrationBuilder.RenameTable(
                name: "NhaCungCapKhachSanEntity",
                newName: "DM_NhaCungCapKhachSan");

            migrationBuilder.RenameColumn(
                name: "IsHasThueVas",
                table: "DV_GiaPhong",
                newName: "IsHasThueVAT");

            migrationBuilder.AddColumn<int>(
                name: "LoaiPhong",
                table: "DV_HangPhong",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LoaiPhong",
                table: "DV_GiaPhong",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DM_NhaCungCapKhachSan",
                table: "DM_NhaCungCapKhachSan",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DM_NguoiLienHeNCC",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    HoVaTen = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    PhongBan = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    ChucVu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    DienThoai = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Email = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: false),
                    NhaCungCapId = table.Column<long>(type: "bigint", nullable: false),
                    NhaCungCapCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_DM_NguoiLienHeNCC", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DM_NguoiLienHeNCC");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DM_NhaCungCapKhachSan",
                table: "DM_NhaCungCapKhachSan");

            migrationBuilder.DropColumn(
                name: "LoaiPhong",
                table: "DV_HangPhong");

            migrationBuilder.DropColumn(
                name: "LoaiPhong",
                table: "DV_GiaPhong");

            migrationBuilder.RenameTable(
                name: "DM_NhaCungCapKhachSan",
                newName: "NhaCungCapKhachSanEntity");

            migrationBuilder.RenameColumn(
                name: "IsHasThueVAT",
                table: "DV_GiaPhong",
                newName: "IsHasThueVas");

            migrationBuilder.AddColumn<string>(
                name: "CategoryCode",
                table: "DV_HangPhong",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoaiPhongCode",
                table: "DV_GiaPhong",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_NhaCungCapKhachSanEntity",
                table: "NhaCungCapKhachSanEntity",
                column: "Id");
        }
    }
}
