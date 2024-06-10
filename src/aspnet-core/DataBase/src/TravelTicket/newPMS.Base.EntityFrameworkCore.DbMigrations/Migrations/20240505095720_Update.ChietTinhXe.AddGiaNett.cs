using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateChietTinhXeAddGiaNett : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChietTinh_DichVuXe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KhoangKhachCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoLuongChoNgoi = table.Column<int>(type: "int", nullable: false),
                    DichVuXeId = table.Column<long>(type: "bigint", nullable: false),
                    TourSanPhamId = table.Column<long>(type: "bigint", nullable: false),
                    NgayThu = table.Column<int>(type: "int", nullable: false),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
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
                    table.PrimaryKey("PK_ChietTinh_DichVuXe", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChietTinh_DichVuXe");
        }
    }
}
