using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.CongViec.Services;
using newPMS.Entities;
using newPMS.Permissions;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using static newPMS.CommonEnum;

namespace newPMS.CongViec.Request
{
    public class PagingCongViecCaNhanRequest : PagedFullRequestDto, IRequest<PagedResultDto<CongViecDto>>
    {
        public long? ParentId { get; set; }
        public int? Level { get; set; }
        public bool? IsGetMyJob { get; set; }
        public DateTime? NgayHoanThanh { get; set; }
        public DateTime? NgayTao { get; set; }
        public long? SysUserId { get; set; }
        public int? MucDo { get; set; }
    }

    public class PagingCongViecCaNhanHandler : AppBusinessBase, IRequestHandler<PagingCongViecCaNhanRequest, PagedResultDto<CongViecDto>>
    {
        private readonly IPermissionChecker _permissionChecker;
        private readonly IOrdAppFactory _factory;
        private IRepository<CongViecEntity, long> _congViecRepos =>
                    _factory.Repository<CongViecEntity, long>();
        private IRepository<SysUserEntity, long> _sysUserRepos =>
            _factory.Repository<SysUserEntity, long>();
        private IRepository<CongViecUserEntity, long> _congViecUserRepos =>
            _factory.Repository<CongViecUserEntity, long>();

        public PagingCongViecCaNhanHandler(IPermissionChecker permissionChecker, IOrdAppFactory factory)
        {
            _permissionChecker = permissionChecker;
            _factory = factory;
        }


        public async Task<PagedResultDto<CongViecDto>> Handle(PagingCongViecCaNhanRequest request, CancellationToken cancellationToken)
        {
            bool isTruongPhong = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.TruongPhong");
            bool isNhanVien = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.NhanVien");

            var usersession = _factory.UserSession;
            var listCongViecUser = (from cv_user in _congViecUserRepos
                                    join s in _sysUserRepos on cv_user.SysUserId equals s.Id into l_s
                                    from s in l_s.DefaultIfEmpty()
                                    select new CongViecUserDto
                                    {
                                        CongViecId = cv_user.CongViecId,
                                        SysUserId = cv_user.SysUserId,
                                        HoTen = s != null ? s.HoTen : "",
                                        UserName = s != null ? s.UserName : "",
                                        AnhDaiDien = s != null ? s.Avatar : "",
                                        UserId = s != null ? s.UserId : null,
                                    }).ToList();

            var joinClase = isNhanVien ? $" AND us.SysUserId = {usersession.SysUserId} " : " AND 1 = 1";
            var whereClase = isTruongPhong ? $" AND c.SysUserId = {usersession.SysUserId} " : " AND 1 = 1";

            var queryCountCongViec = new StringBuilder($@"
                    	(
	                        SELECT
		                        GROUP_CONCAT( c.Id ) 
	                        FROM
		                        cv_congviec AS c
		                        JOIN cv_congviecuser AS us ON c.id = us.CongViecId 
		                        {joinClase}
		                        AND us.IsDeleted = 0 
	                        WHERE
		                        c.IsDeleted = 0 
                                {whereClase}
		                        AND c.ParentId = cv.Id 
	                    ) AS IdCongViecStr
                ");

            var queryCountCongViecHoanThanh = new StringBuilder($@"
                    	(
                            SELECT
			                    GROUP_CONCAT( c.Id )
		                    FROM
			                    cv_congviec AS c
			                    JOIN cv_congviecuser AS us ON c.id = us.CongViecId 
                                {joinClase}
			                    AND us.IsDeleted = 0 
		                    WHERE
			                    c.IsDeleted = 0 
                                {whereClase}
			                    AND c.ParentId = cv.Id 
			                    AND ( c.IsHoanThanh = 1 OR c.TrangThai = {(int)TRANG_THAI_CONG_VIEC.HOAN_THANH} ) 
	                ) AS IdCongViecHoanThanhStr
                ");

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
                                                         cv.IsUuTien, 
                                                         ( SELECT COUNT(1) FROM cv_congviectraodoi AS c WHERE c.IsDeleted = 0 AND c.CongViecId = cv.Id ) AS SoTraoDoi,
                                                         {queryCountCongViec},
                                                         {queryCountCongViecHoanThanh}
                                                        FROM
                                                         cv_congviec AS cv
                                                            LEFT JOIN (SELECT * from cv_congviecuser WHERE cv_congviecuser.IsDeleted=0) as us on cv.id=us.CongViecId
                                                        WHERE
                                                         cv.Isdeleted = 0 AND cv.IsCaNhan = 1
                                                  ");
            var whereClause = new StringBuilder();
            if (!string.IsNullOrEmpty(request.Filter))
            {
                whereClause.Append($" And LOWER(cv.Ten) LIKE '%{request.Filter.ToLower()}%'");
            }

            //công việc, công việc nhỏ
            if (request.ParentId != null)
            {
                whereClause.Append($" AND cv.ParentId={request.ParentId} ");
            }
            if (request.Level != null)
            {
                whereClause.Append($" AND cv.Level = {request.Level} ");
            }

            if (request.IsGetMyJob.HasValue && request.IsGetMyJob.Value)
            {
                whereClause.Append($" AND us.SysUserId = {usersession.SysUserId} ");
            }

            if (isNhanVien)
            {
                whereClause.Append($" AND cv.TrangThai > {(int)TRANG_THAI_CONG_VIEC.TAO_MOI} ");
            }

            if (request.NgayHoanThanh.HasValue)
            {
                whereClause.Append($" AND DATE(cv.NgayHoanThanh) = '{request.NgayHoanThanh.Value.ToString("yyyy/MM/dd")}' ");
            }

            if (request.NgayTao.HasValue)
            {
                whereClause.Append($" AND DATE(cv.CreationTime) = '{request.NgayTao.Value.Date.ToString("yyyy/MM/dd")}'");
            }

            if (request.SysUserId.HasValue)
            {
                whereClause.Append($" AND cv.SysUserId = {request.SysUserId}");
            }

            if (request.MucDo.HasValue)
            {
                whereClause.Append($" AND cv.MucDo = {request.MucDo}");
            }

            var sortClause = " GROUP BY cv.id ORDER BY cv.SoThuTu ASC , cv.id DESC";
            var pagingClause = $" LIMIT {request.MaxResultCount} OFFSET {request.SkipCount} ";

            var items = await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {query} {whereClause} {sortClause} {pagingClause}");
            var totalCount = await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {query} {whereClause} {sortClause} ");

            items = items.ToList()?.Select(s =>
            {
                var listUser = listCongViecUser?.FindAll(x => x.CongViecId == s.Id && x.SysUserId != null &&  x.SysUserId != s.SysUserId).GroupBy(x => x.SysUserId).Select(s2 => s2.FirstOrDefault()).ToList();
                s.ListUser = listUser;
                s.IsMyCongViec = listUser?.Any(x => x.UserId == usersession.UserId);
                s.SoViec = !string.IsNullOrEmpty(s.IdCongViecStr) ? s.IdCongViecStr.Split(",").Distinct().ToArray().Length : 0;
                s.SoViecDaHoanThanh = !string.IsNullOrEmpty(s.IdCongViecHoanThanhStr) ? s.IdCongViecHoanThanhStr.Split(",").Distinct().ToArray().Length : 0;
                s.PhanTramHoanThanh = s.SoViec > 0 ? Math.Round(new decimal(s.SoViecDaHoanThanh * 100 / s.SoViec)) : 0;
                s.IsMyCreate = s.SysUserId == usersession.SysUserId;
                return s;
            });

            return new PagedResultDto<CongViecDto>
            {
                Items = items?.ToList(),
                TotalCount = totalCount.ToList().Count
            };

        }

    }
}


