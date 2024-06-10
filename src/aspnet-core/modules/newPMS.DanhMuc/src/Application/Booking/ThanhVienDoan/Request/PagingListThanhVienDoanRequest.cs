using Abp.Application.Services.Dto;
using MediatR;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.Booking.ThanhVienDoan.Dtos;
using newPMS.Entities.Booking;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Booking.ThanhVienDoan.Request
{
    public class PagingListThanhVienDoanRequest : PagedFullRequestDto, IRequest<PagedResultDto<ChiTietThanhVienDoanDto>>
    {
        public long BookingId { get; set; }
    }

    public class PagingListThanhVienDoanHandler : IRequestHandler<PagingListThanhVienDoanRequest, PagedResultDto<ChiTietThanhVienDoanDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListThanhVienDoanHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<ChiTietThanhVienDoanDto>> Handle(PagingListThanhVienDoanRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _thanhVienDoanRepos = _factory.Repository<ChiTietThanhVienDoanBooking, long>();
                var result = _thanhVienDoanRepos.Where(x => x.BookingId == request.BookingId)
                    .Select(x => new ChiTietThanhVienDoanDto
                    {
                        Id = x.Id,
                        BookingId = x.BookingId,
                        Email = x.Email,
                        QuocTichId = x.QuocTichId,
                        SoDienThoai = x.SoDienThoai,
                        Ten = x.Ten,
                        VaiTroCode = x.VaiTroCode

                    });
                var totalCount = result.AsQueryable().Count();
                var dataGrids = result.AsQueryable().PageBy(request).ToList();
                return new PagedResultDto<ChiTietThanhVienDoanDto>(totalCount, dataGrids);

            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }
    }
}
