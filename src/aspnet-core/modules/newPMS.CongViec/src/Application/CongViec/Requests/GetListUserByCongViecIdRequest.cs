using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.CongViec.Request
{
    public class GetListUserByCongViecIdRequest : IRequest<List<CongViecUserDto>>
    {
        public long CongViecId { get; set; }
    }
    public class GetListUserByCongViecHandler : IRequestHandler<GetListUserByCongViecIdRequest, List<CongViecUserDto>>
    {
        private readonly IOrdAppFactory _factory;
        public GetListUserByCongViecHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<List<CongViecUserDto>> Handle(GetListUserByCongViecIdRequest req, CancellationToken cancellation)
        {
            try
            {
                var query = new StringBuilder($@"
                                        SELECT
	                                        uscv.SysUserId AS SysUserId,
	                                        uscv.CongViecId AS CongViecId,
	                                        us.UserId AS UserIdGuid,
	                                        us.HoTen,
	                                        us.Avatar as AnhDaiDien,
	                                        us.UserName 
                                        FROM
	                                        cv_congviecuser AS uscv
	                                        LEFT JOIN sysuser AS us ON uscv.SysUserId = us.Id
                                        WHERE
                                            uscv.IsDeleted=0

                                        ");

                var whereClause = new StringBuilder($" AND uscv.CongViecId = {req.CongViecId}");
                var GroupQuery = " GROUP BY uscv.SysUserId";
                var queryBuilder = new StringBuilder($" {query} {whereClause} {GroupQuery}");


                var listUser = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecUserDto>(queryBuilder.ToString())).ToList();

                //if (listUser.Count > 0)
                //{
                //    foreach (var item in listUser)
                //    {
                //        if (_factory.GetServiceDependency<DanhSachCongViecAppService>().CheckRole(CongViecPermission.LanhDao, item.UserIdGuid))
                //        {
                //            item.IsLanhDao = true;
                //        }
                //        if (_factory.GetServiceDependency<DanhSachCongViecAppService>().CheckRole(CongViecPermission.TruongPhong, item.UserIdGuid))
                //        {
                //            item.IsTruongPhong = true;
                //        }
                //        if (_factory.GetServiceDependency<DanhSachCongViecAppService>().CheckRole(CongViecPermission.NhanVien, item.UserIdGuid))
                //        {
                //            item.IsNhanVien = true;
                //        }
                //    }
                //}
                return listUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
