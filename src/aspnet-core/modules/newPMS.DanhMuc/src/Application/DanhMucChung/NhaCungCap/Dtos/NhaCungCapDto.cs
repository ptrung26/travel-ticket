using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Dtos
{
    public class NhaCungCapDto : EntityDto<long>
    {
        public string Ten { get; set; }

        public string TenVietTat { get; set; }

        public string DiaChi { get; set; }

        public string TenQuocGia { get; set; }

        public string QuocGiaId { get; set; }

        public string TinhId { get; set; }

        public string HuyenId { get; set; }

        public string XaId { get; set; }

        public string TenTinh { get; set; }

        public string TenHuyen { get; set; }

        public string TenXa { get; set; }

        public string TruSo { get; set; }

        public string DaiDien { get; set; }

        public string SoDangKyKinhDoanh { get; set; }

        public string Logo { get; set; }

        public string TenNguoiDaiDien { get; set; }

        public string EmailNguoiDaiDien { get; set; }

        public string DienThoaiNguoiDaiDien { get; set; }
        
        public bool TrangThai { get; set; }

        public string NgayDangKy { get; set; }

        public string PhanLoai { get; set; }

        public string PhanLoaiStr { get; set; }

    }

    public class ResultUploadNhaPhanPhoi
    {
        public string Url { get; set; }
        public string Path { get; set; }
        public string FileName { get; set; }
        public string Name { get; set; }
        public bool Status { get; set; }
        public string Type { get; set; }
        public string Msg { get; set; }
        public bool IsLogo { get; set; }
    }
}
