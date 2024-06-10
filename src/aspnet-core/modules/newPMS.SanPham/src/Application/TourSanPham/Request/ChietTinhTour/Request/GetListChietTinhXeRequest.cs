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
    public class GetListChietTinhXeRequest : IRequest<CommonResultDto<List<ChietTinhXeDto>>>
    {
        public long TourSanPhamId { get; set; }
    }

    public class GetListChietTinhXeHandler : IRequestHandler<GetListChietTinhXeRequest, CommonResultDto<List<ChietTinhXeDto>>>
    {
        private readonly IOrdAppFactory _factory;

        public GetListChietTinhXeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<List<ChietTinhXeDto>>> Handle(GetListChietTinhXeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var query = $@"select ct.id, 
                                    dvxe.Id as DichVuXeId,
                                    ct.GiaNett, 
                                    dvxe.IsHasThueVAT, 
                                    dvxe.Ten as TenDichVu, 
                                    nccXe.Id as NhaCungCapId,
                                    nccxe.Ten as TenNhaCungCap, 
                                    ct.TourSanPhamId, 
                                    ct.NgayThu, 
                                    ct.KhoangKhachCode
                                    from ct_dichvuxe ct
                                    left join dv_xe dvxe on ct.DichVuXeId = dvxe.Id 
                                    left join dm_nhacungcapxe nccxe on dvxe.NhaCungCapXeId = nccxe.Id where ct.TourSanPhamId = {request.TourSanPhamId}";
                var result = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<ChietTinhXeDto>(query)).ToList();
                foreach (var item in result)
                {
                    var khoangKhach = csRepos.FirstOrDefault(x => x.Code == item.KhoangKhachCode);
                    if (khoangKhach != null)
                    {
                        item.KhoangKhachDisplay = khoangKhach.Display;
                    }

                }
                return new CommonResultDto<List<ChietTinhXeDto>>
                {
                    IsSuccessful = true,
                    DataResult = result
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("ChietTinh_Xe: " + ex.Message);
                return new CommonResultDto<List<ChietTinhXeDto>>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                };
            }
        }
    }
}
