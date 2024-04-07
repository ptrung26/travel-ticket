using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.CongViec.Services;
using newPMS.Permissions;
using OrdBaseApplication.Factory;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static newPMS.CommonEnum;

namespace newPMS.CongViec.Request
{
    public class GetCongViecByIdRequest : IRequest<CongViecDto>
    {
        public long Id { get; set; }
    }
    public class GetCongViecByIdHandler : IRequestHandler<GetCongViecByIdRequest, CongViecDto>
    {
        private readonly IOrdAppFactory _factory;
        public GetCongViecByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CongViecDto> Handle(GetCongViecByIdRequest req, CancellationToken cancellation)
        {
            var query = new StringBuilder($@"SELECT
	                                                    cv.Id,
	                                                    cv.ParentId,
	                                                    cv.Ten,
	                                                    cv.MoTa,
	                                                    cv.MucDo,
	                                                    cv.TrangThai,
	                                                    cv.NgayBatDau,
	                                                    cv.NgayKetThuc,
	                                                    cv.LEVEL,
	                                                    cv.SoThuTu ,
                                                        cv.IsHoanThanh,
                                                        cv.NgayHoanThanh,
                                                        cv.IsCaNhan,
                                                        cv.SysUserId,
                                                         cv.JsonTaiLieu,
                                                        ( SELECT COUNT(*) FROM cv_congviectraodoi AS c WHERE c.IsDeleted = 0 AND c.CongViecId = cv.Id ) AS SoTraoDoi,
                                                        (SELECT COUNT(*) FROM cv_congviec AS c WHERE c.IsDeleted = 0 AND c.ParentId = cv.Id ) AS SoViec,
                                                        (SELECT COUNT(*) FROM cv_congviec AS c WHERE c.IsDeleted = 0 AND (c.IsHoanThanh=1 OR c.TrangThai={(int)TRANG_THAI_CONG_VIEC.HOAN_THANH} ) AND c.ParentId = cv.Id ) as SoViecDaHoanThanh
                                                FROM
	                                                cv_congviec AS cv 
                                                WHERE
                                                    cv.IsDeleted =0 AND
	                                                cv.id = {req.Id}
	                                                
                                                ");
            var item = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>(query.ToString())).FirstOrDefault();
            if (item != null)
            {
                item.PhanTramHoanThanh = item.SoViec > 0 ? Math.Round(new decimal(item.SoViecDaHoanThanh * 100 / item.SoViec)) : 0;
                item.IsMyCreate = item.SysUserId == _factory.UserSession?.SysUserId;
            }

            var queryUser = new StringBuilder($@"
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
	                                                WHERE uscv.IsDeleted=0
	                                                AND uscv.CongViecId={req.Id}"
                                            );
            var listUser = (await _factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecUserDto>(queryUser.ToString())).ToList();
            if(listUser?.Count > 0)
            {
                item.ListUser = listUser.FindAll(x =>  x.SysUserId != null &&  x.SysUserId != item.SysUserId);
            }
            return item;
        }
    }
}
