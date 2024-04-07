
using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace newPMS.CongViec.Request
{
    public class PagingLichSuCongViecRequest : PagedFullRequestDto, IRequest<PagedResultDto<CongViecLichSuDto>>
    {
        public long CongViecId { get; set; }
    }
    public class PagingLichSuCongViecHandler : IRequestHandler<PagingLichSuCongViecRequest, PagedResultDto<CongViecLichSuDto>>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IRepository<CongViecLichSuEntity, long> _congViecLichSuRepos;
        private readonly IRepository<SysUserEntity, long> _sysUserRepos;

        public PagingLichSuCongViecHandler(IOrdAppFactory factory,
            IRepository<CongViecLichSuEntity, long> congViecLichSuRepos,
            IRepository<SysUserEntity, long> sysUserRepos)
        {
            _factory = factory;
            _congViecLichSuRepos = congViecLichSuRepos;
            _sysUserRepos = sysUserRepos;
        }
        public async Task<PagedResultDto<CongViecLichSuDto>> Handle(PagingLichSuCongViecRequest input, CancellationToken cancellation)
        {
            var query = new StringBuilder($@"SELECT 
                                                    ls.Id,
                                                    ls.CongViecId,
                                                    ls.SysUserId,
                                                    ls.TrangThai,
                                                    ls.HanhDong,
                                                    ls.GhiChu,
                                                    us.HoTen as TenNguoiThucHien,
                                                    ls.CreationTime,
                                                    us.UserId
                                                from cv_congvieclichsu as ls 	
                                                    LEFT JOIN sysuser as us ON ls.SysUserId=us.Id
                                                    Where  ls.CongViecId ={input.CongViecId}");

            var pagingclause = $" ORDER BY ls.Id DESC LIMIT {input.MaxResultCount} OFFSET {input.SkipCount}";
            var full = new StringBuilder($"{query} {pagingclause}");

            var listItem = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecLichSuDto>(full.ToString())).ToList();

            var total = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecLichSuDto>(query.ToString())).ToList();
            return new PagedResultDto<CongViecLichSuDto>
            {
                Items = listItem,
                TotalCount = total.Count
            };
        }
    }
}
