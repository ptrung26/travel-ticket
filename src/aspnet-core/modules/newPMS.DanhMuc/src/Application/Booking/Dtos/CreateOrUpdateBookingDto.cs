using Abp.Application.Services.Dto;
using newPMS.Booking.ThanhVienDoan.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.Dtos
{
    public class CreateOrUpdateBookingDto : EntityDto<long>
    {
        public CreateOrUpdatThongTinBookingDto Booking { get; set; }
        public CreateOrUpdateDichVuBookingTourDto Tour { get; set; }


    }
}
