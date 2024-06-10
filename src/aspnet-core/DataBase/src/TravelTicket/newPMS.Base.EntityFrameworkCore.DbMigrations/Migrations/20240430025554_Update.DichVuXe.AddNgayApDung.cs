using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class UpdateDichVuXeAddNgayApDung : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DenNgay",
                table: "DV_Xe",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TuNgay",
                table: "DV_Xe",
                type: "datetime(6)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DenNgay",
                table: "DV_Xe");

            migrationBuilder.DropColumn(
                name: "TuNgay",
                table: "DV_Xe");
        }
    }
}
