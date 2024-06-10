using MediatR;
using newPMS.Booking.Dtos;
using newPMS.Entities.Booking;
using newPMS.Entities.KhachHang;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Booking.Request
{
    public class CreateOrUpdateThongTinBookingRequest : IRequest<CommonResultDto<long>>
    {
        public IOrdAppFactory Factory { get; set; }
        public CreateOrUpdatThongTinBookingDto Dto { get; set; }
    }

    public class CreateOrUpdateThongTinBookingHandler : IRequestHandler<CreateOrUpdateThongTinBookingRequest, CommonResultDto<long>>
    {
        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateThongTinBookingRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _factory = request.Factory;
                    var _repos = _factory.Repository<BookingEntity, long>();
                if (request.Dto.Id > 0)
                {
                    var booking = await _repos.GetAsync(request.Dto.Id);
                    if (booking != null)
                    {
                        _factory.ObjectMapper.Map(request.Dto, booking);
                        await _repos.UpdateAsync(booking);
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = true,
                            DataResult = booking.Id,
                        };
                    }
                    else
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Booking không tồn tại hoặc đã bị xoá"
                        };
                    }
                } else
                {
                    if(!request.Dto.KhachHangId.HasValue)
                    {
                        var _khRepos = _factory.Repository<KhachHangEntity, long>();
                        var newMa = "KH-" + _khRepos.ToList().Count + 1; 
                        var kh = new KhachHangEntity()
                        {
                            Ten = request.Dto.TenKhachHang,
                            DiaChi = request.Dto.DiaChi,
                            Email = request.Dto.Email,
                            SoDienThoai = request.Dto.SoDienThoai,
                            QuocTichId = request.Dto.QuocTichId,
                            Ma = newMa, 
                        };
                        request.Dto.KhachHangId = (await _khRepos.InsertAsync(kh, true)).Id;
                    }

                    var insert = new BookingEntity();
                    insert.TrangThai = 1; /// Đang xử lý
                    insert.NgayLap = DateTime.Now; 
                    _factory.ObjectMapper.Map(request.Dto, insert);
                    if(string.IsNullOrEmpty(insert.Ma))
                    {
                        var newMaBooking = "BO-" + _repos.ToList().Count;
                        insert.Ma = newMaBooking; 
                    }
                    var newId  = (await _repos.InsertAsync(insert, true)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId,
                    };
                }
            } catch(Exception ex)
            {
                throw new Exception(ex.Message); 
            }
        }
    }
}
