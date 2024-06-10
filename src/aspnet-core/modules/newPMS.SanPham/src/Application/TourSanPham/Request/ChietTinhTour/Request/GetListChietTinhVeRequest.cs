using Dapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.ChietTinh;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.TourSanPham.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.TourSanPham.Request
{
    public class GetListChietTinhVeRequest : IRequest<CommonResultDto<List<ChietTinhVeDto>>>
    {
        public long TourSanPhamId { get; set; }
    }

    public class GetListChietTinhVeHandler : IRequestHandler<GetListChietTinhVeRequest, CommonResultDto<List<ChietTinhVeDto>>>
    {
        private readonly IOrdAppFactory _factory;

        public GetListChietTinhVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<List<ChietTinhVeDto>>> Handle(GetListChietTinhVeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var query = $@"select ct.id, 
                                    dvve.Id as DichVuVeId,
                                    ct.GiaNett, 
                                    dvve.IsHasThueVAT, 
                                    dvve.Ten as TenDichVu, 
                                    nccve.Id as NhaCungCapId,
                                    nccve.Ten as TenNhaCungCap, 
                                    ct.TourSanPhamId, 
                                    ct.NgayThu, 
                                    ct.KhoangKhachCode
                                    from ct_dichvuve ct
                                    left join dv_ve dvve on ct.DichVuVeId = dvve.Id 
                                    left join dm_nhacungcapve nccve on dvve.NhaCungCapVeId = nccve.Id where ct.TourSanPhamId = {request.TourSanPhamId}";
                var result = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<ChietTinhVeDto>(query)).ToList();
                foreach (var item in result)
                {
                    var khoangKhach = csRepos.FirstOrDefault(x => x.Code == item.KhoangKhachCode);
                    if (khoangKhach != null)
                    {
                        item.KhoangKhachDisplay = khoangKhach.Display;
                    }

                }
                return new CommonResultDto<List<ChietTinhVeDto>>
                {
                    IsSuccessful = true,
                    DataResult = result
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<List<ChietTinhVeDto>>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                };
            }
        }
    }
}
