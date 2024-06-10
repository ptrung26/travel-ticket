using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Requests;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities.DanhMuc.NhaCungCap;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using RestSharp.Extensions;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Request
{
    public class PagingListNhaCungCapKhachSanRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<NhaCungCapKhachSanDto>>
    {
        public int? SoSao { get; set; }
    }

    public class PagingListNhaCungCapKhachSanHandler : IRequestHandler<PagingListNhaCungCapKhachSanRequest, PagedResultDto<NhaCungCapKhachSanDto>>
    {
        private readonly IOrdAppFactory _factory; 

        public PagingListNhaCungCapKhachSanHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<NhaCungCapKhachSanDto>> Handle(PagingListNhaCungCapKhachSanRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var result = (from ks in _factory.Repository<NhaCungCapKhachSanEntity, long>()
                              select new NhaCungCapKhachSanDto
                              {
                                  Id = ks.Id, 
                                  Ma = ks.Ma,
                                  Ten = ks.Ten,
                                  Email = ks.Email,
                                  Fax = ks.Fax,
                                  SoSao = ks.SoSao,
                                  TinhTrang = ks.TinhTrang, 
                                  NgayCuoiTuan = ks.NgayCuoiTuan, 
                                  AnhDaiDienUrl = ks.AnhDaiDienUrl, 
                                  DiaChi = ks.DiaChi, 
                                  NgayHetHanHopDong = ks.NgayHetHanHopDong, 
                                  MoTa = ks.MoTa, 
                                  QuocGiaId = ks.QuocGiaId, 
                                  TinhId = ks.TinhId, 
                                  Website = ks.Website, 
                                  DichVu = ks.DichVu, 
                                  IsHasVAT = ks.IsHasVAT, 
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.Ten, request.FilterFullText))
                          .WhereIf(request.SoSao.HasValue, x => x.SoSao == request.SoSao.Value);
                

                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);

                return new PagedResultDto<NhaCungCapKhachSanDto>(totalCount, dataGrids);
            } catch(Exception ex)
            {
                Console.WriteLine("PAGING_DM_KHACH_SAN:" + ex.Message); 
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau"); 
            }
            


        }

    }
}
