﻿using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.Dtos
{
    public class CreateOrUpdateDichVuBookingTourDto : EntityDto<long>
    {
        public long BookingId { get; set; }
        public long? TourId { get; set; }
        public string TenTour { get; set; }

        public DateTime? NgayBatDau { get; set; }

        public int? SoLuongNguoiLon { get; set; }
        public int? SoLuongTreEm { get; set; }
        public string DiemDen { get; set; }
        public DateTime? GioDon { get; set; }

        public List<CrudChiTietDichVuBookingTour> ListChiTiet { get; set; }
    }

    public class CrudChiTietDichVuBookingTour : EntityDto<long>
    {
        public long BookingId { get; set; }
        public long BookingTourId { get; set; }
        public string LoaiDoTuoi { get; set; }
        public decimal GiaNett { get; set; }
        public decimal GiaBan { get; set; }
        public int SoLuong { get; set; }
        public decimal ThanhTien { get; set; }
    }
}