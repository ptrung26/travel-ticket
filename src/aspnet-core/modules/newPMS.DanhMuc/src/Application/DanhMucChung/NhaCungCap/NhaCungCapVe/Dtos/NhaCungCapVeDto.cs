using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Dtos
{
    public class NhaCungCapVeDto : EntityDto<long>
    {
        public string Ma { get; set; }
        public string Ten { get; set; }
        public bool TinhTrang { get; set; }
        public long? QuocGiaId { get; set; }
        public long? TinhId { get; set; }
        public string DiaChi { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Website { get; set; }
        public string MoTa { get; set; }
        public string AnhDaiDienUrl { get; set; }
        public string TaiLieuJson { get; set; }
        public bool IsHasVAT { get; set; }
        public string DichVu { get; set; }
        public float? SoSaoDanhGia { get; set; }
        public string MaSoThue { get; set; }
        public DateTime NgayHetHanHopDong { get; set; }
    }
}
