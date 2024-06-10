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
    public class PagingListNhaCungCapXeRequest : PagedFullRequestDto,
         IRequest<PagedResultDto<NhaCungCapXeDto>>
    {
        public long? SoSaoDanhGia { get; set; }
    }

    public class PagingListNhaCungCapXeHandler : IRequestHandler<PagingListNhaCungCapXeRequest, PagedResultDto<NhaCungCapXeDto>>
    {
        private readonly IOrdAppFactory _factory; 

        public PagingListNhaCungCapXeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<NhaCungCapXeDto>> Handle(PagingListNhaCungCapXeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var result = (from xe in _factory.Repository<NhaCungCapXeEntity, long>()
                              select new NhaCungCapXeDto
                              {
                                  Id = xe.Id,   
                                  Ma = xe.Ma,
                                  Ten = xe.Ten,
                                  Email = xe.Email,
                                  Fax = xe.Fax,
                                  SoSaoDanhGia = xe.SoSaoDanhGia,
                                  AnhDaiDienUrl = xe.AnhDaiDienUrl, 
                                  DiaChi = xe.DiaChi,
                                  DichVu = xe.DichVu, 
                                  IsHasVAT = xe.IsHasVAT, 
                                  MoTa = xe.MoTa, 
                                  NgayHetHanHopDong = xe.NgayHetHanHopDong, 
                                  QuocGiaId = xe.QuocGiaId,
                                  TinhId = xe.TinhId, 
                                  TaiLieuJson = xe.TaiLieuJson, 
                                  TinhTrang = xe.TinhTrang, 
                              }).WhereIf(!string.IsNullOrEmpty(request.Filter), x => EF.Functions.Like(x.Ten, request.FilterFullText))
                          .WhereIf(request.SoSaoDanhGia.HasValue, x => x.SoSaoDanhGia == request.SoSaoDanhGia.Value);
                

                var totalCount = await result.CountAsync(cancellationToken);
                var dataGrids = await result.PageBy(request).ToListAsync(cancellationToken);

                return new PagedResultDto<NhaCungCapXeDto>(totalCount, dataGrids);
            } catch(Exception ex)
            {
                Console.WriteLine("PAGING_DM_XE:" + ex.Message); 
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau"); 
            }
            


        }

    }
}
