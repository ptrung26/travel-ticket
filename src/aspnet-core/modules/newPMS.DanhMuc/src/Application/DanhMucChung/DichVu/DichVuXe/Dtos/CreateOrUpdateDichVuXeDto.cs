﻿using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Dtos
{
    public class CreateOrUpdateDichVuXeDto : EntityDto<long>
    {
        public long NhaCungCapXeId { get; set; }
        public string Ma { get; set; }
        public string Ten { get; set; }
        public int? SoKMDuTinh { get; set; }
        public string LoaiXeCode { get; set; }
        public string LoaiTienTeCode { get; set; }
        public string SoChoCode { get; set; }
        public decimal? GiaNett { get; set; }
        public decimal? GiaBan { get; set; }
        public string GhiChu { get; set; }
        public bool IsHasThueVAT { get; set; }
        public string JsonTaiLieu { get; set; }
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public bool TinhTrang { get; set; }
    }
}
