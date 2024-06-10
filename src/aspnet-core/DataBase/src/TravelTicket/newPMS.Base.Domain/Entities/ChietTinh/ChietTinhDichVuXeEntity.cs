﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;

namespace newPMS.Entities.ChietTinh
{
    [Table("ct_DichVuXe")]
    public class ChietTinhDichVuXeEntity : FullAuditedAggregateRoot<long>
    {
        public string KhoangKhachCode { get; set; } 
        public long? DichVuXeId { get; set; }
        public long? NhaCungCapId { get; set; }
        public long TourSanPhamId { get; set; }
        public int NgayThu { get; set; }
        public decimal? GiaNett { get; set; }

    }
}