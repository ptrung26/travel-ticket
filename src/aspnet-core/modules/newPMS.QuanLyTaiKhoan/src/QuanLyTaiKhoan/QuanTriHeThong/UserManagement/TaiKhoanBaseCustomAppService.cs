using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using newPMS.DapperRepositories;
using newPMS.Entities;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.QuanTriHeThong.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TextTemplating;
using Volo.Abp.Uow;
using IdentityUser = Volo.Abp.Identity.IdentityUser;

namespace newPMS.QuanLyTaiKhoan.Services
{
    public interface ITaiKhoanBaseCustomAppService : IApplicationService
    {
        //Task<CommonResultDto<SysUserDto>> CreateOrUpdateUser(CreateOrUpdateUserRequest input);
        //Task<CommonResultDto<bool>> DoiMatKhau(DoiMatKhauRequest input);
        //Task<List<RoleAbleDto>> GetDanhSachRole();

        //#region Lock
        //Task<Guid> LockUser(LockUserRequest request);
        //#endregion

        //Task<int> SetRoleForUser(SetRoleForUserRequest request);
        //Task<CommonResultDto<Guid>> XoaTaiKhoan(XoaTaiKhoanRequest input);
    }
    [Authorize]
    public class TaiKhoanBaseCustomAppService : QuanLyTaiKhoanAppService, ITaiKhoanBaseCustomAppService
    {
        private readonly IOrdAppFactory _factory;
        protected IPermissionManager PermissionManager;
        protected IPermissionDefinitionManager PermissionDefinitionManager;
        private readonly IRepository<SysUserEntity, long> _userRepos;
        private readonly IRepository<SysRoleEntity, long> _roleRepos;
        private readonly IRepository<SysUserRoleEntity, long> _userRoleRepos;
        private readonly IRepository<SysRoleLevelEntity, long> _roleLevelRepository;
        private readonly IRepository<SysOrganizationunits, long> _phongBanRepository;
        private readonly IGuidGenerator _guidGenerator;
        private readonly IConfiguration _configuration;
        //private readonly IIdentityUserAppService _userAppService;
        private readonly IdentityUserManager _userManager;
        private readonly IPasswordHasher<IdentityUser> _passwordHasher;
        private readonly IBulkInsertDapperRepository _bulkInsert;
        //private readonly ILogger _logger;
        private readonly IEmailSender _emailSender;
        private readonly ITemplateRenderer _templateRenderer;
        private readonly IBackgroundJobManager _backgroundJobManager;
        public TaiKhoanBaseCustomAppService(
            IOrdAppFactory factory,
             IRepository<SysUserEntity, long> userRepos,
             IRepository<SysRoleEntity, long> roleRepos,
             IRepository<SysUserRoleEntity, long> userRoleRepos,
             IRepository<SysRoleLevelEntity, long> roleLevelRepository,
              IRepository<SysOrganizationunits, long> phongBanRepository,
             IGuidGenerator guidGenerator,
             IConfiguration configuration,
             //IIdentityUserAppService userAppService,
             IdentityUserManager userManager,
            //IBulkInsertDapperRepository bulkInsert
            //ILogger<TaiKhoanBaseCustomAppService> logger
            IEmailSender emailSender,
            ITemplateRenderer templateRenderer,
            IBackgroundJobManager backgroundJobManager
            )
        {
            _factory = factory;
            PermissionManager = factory.GetServiceDependency<IPermissionManager>();
            PermissionDefinitionManager = factory.GetServiceDependency<IPermissionDefinitionManager>();
            _userRepos = userRepos;
            _roleRepos = roleRepos;
            _userRoleRepos = userRoleRepos;
            _roleLevelRepository = roleLevelRepository;
            _phongBanRepository = phongBanRepository;
            _guidGenerator = guidGenerator;
            _configuration = configuration;
            //_userAppService = userAppService;
            //_userAppService = factory.GetServiceDependency<IIdentityUserAppService>();
            _userManager = userManager;
            _passwordHasher = factory.GetServiceDependency<IPasswordHasher<IdentityUser>>();
            _bulkInsert = factory.GetServiceDependency<IBulkInsertDapperRepository>();
            //_logger = logger;
            _emailSender = emailSender;
            _templateRenderer = templateRenderer;
            _backgroundJobManager = backgroundJobManager;
        }

        #region Base
        [HttpPost]
        public async Task<PagedResultDto<SysUserDto>> GetList(GetListUserCoSoRequest input)
        {
            try
            {
                var _yTeCoSoConnection = _factory.TravelTicketDbFactory.Connection;
                var prm = new
                {
                    TextSearch = input.Filter.LikeTextSearch()
                };
                var tskItems = _yTeCoSoConnection.QueryAsync<SysUserDto>(GetQuerySqlUser(input, true), prm);
                var tskTotal = _yTeCoSoConnection.QueryFirstOrDefaultAsync<int>(GetQuerySqlUser(input, false), prm);
                await Task.WhenAll(tskTotal, tskItems);
                var ret = new PagedResultDto<SysUserDto>()
                {
                    Items = tskItems.Result.ToList(),
                    TotalCount = tskTotal.Result
                };
                if (ret.Items?.Any() == true)
                {
                    var lstId = ret.Items.Select(x => x.UserId).Distinct();
                    var lstUserAbpDto = (await GetUserNames(lstId.ToList())).ToList();
                    if (lstUserAbpDto?.Any() != true)
                    {
                        return ret;
                    }
                    foreach (var item in ret.Items)
                    {
                        var u = lstUserAbpDto.FirstOrDefault(x => x.Id == item.UserId);
                        if (u != null)
                        {
                            item.UserName = u.UserName;
                            item.IsLock = u.LockoutEnabled && u.LockoutEnd >= DateTime.Now;
                        }
                    }
                }
                return ret;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private string GetQuerySqlUser(GetListUserCoSoRequest input, bool isItems = true)
        {
            var select = new StringBuilder(isItems == false ? "1" :
               $@" u.*,
            (select GROUP_CONCAT(' ',r.Ten) from SysRole r 
            LEFT JOIN SysUserRole ur on r.Id = ur.SysRoleId 
            where ur.SysUserId = u.Id ) as ListRoleName,
            (u.CreatorId = '{_factory.CurrentUser.Id.ToString()}' And u.UserId <> '{_factory.CurrentUser.Id.ToString()}') IsCreator
            ");
            var sql = new StringBuilder(@$"
            SELECT {select} 
            FROM SysUser u
            WHERE u.IsDeleted = 0 AND u.UserId != '00000000-0000-0000-0000-000000000000'
            ");
            if (!string.IsNullOrEmpty(input.Filter))
            {
                sql.Append(" and (u.UserName like @TextSearch or u.HoTen like @TextSearch or u.Email like @TextSearch or u.SoDienThoai like @TextSearch)");
            }
            if (input.Id.HasValue)
            {
                sql.Append($" and u.Id = {input.Id} ");
            }
            if (input.SysRoleId.HasValue)
            {
                sql.Append($" and r.Id = {input.SysRoleId} ");
            }

            if (input.KhachHangId.HasValue)
            {
                sql.Append($" and u.KhachHangId = {input.KhachHangId} ");
            }
            if (input.Level.HasValue)
            {
                sql.Append($" and u.Level = {input.Level} ");
            }
            if (!string.IsNullOrWhiteSpace(input.MaTinh))
            {
                sql.Append($" and dv.MaTinh = {input.MaTinh} ");
            }
            if (!string.IsNullOrWhiteSpace(input.MaHuyen))
            {
                sql.Append($" and dv.MaHuyen = {input.MaHuyen} ");
            }
            if (!string.IsNullOrWhiteSpace(input.MaXa))
            {
                sql.Append($" and dv.MaXa = {input.MaXa} ");
            }
            if (input.ListLevelEnumIds != null && input.ListLevelEnumIds.Count > 0)
            {
                string strListLevel = string.Join(",", input.ListLevelEnumIds);

                sql.Append($" and u.Level in ({strListLevel}) ");
            }
            //sql.Append(" GROUP BY u.Id ");
            sql.Append(" ORDER BY u.Level ");

            if (isItems)
            {
                return $@"{sql} LIMIT {input.SkipCount},{input.MaxResultCount} ";
            }
            else
            {
                return $@"SELECT COUNT(1) from ({sql}) A";
            }

        }

        private Task<IEnumerable<UserAbpDto>> GetUserNames(List<Guid> listId)
        {
            return _factory.DefaultDbFactory.Connection.QueryAsync<UserAbpDto>(
                $@"
                SELECT * from AbpUsers au WHERE Id in  @ListId
                ",
                new
                {
                    ListId = listId
                });
        }

        #region GetlistUser Ver2
        [HttpPost(Utilities.ApiUrlBase + "GetListV2")]
        public async Task<PagedResultDto<SysUserDto>> GetListV2(GetListUserCoSoRequest input)
        {
            var queryBuilder = new StringBuilder();
            var queryTotal = new StringBuilder();
            var whereClause = new StringBuilder();
            var queryClause = new StringBuilder($@"
                            SELECT
	                            u.Id,
	                            u.UserName,
	                            u.Email,
	                            u.HoTen,
	                            u.HoTenKhongDau,
	                            u.KhachHangId,
                                u.UserId,
	                            u.Email,
	                            u.SoDienThoai,
	                            u.CreationTime,
	                            GROUP_CONCAT(' ', s.Ten ) As ListRoleName
                            FROM
	                            SysUser u
	                            LEFT JOIN sysuserrole AS sur ON u.Id = sur.SysUserId
	                            LEFT JOIN sysrole AS s ON sur.SysRoleId = s.Id  AND s.IsDeleted = 0
                            WHERE
	                            u.IsDeleted = 0 
                                AND u.UserId != '00000000-0000-0000-0000-000000000000' 
                            ");
            if (!string.IsNullOrEmpty(input.Filter))
            {
                whereClause.Append($" and (u.UserName like '{input.Filter.LikeTextSearch()}' or u.HoTen like '{input.Filter.LikeTextSearch()}' " +
                                  $"or u.Email like '{input.Filter.LikeTextSearch()}' or u.SoDienThoai like '{input.Filter.LikeTextSearch()}') ");
            }
            if (input.ListSysRoleId?.Count > 0)
            {
                whereClause.Append($" and s.Id in ({string.Join(", ", input.ListSysRoleId)}) ");
            }
            var sortClause = new StringBuilder(" GROUP BY u.Id ORDER BY u.Id desc ");
            var pagingClause = $" LIMIT {input.MaxResultCount} OFFSET {input.SkipCount} ";

            queryBuilder.Append($"{queryClause} {whereClause} {sortClause} {pagingClause}");
            queryTotal.Append($"{queryClause} {whereClause} {sortClause}");
            var items = await _factory.TravelTicketDbFactory.Connection.QueryAsync<SysUserDto>(queryBuilder.ToString());
            var totalCount = await _factory.TravelTicketDbFactory.Connection.QueryAsync<SysUserDto>(queryTotal.ToString());

            if (items.ToList()?.Count > 0)
            {
                var listUserId = string.Join(", ", items.Select(x => $"'{x.UserId}'").ToArray());

                var queryApbUser = new StringBuilder($@"
                 SELECT * from AbpUsers au WHERE Id in  ({listUserId}) and  IsDeleted = 0
                ");
                var lstApbUser = await _factory.DefaultDbFactory.Connection.QueryAsync<UserAbpDto>(queryApbUser.ToString());

                items = items.Select(x =>
                {
                    x.ListRoleName = !string.IsNullOrEmpty(x.ListRoleName) ? x.ListRoleName.Split(",").Distinct().JoinAsString(",") : "";
                    var apbuser = lstApbUser.FirstOrDefault(a => a.Id == x.UserId);
                    if (apbuser != null)
                    {
                        x.IsLock = apbuser.LockoutEnabled && apbuser.LockoutEnd >= DateTime.Now;
                    }
                    return x;
                }).ToList();
            }

            return new PagedResultDto<SysUserDto>
            {
                Items = items?.ToList(),
                TotalCount = totalCount.ToList().Count
            };
        }

        #endregion

        public async Task<GetUserForEditOutput> GetUserForEditNoAuthen(long? UserId)
        {
            try
            {
                var output = new GetUserForEditOutput
                {
                    User = new CreateOrUpdateSysUserDto(),
                    //Roles = userRoleDtos,
                };

                if (UserId > 0)
                {

                    //Editing an existing user
                    var user = await _userRepos.GetAsync(UserId.Value);
                    output.User = _factory.ObjectMapper.Map<SysUserEntity, CreateOrUpdateSysUserDto>(user);

                    //get thông tin user identily
                    var IQueryUserIdentily = await _factory.DefaultDbFactory.Connection.QueryAsync<UserAbpDto>($@" SELECT * from AbpUsers  WHERE Id = @Id",
                        new
                        {
                            Id = user.UserId
                        });
                    var getUser = IQueryUserIdentily.FirstOrDefault();


                    var userRoles = _userRoleRepos.Where(m => m.SysUserId == UserId);

                    var userRoleDtos = await (from role in _roleRepos.Where(x => !x.Ten.ToLower().Equals("adminx"))
                                              join r_urRole in userRoles on role.Id equals r_urRole.SysRoleId into tb_urRole
                                              from urRole in tb_urRole.DefaultIfEmpty()
                                              select new SysRoleDto
                                              {
                                                  Id = role.Id,
                                                  //Level = roleLvel.Level,
                                                  Ma = role.Ma,
                                                  Ten = role.Ten,
                                                  IsActive = urRole != null ? true : false
                                              }).Distinct().ToListAsync();

                    if (output.User.KhachHangId.HasValue)
                    {
                        var donViCoSo = await _phongBanRepository.FirstOrDefaultAsync(m => m.Id == output.User.KhachHangId.Value);

                    }
                    output.Roles = userRoleDtos;

                    StringBuilder query = new StringBuilder($@"
                                        SELECT
	                                        * 
                                        FROM
	                                        `sysorganizationunitsuser` 
                                        WHERE
	                                        SysUserId = {UserId}
                                            AND IsDeleted = 0
                                        ");
                    var result = await _factory.TravelTicketDbFactory.Connection.QueryAsync<SysOrganizationunitsUser>(query.ToString());
                    output.ListIdSysOrganizationunits = result.Select(x => x.SysOrganizationunitsId.ToString()).ToList();
                }
                else
                {
                    output.Roles = await (from role in _roleRepos
                                          select new SysRoleDto
                                          {
                                              Id = role.Id,
                                              //RoleId = role.Id,
                                              Ma = role.Ma,
                                              Ten = role.Ten,
                                              //IsDefault = role.IsDefault,
                                              IsActive = role.IsDefault
                                          }).Distinct().ToListAsync();
                }
                return output;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<RoleLevelDto>> GetRoleByLevelCoSo(GetRoleTaiKhoanDto input)
        {
            try
            {
                var queryRoleLevel = _roleLevelRepository.Where(m => m.Level == input.Level);
                //Getting all available roles
                var userRoleDtos = await (from role in _roleRepos
                                          join roleLvel in queryRoleLevel on role.Id equals roleLvel.SysRoleId
                                          select new RoleLevelDto
                                          {
                                              Id = role.Id,
                                              Level = roleLvel.Level,
                                              RoleId = roleLvel.SysRoleId,
                                              Ma = role.Ma,
                                              Ten = role.Ten,
                                              IsDefault = role.IsDefault,
                                              IsActive = role.IsDefault
                                          }).ToListAsync();
                return userRoleDtos;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<SysUserDto>> CreateOrUpdateUser(CreateOrUpdateUserRequest input)
        {
            if (input.UserDto.Id > 0)
            {
                return await UpdateUser(input);
            }
            else
            {
                return await CreateUser(input);
            }

        }

        private async Task<CommonResultDto<SysUserDto>> UpdateUser(CreateOrUpdateUserRequest input)
        {
            try
            {
                var inputUserDto = input.UserDto;
                var hasMaUser = await _userRepos.AnyAsync(m => m.UserName == inputUserDto.UserName && m.Id != inputUserDto.Id);
                //var hasMaUser = await CheckMaUser(userDto.Ma, userDto.KhachHangId.Value);
                if (hasMaUser)
                {
                    return new CommonResultDto<SysUserDto>("Đã có người dùng với tên đăng nhập: " + inputUserDto.UserName);
                }

                var repos = _factory.Repository<SysUserEntity, long>();
                var userEnt = await repos.GetAsync(inputUserDto.Id.Value);
                _factory.ObjectMapper.Map(inputUserDto, userEnt);
                await repos.UpdateAsync(userEnt);

                //update identity
                var identityUserDto = await _userManager.GetByIdAsync(userEnt.UserId);
                var identityUserUpdateDto = new AbpUserMapUpdateDto
                {
                    ConcurrencyStamp = identityUserDto.ConcurrencyStamp,
                    UserName = userEnt.UserName,
                    Name = userEnt.HoTen,
                    Surname = userEnt.HoTen,
                    Email = string.IsNullOrEmpty(userEnt.Email) ? $"default_support_{Guid.NewGuid()}@ytcs.vn" : userEnt.Email,
                    PhoneNumber = userEnt.SoDienThoai,
                    PasswordHash = !string.IsNullOrWhiteSpace(inputUserDto.MatKhau) ? _passwordHasher.HashPassword(identityUserDto, inputUserDto.MatKhau) : identityUserDto.PasswordHash,
                    //LockoutEnabled = false,
                    LockoutEnabled = identityUserDto.LockoutEnabled,
                };

                _factory.ObjectMapper.Map(identityUserUpdateDto, identityUserDto);
                await _userManager.UpdateAsync(identityUserDto);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                if (input.ListAddSysOrganizationunits?.Count > 0)
                {
                    List<SysOrganizationunitsUser> lstInsert = input.ListAddSysOrganizationunits.Select(x => (
                         new SysOrganizationunitsUser
                         {
                             SysOrganizationunitsId = x.SysOrganizationunitsId,
                             SysUserId = x.SysUserId
                         })
                    ).ToList();
                    await _factory.Repository<SysOrganizationunitsUser, long>().InsertManyAsync(lstInsert);
                }

                if (input.ListRemoveSysOrganizationunits?.Count > 0)
                {
                    foreach (var i in input.ListRemoveSysOrganizationunits)
                    {
                        await _factory.Repository<SysOrganizationunitsUser, long>().DeleteAsync(x => x.SysUserId == i.SysUserId && x.SysOrganizationunitsId == i.SysOrganizationunitsId);
                    }
                }

                var dto = _factory.ObjectMapper.Map<SysUserEntity, SysUserDto>(userEnt);
                dto.Id = inputUserDto.Id.Value;

                var inputGetListCs = new GetListUserCoSoRequest()
                {
                    Id = userEnt.Id

                };
                //update role
                if (input.ArrRoleIds != null)
                {
                    var setRoleReq = new SetRoleForUserRequest()
                    {
                        SysUserId = dto.Id,
                        ListSysRoleId = input.ArrRoleIds
                    };
                    await SetRoleForUser(setRoleReq);
                }
                //Update Khách Hàng...

                return new CommonResultDto<SysUserDto>(dto);
            }
            catch (Exception ex)
            {
                return new CommonResultDto<SysUserDto>(ex.Message ?? "Lỗi xử lý!! ");
            }

        }

        private async Task<CommonResultDto<SysUserDto>> CreateUser(CreateOrUpdateUserRequest input)
        {
            try
            {
                var userExtensionRepos = _factory.Repository<SysUserEntity, long>();
                var userDto = input.UserDto;
                var hasMaUser = await _userRepos.AnyAsync(m => m.UserName == userDto.UserName && m.Id != userDto.Id);
                //var hasMaUser = await CheckMaUser(userDto.Ma, userDto.KhachHangId.Value);
                if (hasMaUser)
                {
                    return new CommonResultDto<SysUserDto>("Đã có người dùng với tên đăng nhập: " + userDto.UserName);
                }
                var identityUser = new IdentityUser(new Guid(), userDto.UserName, string.IsNullOrEmpty(userDto.Email) ? $"default_support_{Guid.NewGuid()}@ytcs.vn" : userDto.Email);
                var identityUserCreateDto = new AbpUserMapCreateDto()
                {
                    UserName = userDto.UserName,
                    Name = userDto.HoTen?.Length > 64 ? userDto.HoTen.Substring(0, 64) : userDto.HoTen,
                    Surname = userDto.SurName?.Length > 64 ? userDto.SurName.Substring(0, 64) : userDto.SurName,
                    Email = string.IsNullOrEmpty(userDto.Email) ? $"default_support_{Guid.NewGuid()}@ytcs.vn" : userDto.Email,
                    PhoneNumber = userDto.SoDienThoai,
                    LockoutEnabled = false,
                    Password = userDto.MatKhau,
                    PasswordHash = _passwordHasher.HashPassword(identityUser, userDto.MatKhau)
                };



                identityUser = _factory.ObjectMapper.Map<AbpUserMapCreateDto, IdentityUser>(identityUserCreateDto);
                //var user = await _userAppService.CreateAsync(identityUserCreateDto);
                var user = await _userManager.CreateAsync(identityUser);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();
                if (user.Succeeded == true)
                {
                    var sysUserEnt = _factory.ObjectMapper.Map<CreateOrUpdateSysUserDto, SysUserEntity>(userDto);
                    sysUserEnt.UserId = identityUser.Id;
                    var sysUser = await userExtensionRepos.InsertAsync(sysUserEnt, true);
                    if (input.ListAddSysOrganizationunits?.Count > 0)
                    {
                        List<SysOrganizationunitsUser> lstInsert = input.ListAddSysOrganizationunits.Select(x => (
                             new SysOrganizationunitsUser
                             {
                                 SysOrganizationunitsId = x.SysOrganizationunitsId,
                                 SysUserId = sysUser.Id
                             })
                        ).ToList();
                        await _factory.Repository<SysOrganizationunitsUser, long>().InsertManyAsync(lstInsert);
                    }

                    await _factory.CurrentUnitOfWork.SaveChangesAsync();
                    var ret = _factory.ObjectMapper.Map<SysUserEntity, SysUserDto>(sysUserEnt);
                    ret.Id = sysUserEnt.Id;
                    ret.HoTenKhongDau = ret.HoTen.ConvertToFts();

                    var reqListCS = new GetListUserCoSoRequest()
                    {
                        Id = sysUserEnt.Id
                    };
                    var getItemAsList = await GetList(reqListCS);

                    //create role
                    if (input.ArrRoleIds != null)
                    {
                        var setRoleReq = new SetRoleForUserRequest()
                        {
                            SysUserId = ret.Id,
                            ListSysRoleId = input.ArrRoleIds
                        };
                        await SetRoleForUser(setRoleReq);
                    }

                    return new CommonResultDto<SysUserDto>(getItemAsList?.Items.FirstOrDefault() ?? ret);
                }


                return new CommonResultDto<SysUserDto>();
            }
            catch (Exception ex)
            {
                return new CommonResultDto<SysUserDto>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }

        [HttpPost(Utilities.ApiUrlBase + "TaoNhanhTaiKhoan")]
        public async Task<CommonResultDto<bool>> TaoNhanhTaiKhoan(CreateOrUpdateSysUserDto input)
        {
            try
            {
                var userExtensionRepos = _factory.Repository<SysUserEntity, long>();
                var userDto = input;

                var hasMaUser = await _userRepos.AnyAsync(m => m.UserName == userDto.UserName && m.Id != userDto.Id);
                if (hasMaUser)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Đã có người dùng trùng với tên đăng nhập: " + userDto.UserName
                    };
                }
                var hasEmailUser = await _userRepos.AnyAsync(m => m.Email == userDto.Email && m.Id != userDto.Id);
                if (hasEmailUser)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Đã có người dùng trùng với Email: " + userDto.Email
                    };
                }
                var identityUser = new IdentityUser(new Guid(), userDto.UserName, string.IsNullOrEmpty(userDto.Email) ? $"default_support_{Guid.NewGuid()}@ytcs.vn" : userDto.Email);
                var identityUserCreateDto = new AbpUserMapCreateDto()
                {
                    UserName = userDto.UserName,
                    Name = userDto.HoTen.Length > 64 ? userDto.HoTen.Substring(0, 64) : userDto.HoTen,
                    Surname = userDto.HoTen.Length > 64 ? userDto.HoTen.Substring(0, 64) : userDto.HoTen,
                    Email = string.IsNullOrEmpty(userDto.Email) ? $"default_support_{Guid.NewGuid()}@ytcs.vn" : userDto.Email,
                    PhoneNumber = userDto.SoDienThoai,
                    LockoutEnabled = false,
                    Password = userDto.MatKhau,
                    PasswordHash = _passwordHasher.HashPassword(identityUser, "123456ad")
                };

                identityUser = _factory.ObjectMapper.Map<AbpUserMapCreateDto, IdentityUser>(identityUserCreateDto);
                var user = await _userManager.CreateAsync(identityUser);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                if (user.Succeeded == true)
                {
                    userDto.Id = 0;
                    var sysUserEnt = _factory.ObjectMapper.Map<CreateOrUpdateSysUserDto, SysUserEntity>(userDto);
                    sysUserEnt.UserId = identityUser.Id;
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();
                    var ret = _factory.ObjectMapper.Map<SysUserEntity, SysUserDto>(sysUserEnt);
                    ret.Id = sysUserEnt.Id;
                    ret.HoTenKhongDau = ret.HoTen.ConvertToFts();

                    var reqListCS = new GetListUserCoSoRequest()
                    {
                        Id = sysUserEnt.Id
                    };
                    var getItemAsList = await GetList(reqListCS);
                    var ArrRoleIds = new List<long>();
                    ArrRoleIds = await _roleRepos
                        .Where(x => x.IsDefault == true)
                        .Select(x => x.Id).ToListAsync();
                    var newSysUser = await userExtensionRepos.InsertAsync(sysUserEnt);
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();

                    //create role
                    if (ArrRoleIds != null && ArrRoleIds.Count() > 0)
                    {
                        var setRoleReq = new SetRoleForUserRequest()
                        {
                            SysUserId = newSysUser.Id,
                            ListSysRoleId = ArrRoleIds
                        };
                        await SetRoleForUser(setRoleReq);
                    }

                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = true
                    };
                }
                else
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Tên tài khoản hoặc Email đã tồn tại ! "
                    };
                }


            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = ex.Message ?? "Lỗi xử lý !! "
                };
            }

        }

        private async Task<CommonResultDto<bool>> SendEmailTaiKhoanHocVien(CreateOrUpdateSysUserDto user)
        {
            try
            {
                var urlImage = "https://eqa.ump.edu.vn/assets/logo/logo-col.png";
                var urlLogin = _factory.AppSettingConfiguration.GetSection("AuthServer").GetSection("UrlAdmin").Value;
                var emailBody = await _templateRenderer.RenderAsync(TemplateName.GuiTaiKhoanQuaEmail,
                      new
                      {
                          ten = user.HoTen,
                          tendangnhap = user.UserName,
                          logo = urlImage,
                          matkhau = user.MatKhau,
                          urllogin = "https://eqa.ump.edu.vn/"
                      });

                var mail = new MailMessage(new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName), new MailAddress(user.Email));
                mail.Subject = "Trung tâm kiểm chuẩn chất lượng xét nghiệm Y học - Đại học Y Dược thành phố Hồ Chí Minh";
                mail.Body = emailBody;
                mail.IsBodyHtml = true;
                await _emailSender.SendAsync(mail);

                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>(ex.Message);
            }
        }

        [HttpPost(Utilities.ApiUrlBase + "TaoNhanhMultiTaiKhoan")]
        public async Task<CommonResultDto<bool>> TaoNhanhMultiTaiKhoan(CreateMultiUserRequest input)
        {
            try
            {
                if (input.ArrUserDto != null && input.ArrUserDto.Count > 0)
                {
                    foreach (var item in input.ArrUserDto)
                    {
                        await TaoNhanhTaiKhoan(item);
                    }
                }
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = ex.Message ?? "Lỗi xử lý !! "
                };
            }

        }

        public async Task<int> SetRoleForUser(SetRoleForUserRequest request)
        {
            try
            {
                var userExt = await _factory.Repository<SysUserEntity, long>().GetAsync(request.SysUserId);

                var lstRoleUser = request.ListSysRoleId.Select(x => new SysUserRoleEntity()
                {
                    SysRoleId = x,
                    SysUserId = request.SysUserId
                });

                var sysUserRoleRepos = _factory.Repository<SysUserRoleEntity, long>();
                await sysUserRoleRepos.DeleteAsync(x => x.SysUserId == request.SysUserId);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();
                await _bulkInsert.SysUserRole(lstRoleUser);

                var lstRoleName = await GetRoleNames(request.ListSysRoleId) ?? new List<string>();
                IdentityUserUpdateRolesDto identityUserUpdateRolesDto =
                    new IdentityUserUpdateRolesDto { RoleNames = lstRoleName.ToArray() };
                var identityUserDto = await _userManager.GetByIdAsync(userExt.UserId);
                await _userManager.SetRolesAsync(identityUserDto, lstRoleName);
                return request.ListSysRoleId?.Count ?? 0;
            }
            catch (Exception ex)
            {
                return -1;
            }
        }

        private async Task<IEnumerable<string>> GetRoleNames(List<long> listSysRoleId)
        {
            var _yTeCoSoConnection = _factory.TravelTicketDbFactory.Connection;
            if (listSysRoleId?.Any() != true)
            {
                return new List<string>();
            }
            var lstAbpId = await _yTeCoSoConnection.QueryAsync<Guid>(
                $@"SELECT RoleId from SysRole WHERE Id in @ListId",
                new
                {
                    ListId = listSysRoleId
                });
            if (lstAbpId?.Any() != true)
            {
                return new List<string>();
            }
            return await _factory.DefaultDbFactory.Connection.QueryAsync<string>(
                    $@"SELECT Name from AbpRoles WHERE Id in @LstAbpId",
                    new
                    {
                        LstAbpId = lstAbpId
                    }

                );
        }
        #endregion


        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> DoiMatKhau(DoiMatKhauRequest input)
        {
            try
            {
                var abpUser = await _userManager.GetByIdAsync(input.UserId.Value);
                var checkPassword = await _userManager.CheckPasswordAsync(abpUser, input.CurrentPassword);
                if (!checkPassword)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Mật khẩu hiện tại không chính xác!!"
                    };
                }
                else
                {
                    //Cập nhật mật khẩu AbpUsers
                    var abpUserUpdate = new AbpUserMapUpdateDto
                    {
                        ConcurrencyStamp = abpUser.ConcurrencyStamp,
                        UserName = abpUser.UserName,
                        Name = abpUser.Name,
                        Surname = abpUser.Name,
                        Email = abpUser.Email,
                        PhoneNumber = abpUser.PhoneNumber,
                        PasswordHash = !string.IsNullOrWhiteSpace(input.NewPassword) ? _passwordHasher.HashPassword(abpUser, input.NewPassword) : abpUser.PasswordHash,
                        LockoutEnabled = abpUser.LockoutEnabled,
                    };
                    _factory.ObjectMapper.Map(abpUserUpdate, abpUser);
                    await _userManager.UpdateAsync(abpUser);
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();
                    return new CommonResultDto<bool>(true);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<RoleAbleDto>> GetDanhSachRole()
        {
            var query = from r in _factory.Repository<SysRoleEntity, long>().AsNoTracking()
                        select new RoleAbleDto()
                        {
                            SysRoleId = r.Id,
                            Ten = r.Ten,
                            Ma = r.Ma,
                        };
            return await query.ToListAsync();
        }

        #region Lock
        public async Task<Guid> LockUser(LockUserRequest request)
        {
            if (request.IsLock)
            {
                await LockUser(request.UserId);
                return request.UserId;
            }
            await UnLockUser(request.UserId);
            return request.UserId;
        }

        private async Task LockUser(Guid id)
        {
            var sql = $@"UPDATE AbpUsers SET LockoutEnabled = @LockoutEnabled, LockoutEnd = @LockoutEnd WHERE Id = @Id";
            await _factory.DefaultDbFactory.Connection.ExecuteAsync(sql,
                new
                {
                    LockoutEnabled = true,
                    LockoutEnd = DateTime.Now.AddYears(100),
                    Id = id
                });
        }
        private async Task UnLockUser(Guid id)
        {
            var sql = $@"UPDATE AbpUsers SET LockoutEnabled = @LockoutEnabled, LockoutEnd = null WHERE Id = @Id";
            await _factory.DefaultDbFactory.Connection.ExecuteAsync(sql,
                new
                {
                    Id = id,
                    LockoutEnabled = false
                });
        }
        #endregion

        #region Xóa tài khoản
        public async Task<CommonResultDto<Guid>> XoaTaiKhoan(Guid id)
        {
            var userExtensionRepos = _factory.Repository<SysUserEntity, long>();
            var sysUserEnt =
                await userExtensionRepos.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == id);
            if (sysUserEnt == null)
            {
                return new CommonResultDto<Guid>("Tài khoản không tồn tại");
            }

            //if (sysUserEnt.CreatorId != _factory.CurrentUser.Id)
            //{
            //    return new CommonResultDto<Guid>("Không có quyền xóa tài khoản này");
            //}
            if (sysUserEnt.UserId == _factory.CurrentUser.Id)
            {
                return new CommonResultDto<Guid>("Không có quyền xóa tài khoản này");
            }

            await XoaUserAbp(id);
            await userExtensionRepos.DeleteAsync(x => x.Id == sysUserEnt.Id);

            await _factory.Repository<SysUserRoleEntity, long>().DeleteAsync(x => x.SysUserId == sysUserEnt.Id);
            return new CommonResultDto<Guid>(id);
        }

        private async Task XoaUserAbp(Guid userId)
        {
            var db = _factory.DefaultDbFactory;
            using var trans = db.DbTransaction;
            try
            {
                await db.Connection.ExecuteAsync($@"UPDATE AbpUsers SET IsDeleted = 1,
                    DeleterId = @DeleterId,
                    DeletionTime = @DeletionTime 
                    WHERE Id = @Id",
                new
                {
                    Id = userId,
                    DeleterId = _factory.CurrentUser.Id,
                    DeletionTime = DateTime.Now
                }, transaction: trans);
                trans.Commit();
            }
            catch
            {
                trans.Rollback();
            }

        }
        #endregion

        #region "Lấy thông tin User và các permission"
        [HttpGet]
        public async Task<SysUserPermissionDto> UserPermission()
        {
            var result = new SysUserPermissionDto();
            if (_factory.UserSession != null)
            {
                result.PermissionNames = new List<string>();
                var user = _userRepos.FirstOrDefault(x => x.UserId == _factory.UserSession.UserId);
                if (user != null)
                {
                    result.UserId = user.UserId;
                    result.SysUserId = user.Id;
                    result.KhachHangId = user.KhachHangId;
                    result.UserName = user.UserName;
                    result.Email = user.Email;
                    result.PhoneNumber = user.SoDienThoai;
                    result.SurName = user.HoTen;
                    result.Avatar = user.Avatar;
                    var listRoles = (from tb in _userRoleRepos.Where(x => x.SysUserId == user.Id)
                                     join tb_role in _roleRepos on tb.SysRoleId equals tb_role.Id into tb_role
                                     from role in tb_role.DefaultIfEmpty()
                                     select new
                                     {
                                         Ma = role.Ma,
                                         Ten = role.Ten
                                     }
                                     ).ToList();
                    if (listRoles.Where(x => x.Ma.ToLower() == "trungtam").Count() > 0 || listRoles.Where(x => x.Ma.ToLower() == "admin").Count() > 0)
                    {
                        result.RoleMobile = "ADMIN";
                    }
                    else
                    {
                        result.RoleMobile = "";
                    }
                    var listRole = _userRoleRepos.Where(x => x.SysUserId == user.Id);
                    foreach (var role in listRole)
                    {
                        var sysRole = await _roleRepos.GetAsync(role.SysRoleId);
                        var abpRoleId = sysRole.RoleId;
                        var roleName = await GetRoleName(abpRoleId);
                        List<string> permission = (await _factory.DefaultDbFactory.Connection.QueryAsync<string>(
                            $@"SELECT Name FROM AbpPermissionGrants WHERE ProviderName ='R' and ProviderKey = '{roleName}'"
                            )).ToList();
                        permission.ForEach(item =>
                        {
                            if (result.PermissionNames.Where(x => x == item).Count() == 0 && (item.IndexOf("NgoaiKiem.") > -1 || item.IndexOf("HoTro.") > -1))
                                result.PermissionNames.Add(item);
                        });
                    }
                }
            }


            return result;
        }
        private Task<string> GetRoleName(Guid roleAbpId)
        {
            return _factory.DefaultDbFactory.Connection.QueryFirstAsync<string>(
                $@"SELECT Name from AbpRoles WHERE id = @Id", new
                {
                    Id = roleAbpId
                });
        }
        #endregion

        #region "Cập nhật thông tin người dùng"

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> UserUpdateInfo(UserUpdateInfoRequest input)
        {
            if (_factory.UserSession != null)
            {
                //Cập nhật SysUser
                var sysUser = await _factory.Repository<SysUserEntity, long>().GetAsync(_factory.UserSession.SysUserId);
                if (sysUser.Email.ToLower().Equals(input.Email.ToLower()))
                {
                    sysUser.HoTen = input.HoTen;
                    sysUser.Email = input.Email;
                    sysUser.SoDienThoai = input.SoDienThoai;
                    await _factory.Repository<SysUserEntity, long>().UpdateAsync(sysUser);

                    //Cập nhật AbpUsers
                    var abpUser = await _userManager.GetByIdAsync(sysUser.UserId);
                    var abpUserUpdate = new AbpUserMapUpdateDto
                    {
                        ConcurrencyStamp = abpUser.ConcurrencyStamp,
                        UserName = sysUser.UserName,
                        Name = sysUser.HoTen,
                        Surname = sysUser.HoTen,
                        Email = sysUser.Email,
                        PhoneNumber = sysUser.SoDienThoai,
                        //PasswordHash = !string.IsNullOrWhiteSpace(inputUserDto.MatKhau) ? _passwordHasher.HashPassword(identityUserDto, inputUserDto.MatKhau) : identityUserDto.PasswordHash,
                        PasswordHash = abpUser.PasswordHash,
                        LockoutEnabled = abpUser.LockoutEnabled,
                    };
                    _factory.ObjectMapper.Map(abpUserUpdate, abpUser);
                    await _userManager.UpdateAsync(abpUser);
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();

                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    var checkUserEmail = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.Email.ToLower() == input.Email.ToLower());
                    if (checkUserEmail != null)
                    {
                        return new CommonResultDto<bool>("Email này đã tồn tại trong hệ thống. Vui lòng sử dụng email khác !!");
                    }
                    else
                    {
                        sysUser.HoTen = input.HoTen;
                        sysUser.Email = input.Email;
                        sysUser.SoDienThoai = input.SoDienThoai;
                        await _factory.Repository<SysUserEntity, long>().UpdateAsync(sysUser);

                        //Cập nhật AbpUsers
                        var abpUser = await _userManager.GetByIdAsync(sysUser.UserId);
                        var abpUserUpdate = new AbpUserMapUpdateDto
                        {
                            ConcurrencyStamp = abpUser.ConcurrencyStamp,
                            UserName = sysUser.UserName,
                            Name = sysUser.HoTen,
                            Surname = sysUser.HoTen,
                            Email = sysUser.Email,
                            PhoneNumber = sysUser.SoDienThoai,
                            //PasswordHash = !string.IsNullOrWhiteSpace(inputUserDto.MatKhau) ? _passwordHasher.HashPassword(identityUserDto, inputUserDto.MatKhau) : identityUserDto.PasswordHash,
                            PasswordHash = abpUser.PasswordHash,
                            LockoutEnabled = abpUser.LockoutEnabled,
                        };
                        _factory.ObjectMapper.Map(abpUserUpdate, abpUser);
                        await _userManager.UpdateAsync(abpUser);
                        await _factory.CurrentUnitOfWork.SaveChangesAsync();

                        return new CommonResultDto<bool>(true);
                    }
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<UserUpdateInfoRequest>> GetUserInfo(Guid userId)
        {
            var sysUser = _factory.Repository<SysUserEntity, long>().FirstOrDefault(x => x.UserId == userId);
            var output = new UserUpdateInfoRequest();
            if (sysUser != null)
            {
                output.HoTen = sysUser.HoTen;
                output.Email = sysUser.Email;
                output.SoDienThoai = sysUser.SoDienThoai;
                return new CommonResultDto<UserUpdateInfoRequest>
                {
                    IsSuccessful = true,
                    DataResult = output
                };
            }
            return new CommonResultDto<UserUpdateInfoRequest>
            {
                IsSuccessful = false
            };
        }
        #endregion

        #region Tài khoản khách hàng
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> KhachHangSetPassword(KhachHangSetPasswordRequest input)
        {
            if (_factory.UserSession != null)
            {
                var sysUser = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.KhachHangId == input.KhachHangId);
                if (sysUser != null)
                {
                    //Cập nhật mật khẩu AbpUsers
                    var abpUser = await _userManager.GetByIdAsync(sysUser.UserId);
                    var abpUserUpdate = new AbpUserMapUpdateDto
                    {
                        ConcurrencyStamp = abpUser.ConcurrencyStamp,
                        UserName = sysUser.UserName,
                        Name = sysUser.HoTen,
                        Surname = sysUser.HoTen,
                        Email = sysUser.Email,
                        PhoneNumber = sysUser.SoDienThoai,
                        PasswordHash = !string.IsNullOrWhiteSpace(input.Password) ? _passwordHasher.HashPassword(abpUser, input.Password) : abpUser.PasswordHash,
                        LockoutEnabled = abpUser.LockoutEnabled,
                    };
                    _factory.ObjectMapper.Map(abpUserUpdate, abpUser);
                    await _userManager.UpdateAsync(abpUser);
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();

                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Không tồn tại tài khoản của khách hàng !!");
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> KhachHangLockUser(long khachHangId)
        {
            if (_factory.UserSession != null)
            {
                var sysUser = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.KhachHangId == khachHangId);
                if (sysUser != null)
                {
                    var sql = $@"UPDATE AbpUsers SET LockoutEnabled = @LockoutEnabled, LockoutEnd = @LockoutEnd WHERE Id = @Id";
                    await _factory.DefaultDbFactory.Connection.ExecuteAsync(sql,
                        new
                        {
                            LockoutEnabled = true,
                            LockoutEnd = DateTime.Now.AddYears(100),
                            Id = sysUser.UserId
                        });
                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Không tồn tại tài khoản của khách hàng !!");
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }
        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> KhachHangUnLockUser(long khachHangId)
        {
            if (_factory.UserSession != null)
            {
                var sysUser = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.KhachHangId == khachHangId);
                if (sysUser != null)
                {
                    var sql = $@"UPDATE AbpUsers SET LockoutEnabled = @LockoutEnabled, LockoutEnd = null WHERE Id = @Id";
                    await _factory.DefaultDbFactory.Connection.ExecuteAsync(sql,
                        new
                        {
                            Id = sysUser.UserId,
                            LockoutEnabled = false
                        });
                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Không tồn tại tài khoản của khách hàng !!");
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> KhoaPhongSetPassword(KhoaPhongSetPasswordRequest input)
        {
            if (_factory.UserSession != null)
            {

                var sysUser = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.Id == input.SysUserId);
                if (sysUser != null)
                {
                    //Cập nhật mật khẩu AbpUsers
                    var abpUser = await _userManager.GetByIdAsync(sysUser.UserId);
                    var abpUserUpdate = new AbpUserMapUpdateDto
                    {
                        ConcurrencyStamp = abpUser.ConcurrencyStamp,
                        UserName = sysUser.UserName,
                        Name = sysUser.HoTen,
                        Surname = sysUser.HoTen,
                        Email = sysUser.Email,
                        PhoneNumber = sysUser.SoDienThoai,
                        PasswordHash = !string.IsNullOrWhiteSpace(input.Password) ? _passwordHasher.HashPassword(abpUser, input.Password) : abpUser.PasswordHash,
                        LockoutEnabled = abpUser.LockoutEnabled,
                    };
                    _factory.ObjectMapper.Map(abpUserUpdate, abpUser);
                    await _userManager.UpdateAsync(abpUser);
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();

                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Không tồn tại tài khoản của khách hàng !!");
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }
        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> KhoaPhongLockUser(long sysUserId)
        {
            if (_factory.UserSession != null)
            {
                var sysUser = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.Id == sysUserId);
                if (sysUser != null)
                {
                    var sql = $@"UPDATE AbpUsers SET LockoutEnabled = @LockoutEnabled, LockoutEnd = @LockoutEnd WHERE Id = @Id";
                    await _factory.DefaultDbFactory.Connection.ExecuteAsync(sql,
                        new
                        {
                            LockoutEnabled = true,
                            LockoutEnd = DateTime.Now.AddYears(100),
                            Id = sysUser.UserId
                        });
                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Không tồn tại tài khoản của khách hàng !!");
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }
        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> KhoaPhongUnLockUser(long sysUserId)
        {
            if (_factory.UserSession != null)
            {
                var sysUser = await _factory.Repository<SysUserEntity, long>().FirstOrDefaultAsync(x => x.Id == sysUserId);
                if (sysUser != null)
                {
                    var sql = $@"UPDATE AbpUsers SET LockoutEnabled = @LockoutEnabled, LockoutEnd = null WHERE Id = @Id";
                    await _factory.DefaultDbFactory.Connection.ExecuteAsync(sql,
                        new
                        {
                            Id = sysUser.UserId,
                            LockoutEnabled = false
                        });
                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Không tồn tại tài khoản của khách hàng !!");
                }
            }
            else
            {
                return new CommonResultDto<bool>("Tài khoản chưa đăng nhập !!");
            }
        }

        #endregion

        #region "Import user v1"
        [HttpPost(Utilities.ApiUrlBase + "ImportMultiUser")]
        public async Task<CommonResultDto<bool>> ImportMultiUser(ImportMultiUserRequest input)
        {
            try
            {
                if (input.ArrUserDto != null && input.ArrUserDto.Count > 0)
                {
                    var userExtensionRepos = _factory.Repository<SysUserEntity, long>();
                    foreach (var item in input.ArrUserDto)
                    {
                        if (item.IsDeleted == false)
                        {
                            var userDto = item;
                            var hasMaUser = await _userRepos.AnyAsync(m => m.UserName == userDto.UserName);
                            //if (hasMaUser)
                            //{
                            //    return new CommonResultDto<bool>("Đã có người dùng trùng với tên đăng nhập: " + userDto.UserName);
                            //}
                            var hasEmailUser = await _userRepos.AnyAsync(m => m.Email == userDto.Email);
                            //if (hasEmailUser)
                            //{
                            //    return new CommonResultDto<bool>("Đã có người dùng trùng với Email: " + userDto.Email);
                            //}
                            if (hasMaUser == false && hasEmailUser == false)
                            {
                                var identityUser = new IdentityUser(new Guid(), userDto.UserName, userDto.Email);
                                var identityUserCreateDto = new AbpUserMapCreateDto()
                                {
                                    UserName = userDto.UserName,
                                    Name = userDto.HoTen?.Length > 64 ? userDto.HoTen.Substring(0, 64) : userDto.HoTen,
                                    Surname = userDto.SurName?.Length > 64 ? userDto.SurName.Substring(0, 64) : userDto.SurName,
                                    Email = userDto.Email,
                                    PhoneNumber = userDto.SoDienThoai,
                                    LockoutEnabled = false,
                                    Password = userDto.MatKhau,
                                    PasswordHash = _passwordHasher.HashPassword(identityUser, userDto.MatKhau)
                                };

                                identityUser = _factory.ObjectMapper.Map<AbpUserMapCreateDto, IdentityUser>(identityUserCreateDto);
                                var user = await _userManager.CreateAsync(identityUser);
                                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                                if (user.Succeeded == true)
                                {
                                    userDto.Id = 0;
                                    var sysUserEnt = _factory.ObjectMapper.Map<ImportUserDto, SysUserEntity>(userDto);
                                    sysUserEnt.UserId = identityUser.Id;
                                    var userInsert = await userExtensionRepos.InsertAsync(sysUserEnt, true);
                                    //await _factory.CurrentUnitOfWork.SaveChangesAsync();
                                    //create role
                                    var ArrRoleIds = new List<long>();
                                    if (userDto.ListRole != null && userDto.ListRole.Length > 0)
                                    {
                                        //Replace xử lý role V1
                                        if (userDto.ListRole.IndexOf("5") > -1)
                                        {
                                            userDto.ListRole = userDto.ListRole.Replace("5", "2");
                                        }
                                        else if (userDto.ListRole.IndexOf("7") > -1)
                                        {
                                            userDto.ListRole = userDto.ListRole.Replace("7", "3");
                                        }
                                        else if (userDto.ListRole.IndexOf("8") > -1)
                                        {
                                            userDto.ListRole = userDto.ListRole.Replace("8", "4");
                                        }
                                        else if (userDto.ListRole.IndexOf("4") > -1)
                                        {
                                            userDto.ListRole = userDto.ListRole.Replace("4", "5");
                                        }
                                        ArrRoleIds = userDto.ListRole.Split(",").Select(Int64.Parse).ToList();
                                    }
                                    if (ArrRoleIds != null && ArrRoleIds.Count() > 0)
                                    {
                                        var setRoleReq = new SetRoleForUserRequest()
                                        {
                                            SysUserId = userInsert.Id,
                                            ListSysRoleId = ArrRoleIds
                                        };
                                        await SetRoleForUser(setRoleReq);
                                    }
                                }
                                else
                                {
                                    return new CommonResultDto<bool>("Tên tài khoản hoặc Email " + userDto.UserName + " đã tồn tại ! ");
                                }
                            }

                        }
                        else
                        {
                            var userDto = item;
                            var hasMaUser = await _userRepos.AnyAsync(m => m.UserName == userDto.UserName && m.Id != userDto.Id);
                            if (hasMaUser)
                            {
                                return new CommonResultDto<bool>("Đã có người dùng trùng với tên đăng nhập: " + userDto.UserName);
                            }
                            var hasEmailUser = await _userRepos.AnyAsync(m => m.Email == userDto.Email && m.Id != userDto.Id);
                            if (hasEmailUser)
                            {
                                return new CommonResultDto<bool>("Đã có người dùng trùng với Email: " + userDto.Email);
                            }
                            var identityUser = new IdentityUser(new Guid(), userDto.UserName, userDto.Email);
                            var identityUserCreateDto = new AbpUserMapCreateDto()
                            {
                                UserName = userDto.UserName,
                                Name = userDto.HoTen?.Length > 64 ? userDto.HoTen.Substring(0, 64) : userDto.HoTen,
                                Surname = userDto.SurName?.Length > 64 ? userDto.SurName.Substring(0, 64) : userDto.SurName,
                                Email = userDto.Email,
                                PhoneNumber = userDto.SoDienThoai,
                                LockoutEnabled = false,
                                Password = userDto.MatKhau,
                                PasswordHash = _passwordHasher.HashPassword(identityUser, userDto.MatKhau)
                            };

                            identityUser = _factory.ObjectMapper.Map<AbpUserMapCreateDto, IdentityUser>(identityUserCreateDto);
                            var user = await _userManager.CreateAsync(identityUser);
                            await _factory.CurrentUnitOfWork.SaveChangesAsync();

                            if (user.Succeeded == true)
                            {
                                userDto.Id = 0;
                                var sysUserEnt = _factory.ObjectMapper.Map<ImportUserDto, SysUserEntity>(userDto);
                                sysUserEnt.UserId = identityUser.Id;
                                var userInsert = await userExtensionRepos.InsertAsync(sysUserEnt, true);
                                //Xóa user
                                await _userManager.DeleteAsync(identityUser);
                                await userExtensionRepos.DeleteAsync(x => x.Id == userInsert.Id);
                            }
                            else
                            {
                                return new CommonResultDto<bool>("Tên tài khoản hoặc Email đã tồn tại ! ");
                            }
                        }
                    }
                }
                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }

        [HttpPost(Utilities.ApiUrlBase + "SendPasswordMultiUser")]
        public async Task<CommonResultDto<bool>> SendPasswordMultiUser(ImportMultiUserRequest input)
        {
            try
            {
                if (input.ArrUserDto != null && input.ArrUserDto.Count > 0)
                {
                    var userExtensionRepos = _factory.Repository<SysUserEntity, long>();
                    //string urlImage = _factory.AppSettingConfiguration.GetSection("UrlLogoEmail").Value;
                    string urlImage = "https://eqa.ump.edu.vn/assets/logo/logo-col.png";
                    foreach (var item in input.ArrUserDto.Where(x => x.IsDeleted == false))
                    {

                        var emailBody = await _templateRenderer.RenderAsync(
                             TemplateName.SendPassword,
                             new
                             {
                                 ten = item.HoTen,
                                 logo = urlImage,
                                 username = item.UserName,
                                 password = item.MatKhau
                             });
                        await _backgroundJobManager.EnqueueAsync(
                                        new EmailSendingArgs
                                        {
                                            ToEmail = item.Email,
                                            Subject = "Gửi thông tin đăng nhập hệ thống eqa.qcc.edu.vn",
                                            Body = emailBody
                                        }
                                    );
                        //var mail = new MailMessage(new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName), new MailAddress(item.Email));
                        //mail.Subject = "Gửi thông tin đăng nhập hệ thống eqa.qcc.edu.vn";
                        //mail.Body = emailBody;
                        //mail.IsBodyHtml = true;
                        //await _emailSender.SendAsync(mail);
                    }
                }
                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }

        [HttpGet(Utilities.ApiUrlBase + "SendThongBaoHeThong")]
        public async Task<CommonResultDto<bool>> SendThongBaoHeThong()
        {
            //string urlImage = _factory.AppSettingConfiguration.GetSection("UrlLogoEmail").Value;
            string urlImage = "https://eqa.ump.edu.vn/assets/logo/logo-col.png";
            var emailBody = await _templateRenderer.RenderAsync(
                            TemplateName.SendThongBaoHeThong,
                            new
                            {
                                logo = urlImage
                            });
            var mail = new MailMessage(new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName), new MailAddress("dungnt@orenda.vn"));
            //var userList = (from tb in _factory.Repository<SysUserEntity, long>().Where(x => x.KhachHangId>0)
            //                select new
            //                {
            //                    Email = tb.Email
            //                }
            //               );
            //foreach (var item in userList)
            //{
            //    mail.CC.Add(item.Email);
            //}
            mail.CC.Add("nguyentiendung90@gmail.com");
            mail.CC.Add("datht@orenda.vn");
            mail.Subject = "Thông báo cập nhật phần mềm ngoại kiểm mới 2.0";
            mail.Body = emailBody;
            mail.IsBodyHtml = true;
            await _emailSender.SendAsync(mail);
            return new CommonResultDto<bool>(true);
        }
        #endregion

        [HttpGet(Utilities.ApiUrlBase + "VaiTroUserCombobox")]
        public async Task<List<ComboBoxDto>> VaiTroUserCombobox()
        {
            var query = _factory.Repository<SysRoleEntity, long>().AsNoTracking()
                .Select(x => new ComboBoxDto()
                {
                    Value = x.Id.ToString(),
                    DisplayText = $"{x.Ten}",
                });
            return query.ToList();
        }

        #region "Quên mật khẩu"
        #endregion

    }
}
