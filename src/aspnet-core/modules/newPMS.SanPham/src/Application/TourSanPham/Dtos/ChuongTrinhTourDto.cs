using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.TourSanPham.Dtos
{
    public class ChuongTrinhTourDto : EntityDto<long>
    {
        public long TourSanPhamId { get; set; }
        public int NgayThu { get; set; }
        public string TenHanhTrinh { get; set; }
        public string TepDinhKemJson { get; set; }
        public string NoiDung { get; set; }
        public string DiemDen { get; set; }

        public string ListDichVuJson { get; set; }
    }
}
