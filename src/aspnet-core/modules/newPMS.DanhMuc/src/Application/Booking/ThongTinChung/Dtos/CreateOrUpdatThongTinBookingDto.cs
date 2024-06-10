using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.Dtos
{
    public class CreateOrUpdatThongTinBookingDto : EntityDto<long>
    {
        #region Thông tin chung
        public string Ma { get; set; }
        public string TinhId { get; set; }
        public string KenhBanHang { get; set; }
        public long? NhanVienId { get; set; }
        public string GhiChu { get; set; }
        public string Ten { get; set; }
        #endregion

        #region Thông tin khách hàng
        public string LoaiKhachHangCode { get; set; }
        public long? KhachHangId { get; set; }

        public long? SysUerId { get; set; }

        public string TenKhachHang { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }
        public string QuocTichId { get; set; }
        public string DiaChi { get; set; }
        #endregion

        public string PhuongThucCode { get; set; }

    }
}
