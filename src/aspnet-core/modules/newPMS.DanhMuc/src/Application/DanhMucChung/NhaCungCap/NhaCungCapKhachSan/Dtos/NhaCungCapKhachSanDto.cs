using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace newPMS.DanhMucChung.Dtos
{
    public class NhaCungCapKhachSanDto : EntityDto<long>
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public string LoaiKhachSanCode { get; set; }
        public bool TinhTrang { get; set; } 
        public int? QuocGiaId { get; set; }
        public int? TinhId { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string MaSoThue { get; set; }
        public string Website { get; set; }
        public string MoTa { get; set; }
        public string AnhDaiDienUrl { get; set; }
        public string TaiLieuJson { get; set; }
        public bool IsHasVAT { get; set; }
        public string DichVu { get; set; }
        public int SoSao { get; set; }
        public DateTime NgayHetHanHopDong { get; set; }
        public string NgayCuoiTuan { get; set; }

        public List<NguoiLienHeNCCDto> ListNguoiLienHeNCC { get; set; }
        public List<DichVuHangPhongDto> ListDichVuHangPhong { get; set; }

    }

   
    public class DichVuHangPhongDto : EntityDto<long>
    {
        public string LoaiPhongCode { get; set; }
        public string TenHangPhong { get; set; }
        public long NhaCungCapId { get; set; }
        public string MoTa { get; set; }
        public int? SoLuongPhong { get; set; }
        public int? SoKhachToiDa { get; set; }
        public int? KichThuocPhong { get; set; }
        public int? SlPhongFOC { get; set; }
        public string TienIchPhong { get; set; }
        public string JsonTaiLieu { get; set; }
        public List<DichVuGiaPhongDto> ListDichVuGiaPhong { get; set; }

       
    }

    public class DichVuGiaPhongDto : EntityDto<long>
    {
        public long NhaCungCapKhachSanId { get; set; }
        public string TenNhaCungCap { get; set; }
        public string TenPhong { get; set; }
        public long HangPhongId { get; set; }
        public string TenHangPHong { get; set; }

        public string LoaiPhongCode { get; set; }
        public string LoaiTienTeCode { get; set; }
        public decimal? GiaFOTNettNgayThuong { get; set; }
        public decimal? GiaFOTBanNgayThuong { get; set; }
        public decimal? GiaFOTNettNgayLe { get; set; }
        public decimal? GiaFOTBanNgayLe { get; set; }
        public DateTime? NgayApDungTu { get; set; }
        public DateTime? NgayApDungDen { get; set; }
        public string GhiChu { get; set; }
        public bool IsHasThueVAT { get; set; }
    }
}
