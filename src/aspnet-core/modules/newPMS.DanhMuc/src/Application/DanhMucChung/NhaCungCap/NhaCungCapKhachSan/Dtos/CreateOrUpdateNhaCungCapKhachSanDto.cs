using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace newPMS.DanhMuc.Dtos
{
    public class CreateOrUpdateNhaCungCapKhachSanDto : EntityDto<long>
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
        public string Website { get; set; }
        public string MaSoThue { get; set; }
        public string MoTa { get; set; }
        public string AnhDaiDienUrl { get; set; }
        public string TaiLieuJson { get; set; }
        public bool IsHasVAT { get; set; }
        public string DichVu { get; set; }
        public DateTime NgayHetHanHopDong { get; set; }
        public string NgayCuoiTuan { get; set; }

        public int SoSao { get; set; }
    }
}
