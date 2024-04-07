using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Application.Dtos;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class DuyetTaiKhoanBenhVienDto : EntityDto<long>
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string TinhId { get; set; }
        public string HuyenId { get; set; }
        public string XaId { get; set; }
        public string SoNha { get; set; }
        public string Email { get; set; }
        public string DienThoai { get; set; }
        public int LoaiKhachHang { get; set; }
        public string MaSoThue { get; set; }
        public int? LoaiHinhDoanhNghiep { get; set; }
        public int? Hang { get; set; }
        public int TrangThai { get; set; }
        public int? PhanCapDonVi { get; set; }
        public int? CoQuanQuanLy { get; set; }
        public int? LoaiHinhDauTu { get; set; }
        public int? LoaiHinhHoatDong { get; set; }
        public string TenNguoiDaiDien { get; set; }
        public string ChucVuNguoiDaiDien { get; set; }
        public string TaiKhoanNganHang { get; set; }
        public string ChiNhanhNganHang { get; set; }
        public string TenKeToanTruong { get; set; }
        public string DienThoaiKeToanTruong { get; set; }
        public string EmailKeToanTruong { get; set; }
        public string TenNguoiLienHeLamHopDong { get; set; }
        public string DienThoaiNguoiLienHeLamHopDong { get; set; }
        public string EmailNguoiLienHeLamHopDong { get; set; }
        public string TenNguoiPhuTrachEQA { get; set; }
        public string EmailNguoiPhuTrachEQA { get; set; }
        public string SoDienThoaiNguoiPhuTrachEQA { get; set; }
        public string TenNhanVienThanhToan { get; set; }
        public string DienThoaiNhanVienThanhToan { get; set; }
        public string ChucVuNhanVienThanhToan { get; set; }
        public int? NguonThongTinTaiKhoan { get; set; }

        public string Fax { get; set; }
        public long? ParentId { get; set; }
        public string TenTinh { get; set; }
        public string TenHuyen { get; set; }
        public string TenXa { get; set; }

        public string NgayDangKy { get; set; }
        [NotMapped]
        public string TravelTicketCode { get; set; }

        public bool DaCoPhieuDangKy { get; set; }
    }
}