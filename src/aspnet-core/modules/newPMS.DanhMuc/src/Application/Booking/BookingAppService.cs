using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.Booking.DichVuLe.Request;
using newPMS.Booking.Dtos;
using newPMS.Booking.Request;
using newPMS.Booking.ThanhVienDoan.Dtos;
using newPMS.Booking.ThanhVienDoan.Request;
using newPMS.DanhMuc;
using newPMS.Entities.Booking;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.TextTemplating;

namespace newPMS.Booking
{
    public class BookingAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IMediator _mediator; 
        public BookingAppService(IOrdAppFactory factory, ITemplateRenderer templateRenderer, IMediator mediator)
        {
            _factory = factory;
            _mediator = mediator;
        }

        [HttpPost(Utilities.ApiUrlBase + "PagingList")]
        public async Task<PagedResultDto<ThongTinChungBookingDto>> PagingList(PagingListBookingRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdate")]
        public async Task<CommonResultDto<long>> CreateOrUpdate(CreateOrUpdateBookingRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetById")]
        public async Task<CommonResultDto<BookingDto>> GetBooKingById(GetBookingByIdRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        #region Thành viên đoàn 
        [HttpPost(Utilities.ApiUrlBase + "PagingListThanhVienDoan")]
        public async Task<PagedResultDto<ChiTietThanhVienDoanDto>> PagingListThanhVienDoan(PagingListThanhVienDoanRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateThanhVienDoan")]
        public async Task<CommonResultDto<long>> CreateOrUpdateThanhVienDoan(CreateOrUpdateThanhVienDoanRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }
        #endregion

        #region Dịch vụ lẻ
        [HttpPost(Utilities.ApiUrlBase + "PagingListDichVuLe")]
        public async Task<PagedResultDto<ChiTietDichVuLeBookingDto>> PagingListDichVuLe(PagingDichVuLeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }

        [HttpPost(Utilities.ApiUrlBase + "CreateOrUpdateDichVuLe")]
        public async Task<CommonResultDto<long>> CreateOrUpdateDichVuLe(CreateOrUpdateDichVuLeRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result;
        }


        [HttpPost(Utilities.ApiUrlBase + "ThayDoiTrangThai")]
        public async Task<CommonResultDto<bool>> ThayDoiTrangThai(long bookingId, int trangThai)
        {
            var _bookingRepos = _factory.Repository<BookingEntity, long>();
            var booking = await _bookingRepos.GetAsync(bookingId); 
            if(booking != null)
            {
                booking.TrangThai = trangThai;
                await _bookingRepos.UpdateAsync(booking);

                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            } else
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false, 
                    ErrorMessage = "Booking không tồn tại hoặc đã bị xoá"
                };
            } 
        }

        [HttpPost(Utilities.ApiUrlBase + "SendEmailLienHeNCC")]
        public async Task<CommonResultDto<bool>> SendEmailLienHeNCC(SendEmailLienHeNCCRequest request)
        {
            try
            {
                var result = await _mediator.Send(request);
                return result;
            } catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
          
        }

        [HttpPost(Utilities.ApiUrlBase + "XacNhanHuyBooking")]
        public async Task<CommonResultDto<bool>> XacNhanHuyBooking(HuyBookingRequest request)
        {
            try
            {
                var result = await _mediator.Send(request);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        #endregion
    }
}
