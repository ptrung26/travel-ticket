using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.DichVu.DichVuPhong.Requests
{
    public class PagingListHangPhongRequest : PagedFullRequestDto, IRequest<PagedResultDto<DichVuHangPhongDto>>
    {
        public long NhaCungCapId { get; set; }

        public class PagingListHangPhongHandler : IRequestHandler<PagingListHangPhongRequest, PagedResultDto<DichVuHangPhongDto>>
        {
            private readonly IOrdAppFactory _factory;

            public PagingListHangPhongHandler(OrdAppFactory factory)
            {
                _factory = factory;
            }

            public async Task<PagedResultDto<DichVuHangPhongDto>> Handle(PagingListHangPhongRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _factory.Repository<DichVuHangPhongEntity, long>()
                    .Where(x => x.NhaCungCapId == request.NhaCungCapId)
                    .Select(x => new DichVuHangPhongDto
                    {
                        NhaCungCapId = x.NhaCungCapId,
                        Id = x.Id,
                        TenHangPhong = x.TenHangPhong, 
                        JsonTaiLieu = x.JsonTaiLieu,
                        KichThuocPhong = x.KichThuocPhong,
                        LoaiPhongCode = x.LoaiPhongCode,
                        SlPhongFOC = x.SlPhongFOC,
                        SoKhachToiDa = x.SoKhachToiDa,
                        MoTa = x.MoTa,
                        TienIchPhong = x.TienIchPhong,
                        SoLuongPhong = x.SoLuongPhong,
                    }).ToListAsync();

                    var totalCount = result.AsQueryable().Count();
                    var dataGrids = result.AsQueryable().PageBy(request).ToList();
                    return new PagedResultDto<DichVuHangPhongDto>(totalCount, dataGrids);

                }
                catch (Exception ex)
                {

                    throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
                }
            }
        }
    }
}