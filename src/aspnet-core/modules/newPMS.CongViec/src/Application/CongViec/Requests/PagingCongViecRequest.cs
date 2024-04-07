using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using Newtonsoft.Json;
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
    public class PagingCongViecRequest : PagedFullRequestDto, IRequest<PagedResultDto<CongViecDto>>
    {
        public long? ParentId { get; set; }
        public int? Level { get; set; }
        public bool? IsGetMyJob { get; set; }
        public DateTime? NgayHoanThanh { get; set; }
        public DateTime? NgayTao { get; set; }
        public long? SysUserId { get; set; }
        public int? MucDo { get; set; }

        #region Lọc trong khoảng thời gian 
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        #endregion
    }

    public class PagingCongViecHandler : AppBusinessBase, IRequestHandler<PagingCongViecRequest, PagedResultDto<CongViecDto>>
    {
        private readonly IPermissionChecker _permissionChecker;
        private readonly IOrdAppFactory _factory;
        private IRepository<CongViecEntity, long> _congViecRepos =>
                    _factory.Repository<CongViecEntity, long>();
        private IRepository<SysUserEntity, long> _sysUserRepos =>
            _factory.Repository<SysUserEntity, long>();
        private IRepository<CongViecUserEntity, long> _congViecUserRepos =>
            _factory.Repository<CongViecUserEntity, long>();

        public PagingCongViecHandler(IPermissionChecker permissionChecker, IOrdAppFactory factory)
        {
            _permissionChecker = permissionChecker;
            _factory = factory;
        }


        public async Task<PagedResultDto<CongViecDto>> Handle(PagingCongViecRequest request, CancellationToken cancellationToken)
        {
            bool isLanhDao = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.LanhDao");
            bool isTruongPhong = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.TruongPhong");
            bool isNhanVien = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.NhanVien");

            var response = new PagedResultDto<CongViecDto>();
            if (isLanhDao)
            {
                response = await CongViecLanhDao(request);
            }
            else if (isTruongPhong)
            {
                response = await CongViecTruongPhong(request);
            }
            else if (isNhanVien)
            {
                response = await CongViecNhanVien(request);
            }

            return response;
        }

        private async Task<StringBuilder> GetSelectClause()
        {
            bool isTruongPhong = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.TruongPhong");
            bool isNhanVien = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.NhanVien");

            var usersession = _factory.UserSession;
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

            var selectClause = new StringBuilder();
            selectClause.Append($@"
                        SELECT
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
                            cv.isUuTien,
                            ( SELECT COUNT(1) FROM cv_congviectraodoi AS c WHERE c.IsDeleted = 0 AND c.CongViecId = cv.Id ) AS SoTraoDoi,
                            {queryCountCongViec},
                            {queryCountCongViecHoanThanh}
                        ");
            return selectClause;
        }

        private async Task<StringBuilder> GetWhereClause(PagingCongViecRequest request)
        {
            var userSession = _factory.UserSession;
            bool isNhanVien = await _permissionChecker.IsGrantedAsync("CongViec.QuanLyCongViec.NhanVien");
            var whereClause = new StringBuilder($@" WHERE cv.Isdeleted = 0 ");
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

                //chỉ trưởng phòng mới được lấy dự án cá nhân --> đã lấy bằng PagingCongViecCaNhanRequest
                if (request.Level == (int)LEVEL_CONG_VIEC.DU_AN && !isNhanVien)
                {
                    whereClause.Append($" AND ( cv.IsCaNhan IS NULL || cv.IsCaNhan = 0 ) ");
                }

            }

            if (request.IsGetMyJob == true)
            {
                whereClause.Append($" AND us.SysUserId = {userSession.SysUserId} ");
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

            // Lọc công việc trong khoảng thời gian 
            if(request.FromDate.HasValue)
            {
                whereClause.Append($" AND DATE(cv.NgayBatDau) >= '{request.FromDate.Value.Date.ToString("yyyy/MM/dd")}'"); 
            }
            if(request.ToDate.HasValue)
            {
                whereClause.Append($" AND DATE(cv.NgayKetThuc) <= '{request.ToDate.Value.Date.ToString("yyyy/MM/dd")}'");
            }


            return whereClause;
        }

        private string GetJoinClase()
        {
            return $@" FROM cv_congviec AS cv
                            LEFT JOIN (SELECT * from cv_congviecuser WHERE cv_congviecuser.IsDeleted=0) as us on cv.id=us.CongViecId ";
        }

        private string GetGroupBy()
        {
            return " GROUP BY cv.Id ";
        }

        private string GetOrderClause(PagingCongViecRequest request)
        {
            var orderBy = string.IsNullOrEmpty(request.Sorting) ? "cv.IsUuTien DESC, cv.NgayHoanThanh ASC" : $"cv.{request.Sorting}";
            return $" ORDER BY {orderBy} ";
        }

        private string GetSortClause(PagingCongViecRequest request)
        {
           
            return $" LIMIT {request.MaxResultCount} OFFSET {request.SkipCount} ";
        }

        private List<CongViecUserDto> GetListCongViecUser()
        {
            return (from cv_user in _congViecUserRepos
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
        }

        private void GetInfoCongViec(IReadOnlyList<CongViecDto> dataGrids)
        {
            var userSession = _factory.UserSession;
            var listCongViecUser = GetListCongViecUser();
            foreach (var s in dataGrids)
            {
                if (!string.IsNullOrEmpty(s.JsonTaiLieu))
                {
                    var listTaiLieu = JsonConvert.DeserializeObject<List<ResultUpload>>(s.JsonTaiLieu);
                    s.SoTaiLieu = listTaiLieu.Count();
                }
                
                var listUser = listCongViecUser?.FindAll(x => x.CongViecId == s.Id && x.SysUserId != null && x.SysUserId != s.SysUserId).GroupBy(x => x.SysUserId).Select(s2 => s2.FirstOrDefault()).ToList();
                s.ListUser = listUser;
                s.IsMyCongViec = listUser?.Any(x => x.UserId == userSession.UserId);
                s.SoViec = !string.IsNullOrEmpty(s.IdCongViecStr) ? s.IdCongViecStr.Split(",").Distinct().ToArray().Length : 0;
                s.SoViecDaHoanThanh = !string.IsNullOrEmpty(s.IdCongViecHoanThanhStr) ? s.IdCongViecHoanThanhStr.Split(",").Distinct().ToArray().Length : 0;
                s.PhanTramHoanThanh = s.SoViec > 0 ? Math.Round(new decimal(s.SoViecDaHoanThanh * 100 / s.SoViec)) : 0;
                s.IsMyCreate = s.SysUserId == userSession.SysUserId;
            };
        }

        /**
         * Đối với vai trò lãnh đạo
         *  Dự án: Lãnh đạo tạo dự án nào thì chỉ được xem dự án đó, không được xem dự án của các lãnh đạo khác
         *  Công việc: Lấy tất cả các công việc trong dự án đó dựa vào Id của dự án
         *  Mục việc nhỏ: Lấy tất cả các mục việc nhỏ trong công việc đó dựa vào Id của công việc
         */
        private async Task<PagedResultDto<CongViecDto>> CongViecLanhDao(PagingCongViecRequest request)
        {
            var response = new PagedResultDto<CongViecDto>();
            var queryClause = new StringBuilder();

            queryClause.Append($@" {await GetSelectClause()} {GetJoinClase()} {await GetWhereClause(request)} {GetGroupBy()} {GetOrderClause(request)}");

            response.Items = (await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {queryClause}")).ToList();
            GetInfoCongViec(response.Items);

            queryClause.Append($" {GetSortClause(request)} ");

            response.TotalCount = (await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {queryClause} ")).ToList().Count();

            return response;
        }

        /**
         * Đối với vai trò trưởng phòng
         *  Dự án: Lãnh đạo giao công việc 1 cho trưởng phòng A trong dự án X -> Nếu công việc 1 ở trạng thái >= đang thực hiện thì trưởng phòng A có thể nhìn thấy dự án X
         *  Công việc: Lãnh đạo giao công việc cho trưởng phòng nào thì chỉ trưởng phòng đó nhìn thấy công việc đấy
         *  Mục việc nhỏ: Trưởng phòng tạo mục việc nhỏ nào thì chỉ nhìn thấy mục việc nhỏ đó
         */
        private async Task<PagedResultDto<CongViecDto>> CongViecTruongPhong(PagingCongViecRequest request)
        {
            var response = new PagedResultDto<CongViecDto>();
            var queryClause = new StringBuilder();
            var userSession = _factory.UserSession;
            switch (request.Level)
            {
                case (int)LEVEL_CONG_VIEC.DU_AN:
                    //khi get dự án trưởng phòng được tham gia thì check xem công việc giao cho trưởng phòng trong dự án đó đã >= trạng thái đang thực hiện hay chưa
                    var queryCheckCongViec = new StringBuilder($@"
                    	(
                            SELECT
			                    COUNT( c.Id )
		                    FROM
			                    cv_congviec AS c
			                    JOIN cv_congviecuser AS us ON c.id = us.CongViecId 
			                    AND us.IsDeleted = 0 
		                    WHERE
			                    c.IsDeleted = 0 
                                AND us.SysUserId = {userSession.SysUserId}
			                    AND c.ParentId = cv.Id 
                                AND c.TrangThai >={(int)TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN}
	                    ) AS SoCongViecDangThucHien
                    ");
                    var havingClause = " HAVING SoCongViecDangThucHien > 0 ";

                    queryClause.Append($@" {await GetSelectClause()}, {queryCheckCongViec} {GetJoinClase()} {await GetWhereClause(request)} {GetGroupBy()} {havingClause} {GetOrderClause(request)} ");
                    break;
                case (int)LEVEL_CONG_VIEC.CONG_VIEC:
                    var clause = $" AND cv.TrangThai >= {(int)TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN} ";
                    queryClause.Append($@" {await GetSelectClause()} {GetJoinClase()} {await GetWhereClause(request)} {clause} {GetGroupBy()} {GetOrderClause(request)}");

                    break;
                case (int)LEVEL_CONG_VIEC.MUC_VIEC_NHO:
                    queryClause.Append($@" {await GetSelectClause()} {GetJoinClase()} {await GetWhereClause(request)}  {GetGroupBy()} {GetOrderClause(request)}");
                    break;
            }

            response.Items = (await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {queryClause}")).ToList();
            GetInfoCongViec(response.Items);

            queryClause.Append($" {GetSortClause(request)} ");

            response.TotalCount = (await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {queryClause} ")).ToList().Count();
            return response;
        }

        /**
         * Đối với vai trò nhân viên
         * Dự án: Nếu mục việc nhỏ 1 có trong công việc A ở dự án X được giao cho nhân viên ==> Nhân viên sẽ nhìn thấy dự án X
         * Công việc: Nếu mục việc nhỏ 1 có trong công việc A ở dự án X được giao cho nhân viên ==> Nhân viên sẽ nhìn thấy công việc A
         * Mục việc nhỏ: Nhân viên được trưởng phòng giao cho mục việc nhỏ nào thì chỉ nhìn thấy mục việc nhỏ đó
         */
        private async Task<PagedResultDto<CongViecDto>> CongViecNhanVien(PagingCongViecRequest request)
        {
            var response = new PagedResultDto<CongViecDto>();
            var queryClause = new StringBuilder();

            queryClause.Append($@" {await GetSelectClause()} {GetJoinClase()} {await GetWhereClause(request)} {GetGroupBy()} {GetOrderClause(request)}");

            response.Items = (await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {queryClause}")).ToList();
            GetInfoCongViec(response.Items);

            queryClause.Append($" {GetSortClause(request)} ");

            response.TotalCount = (await Factory.TravelTicketDbFactory.Connection.QueryAsync<CongViecDto>($" {queryClause} ")).ToList().Count();
            return response;
        }
    }
}


