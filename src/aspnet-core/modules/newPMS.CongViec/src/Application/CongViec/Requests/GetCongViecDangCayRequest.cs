using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.CongViec.Requests
{
    public class GetCongViecDangCayRequest : IRequest<CommonResultDto<CongViecDto>>
    {
        public long Id { get; set; }
        public int? Level { get; set;  }
    }

    public class GetCongViecDangCayHandler : IRequestHandler<GetCongViecDangCayRequest, CommonResultDto<CongViecDto>>
    {
        private readonly IOrdAppFactory _factory;

        public GetCongViecDangCayHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<CongViecDto>> Handle(GetCongViecDangCayRequest request, CancellationToken cancellationToken)
        {
           
            var whereClause = request.Level.HasValue ? $" AND c.level <= {request.Level.Value}" : ""; 
            var query = $@"
                    WITH RECURSIVE congviec_hierarchy AS (
                        SELECT 
                            cv.id, 
                            cv.ten, 
                            cv.mota, 
                            cv.parentId, 
                            cv.sysUserId
                        FROM cv_congviec cv
                        WHERE cv.isDeleted = 0 AND cv.id = {request.Id} 

                        UNION ALL

                        SELECT 
                            c.id, 
                            c.ten, 
                            c.mota, 
                            c.parentId, 
                            c.sysUserId
                        FROM congviec_hierarchy ch
                        INNER JOIN cv_congviec c ON ch.id = c.parentId
                        WHERE c.isDeleted = 0 {whereClause}
                    )

                    SELECT Id, Ten, MoTa, ParentId,SysUserId FROM congviec_hierarchy;";

            var list = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>(query)).ToList();
            var tree = TaoDuLieuCay(list, null);
            var congViec = tree.FirstOrDefault();
            return new CommonResultDto<CongViecDto>
            {
                IsSuccessful = true,
                DataResult = congViec
            };
        }

        private List<CongViecDto> TaoDuLieuCay(List<CongViecDto> list, long? parentId)
        {
            var children = new List<CongViecDto>();

            foreach (var item in list.Where(r => r.ParentId == parentId))
            {

                item.Children = TaoDuLieuCay(list, item.Id);
                children.Add(item);
            }

            return children;
        }
    }
}
