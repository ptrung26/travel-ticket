using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.CongViec.Request
{
    public class PagingCongViecTraoDoiRequest : PagedFullRequestDto, IRequest<PagedResultDto<TraoDoiCongViecDto>>
    {
        public long CongViecId { get; set; }
    }
    public class PagingCongViecTraoDoiHandler : IRequestHandler<PagingCongViecTraoDoiRequest, PagedResultDto<TraoDoiCongViecDto>>
    {
        private readonly IOrdAppFactory _factory;
        public PagingCongViecTraoDoiHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<TraoDoiCongViecDto>> Handle(PagingCongViecTraoDoiRequest req, CancellationToken cancellation)
        {
            try
            {
                var userSession = _factory.UserSession;
                var TraoDoiCongViec = _factory.Repository<CongViecTraoDoiEntity, long>().Where(x => x.CongViecId == req.CongViecId);

                var queryTraoDoi = (from td in TraoDoiCongViec.AsNoTracking()
                                    join us in _factory.Repository<SysUserEntity, long>().AsNoTracking() on td.SysUserId equals us.Id into full
                                    from user in full.DefaultIfEmpty()
                                    select new TraoDoiCongViecDto
                                    {
                                        Id = td.Id,
                                        CongViecId = td.CongViecId,
                                        SysUserId = td.SysUserId,
                                        ParentId = td.ParentId,
                                        NoiDung = td.NoiDung,
                                        IsMyPost = td.SysUserId == userSession.SysUserId ? true : false,
                                        NgayDang = td.CreationTime,
                                        HoTen = user.HoTen,
                                        UserId = user.UserId
                                    }
                                  );
                var listItem = await queryTraoDoi.PageBy(req).OrderBy("Id desc").ToListAsync(cancellation);
                return new PagedResultDto<TraoDoiCongViecDto>
                {
                    Items = listItem,
                    TotalCount = listItem.Count,
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
