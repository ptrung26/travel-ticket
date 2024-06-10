using Abp.Application.Services.Dto;
using newPMS.Booking.ThanhVienDoan.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.Dtos
{
    public class BookingDto : EntityDto<long>
    {
        public ThongTinChungBookingDto ThongTinChung { get; set; }
        public DichVuBookingTourDto DichVuBookingTour { get; set; }

    }
}
