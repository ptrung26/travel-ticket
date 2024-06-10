using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace newPMS.Migrations
{
    public partial class AddBooking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "sys_Booking",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Ma = table.Column<string>(type: "varchar(50) CHARACTER SET utf8mb4", maxLength: 50, nullable: false),
                    TinhId = table.Column<long>(type: "bigint", nullable: false),
                    KenhBanHang = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NhanVienId = table.Column<long>(type: "bigint", nullable: false),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    LoaiKhachHangCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    KhachHangId = table.Column<long>(type: "bigint", nullable: false),
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
                    table.PrimaryKey("PK_sys_Booking", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_BookingDichVuTour",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BookingId = table.Column<long>(type: "bigint", nullable: false),
                    TourId = table.Column<long>(type: "bigint", nullable: true),
                    NgayBatDau = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    SoLuongNguoiLon = table.Column<int>(type: "int", nullable: true),
                    SoLuongTreEm = table.Column<int>(type: "int", nullable: true),
                    DiemDen = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    GioDon = table.Column<DateTime>(type: "datetime(6)", nullable: true),
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
                    table.PrimaryKey("PK_Sys_BookingDichVuTour", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_ChiTietBookingDichVuLe",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BookingId = table.Column<long>(type: "bigint", nullable: true),
                    DichVuId = table.Column<long>(type: "bigint", nullable: true),
                    TenDichVu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoLuong = table.Column<int>(type: "int", nullable: true),
                    ThanhTien = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    GhiChu = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_Sys_ChiTietBookingDichVuLe", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_ChiTietBookingDichVuTour",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    LoaiDoTuoi = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    GiaNett = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    GiaBan = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    ThanhTien = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
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
                    table.PrimaryKey("PK_Sys_ChiTietBookingDichVuTour", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_ChiTietLichHenBookingTour",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BookingId = table.Column<long>(type: "bigint", nullable: false),
                    TieuDe = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NoiDung = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    NgayBatDau = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    NgayKetThuc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DiaDiem = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_Sys_ChiTietLichHenBookingTour", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_ChiTietPhieuThuBookingTour",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BookingId = table.Column<long>(type: "bigint", nullable: false),
                    SoChungTu = table.Column<string>(type: "varchar(50) CHARACTER SET utf8mb4", maxLength: 50, nullable: true),
                    NgayChungTu = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    NgayHachToan = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LoaiThuCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TongTien = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    PhuongThucThanhToanCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    TrangThai = table.Column<int>(type: "int", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime(6)", nullable: true),
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
                    table.PrimaryKey("PK_Sys_ChiTietPhieuThuBookingTour", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sys_ChiTietThanhVienDoanBooking",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TourId = table.Column<long>(type: "bigint", nullable: false),
                    Ten = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    Email = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    SoDienThoai = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
                    QuocTichId = table.Column<long>(type: "bigint", nullable: false),
                    VaiTroCode = table.Column<string>(type: "longtext CHARACTER SET utf8mb4", nullable: true),
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
                    table.PrimaryKey("PK_Sys_ChiTietThanhVienDoanBooking", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sys_Booking");

            migrationBuilder.DropTable(
                name: "Sys_BookingDichVuTour");

            migrationBuilder.DropTable(
                name: "Sys_ChiTietBookingDichVuLe");

            migrationBuilder.DropTable(
                name: "Sys_ChiTietBookingDichVuTour");

            migrationBuilder.DropTable(
                name: "Sys_ChiTietLichHenBookingTour");

            migrationBuilder.DropTable(
                name: "Sys_ChiTietPhieuThuBookingTour");

            migrationBuilder.DropTable(
                name: "Sys_ChiTietThanhVienDoanBooking");
        }
    }
}
