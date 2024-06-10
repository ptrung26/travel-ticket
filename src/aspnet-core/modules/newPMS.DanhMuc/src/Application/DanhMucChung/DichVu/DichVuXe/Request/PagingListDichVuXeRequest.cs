using Abp.Application.Services.Dto;
using Humanizer;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMucChung.Request
{
    public class PagingListDichVuXeRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<DichVuXeDto>>
    {
        public long NhaCungCapXeId { get; set; }
    }

    public class PagingListDichVuXeHandler : IRequestHandler<PagingListDichVuXeRequest, PagedResultDto<DichVuXeDto>>
    {
        private readonly IOrdAppFactory _factory; 

        public PagingListDichVuXeHandler(IOrdAppFactory factory)
        {
            _factory = factory; 
        }
        public async Task<PagedResultDto<DichVuXeDto>> Handle(PagingListDichVuXeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var result = (from dvx in _factory.Repository<DichVuCungCapXeEntity, long>()
                              select new DichVuXeDto
                              {
                                  Id = dvx.Id,
                                  Ma = dvx.Ma,
                                  Ten = dvx.Ten,
                                  GhiChu = dvx.GhiChu,
                                  GiaBan = dvx.GiaBan,
                                  GiaNett = dvx.GiaNett,
                                  IsHasThueVAT = dvx.IsHasThueVAT,
                                  JsonTaiLieu = dvx.JsonTaiLieu,
                                  LoaiTienTeCode = dvx.LoaiTienTeCode,
                                  LoaiXeCode = dvx.LoaiXeCode,
                                  NhaCungCapXeId = dvx.NhaCungCapXeId,
                                  SoChoCode = dvx.SoChoCode,
                                  SoKMDuTinh = dvx.SoKMDuTinh,
                                  TuNgay = dvx.TuNgay,
                                  DenNgay = dvx.DenNgay,
                                  TinhTrang = dvx.TinhTrang,
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.Ma, request.FilterFullText)
                              || EF.Functions.Like(x.Ten, request.FilterFullText))
                          .Where(x => x.NhaCungCapXeId == request.NhaCungCapXeId);
          
                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);
                for (int i = 0; i < dataGrids.Count; i++)
                {
                    var loaiXeCode = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].LoaiXeCode);
                    var loaiTienTeCode = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].LoaiTienTeCode);
                    var loaiChoNgoiCode = csRepos.FirstOrDefault(x => x.Code == dataGrids[i].SoChoCode);

                    if (loaiXeCode != null)
                    {
                        dataGrids[i].LoaiXeDisplay = loaiXeCode.Display;
                    }
                    if (loaiTienTeCode != null)
                    {
                        dataGrids[i].LoaiTienTeDisplay = loaiTienTeCode.Display;
                    }
                    if (loaiChoNgoiCode != null)
                    {
                        dataGrids[i].SoChoDisplay = loaiChoNgoiCode.Display;
                    }
                }

                return new PagedResultDto<DichVuXeDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                Console.WriteLine("PAGING_DV_XE:" + ex.Message);
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }

        }
    }
}
