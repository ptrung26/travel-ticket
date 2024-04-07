using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using newPMS.Dto;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using OrdBaseApplication.Helper;
using RestSharp;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using System.Collections.Generic;
using Volo.Abp.Uow;

namespace newPMS.QuanLyTaiKhoan.Services
{
    public interface IOrganizationunitsAppService : IApplicationService
    {
        //Task<CommonResultDto<SysOrganizationunitsDto>> CreateOrUpdateUser(SysOrganizationunitsDto input);
        //Task<CommonResultDto<bool>> DoiMatKhau(DoiMatKhauRequest input);
        //Task<List<RoleAbleDto>> GetDanhSachRole();

        //#region Lock
        //Task<Guid> LockUser(LockUserRequest request);
        //#endregion

        //Task<int> SetRoleForUser(SetRoleForUserRequest request);
        //Task<CommonResultDto<Guid>> XoaTaiKhoan(XoaTaiKhoanRequest input);
    }
    [Authorize]
    public class OrganizationunitsAppService : QuanLyTaiKhoanAppService, IOrganizationunitsAppService
    {
        private readonly IOrdAppFactory _factory;
        protected IPermissionManager PermissionManager;
        protected IPermissionDefinitionManager PermissionDefinitionManager;
        private readonly IRepository<SysUserEntity, long> _userRepos;
        private readonly IRepository<SysOrganizationunits, long> _phongBanRepository;
        private readonly IRepository<SysOrganizationunitsUser, long> _phongBanUserRepository;
        private readonly IdentityUserManager _userManager;
        private readonly OrganizationUnitManager _organizationUnitManager;


        public OrganizationunitsAppService(
            IOrdAppFactory factory,
             IRepository<SysUserEntity, long> userRepos,
             IRepository<SysOrganizationunits, long> phongBanRepository,
             IRepository<SysOrganizationunitsUser, long> phongBanUserRepository,
             OrganizationUnitManager organizationUnitManager,
             IGuidGenerator guidGenerator,
             IConfiguration configuration,
             IdentityUserManager userManager
            )
        {
            _factory = factory;
            PermissionManager = factory.GetServiceDependency<IPermissionManager>();
            PermissionDefinitionManager = factory.GetServiceDependency<IPermissionDefinitionManager>();
            _userRepos = userRepos;
            _phongBanRepository = phongBanRepository;
            _phongBanUserRepository = phongBanUserRepository;
            _organizationUnitManager = organizationUnitManager;
            _userManager = userManager;
        }

        #region Base
        #region getlist
        [HttpPost(Utilities.ApiUrlBase + "GetDataListOrganizationunits")]
        public async Task<PagedResultDto<SysOrganizationunitsDto>> GetDataListOrganizationunits(PagedRequestOrganizationunitsDto input)
        {
            var query = (from pb in _phongBanRepository.Where(x => x.PId == null)
                         select new SysOrganizationunitsDto
                         {
                             Id = pb.Id,
                             MaPhongBan = pb.MaPhongBan,
                             TenPhongBan = pb.TenPhongBan,
                             OrganizationunitsId = pb.OrganizationunitsId,
                             Level = 1
                         });
            var dataGrids = await query.PageBy(input).ToListAsync();

            if (dataGrids?.Count > 0)
            {
                foreach (var item in dataGrids)
                {
                    GetChildSysOrganizationunits(item);
                }
            }

            return new PagedResultDto<SysOrganizationunitsDto>(dataGrids.Count(), dataGrids);
        }

        private void GetChildSysOrganizationunits(SysOrganizationunitsDto item)
        {
            item.CountUser = _phongBanUserRepository.Where(x => x.SysOrganizationunitsId == item.Id).ToList()?.Count;
            item.ListSysOrganizationunits = (from pb in _phongBanRepository.Where(x => x.PId == item.Id)
                                             select new SysOrganizationunitsDto
                                             {
                                                 Id = pb.Id,
                                                 MaPhongBan = pb.MaPhongBan,
                                                 TenPhongBan = pb.TenPhongBan,
                                                 OrganizationunitsId = pb.OrganizationunitsId,
                                                 Level = item.Level + 1
                                             }).ToList();

            if (item.ListSysOrganizationunits?.Count > 0)
            {
                foreach (var i in item.ListSysOrganizationunits)
                {
                    GetChildSysOrganizationunits(i);
                }
            }
        }

        [HttpGet(Utilities.ApiUrlBase + "GetAllOrganizationunits")]
        public List<ComboBoxDto> GetAllOrganizationunits()
        {
            var query = (from pb in _phongBanRepository
                         select new ComboBoxDto
                         {
                             Value = pb.Id,
                             DisplayText = pb.TenPhongBan,
                         }).ToList();
            return query;
        }

        public async Task<CommonResultDto<SysOrganizationunitsDto>> GetOrganizationunitById(long id)
        {
            var ret = new CommonResultDto<SysOrganizationunitsDto>();
            try
            {
                var dto = new SysOrganizationunitsDto();
                var ent = _phongBanRepository.FirstOrDefault(x => x.Id == id);
                _factory.ObjectMapper.Map(ent, dto);

                ret.IsSuccessful = true;
                ret.DataResult = dto;
            }
            catch (Exception ex)
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra";
            }

            return ret;
        }
        #endregion

        #region CreateOrUpdate
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> CreateOrUpdateOrganizationunits(SysOrganizationunitsDto input)
        {
            if (input.Id > 0)
            {
                return await UpdateOrganizationunits(input);
            }
            else
            {
                return await CreateOrganizationunits(input);
            }
        }
        #endregion

        private async Task<CommonResultDto<bool>> CreateOrganizationunits(SysOrganizationunitsDto input)
        {
            var ret = new CommonResultDto<bool>();
            using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                //Validators
                var isExistMa = _phongBanRepository.Any(x => x.MaPhongBan == input.MaPhongBan);
                if (isExistMa)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = "Mã phòng ban đã tồn tại";
                }

                //Insert Abporganizationunits
                var organizationUnitCreateDto = new OrganizationUnitCreateDto();
                organizationUnitCreateDto.DisplayName = input.TenPhongBan;
                if (input.PId.HasValue)
                {
                    var parent = await _phongBanRepository.GetAsync(input.PId.Value);
                    organizationUnitCreateDto.ParentId = parent.OrganizationunitsId;
                }
                var insertAbporganizationunits = _factory.ObjectMapper.Map<OrganizationUnitCreateDto, OrganizationUnit>(organizationUnitCreateDto);
                await _organizationUnitManager.CreateAsync(insertAbporganizationunits);
                await uow.SaveChangesAsync();

                //Insert SysOrganizationunits
                var sysOrganizationunits = _factory.ObjectMapper.Map<SysOrganizationunitsDto, SysOrganizationunits>(input);
                sysOrganizationunits.OrganizationunitsId = insertAbporganizationunits.Id;
                sysOrganizationunits.TenPhongBanKhongDau = input.TenPhongBan.ConvertToFts();
                await _phongBanRepository.InsertAsync(sysOrganizationunits);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                await uow.CompleteAsync();
                ret.IsSuccessful = true;
            }
            catch(Exception ex)
            {
                await uow.RollbackAsync();
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau";
            };
            return ret;
        }

        private async Task<CommonResultDto<bool>> UpdateOrganizationunits(SysOrganizationunitsDto input)
        {
            var ret = new CommonResultDto<bool>();
            using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                //Validators
                var isExistMa = _phongBanRepository.Any(x => x.MaPhongBan == input.MaPhongBan && x.Id != input.Id);
                if (isExistMa)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = "Mã phòng ban đã tồn tại";
                }

                //Update SysOrganizationunits
                var sysOrganizationunits = await _phongBanRepository.GetAsync(input.Id);
                _factory.ObjectMapper.Map(input, sysOrganizationunits);
                await _phongBanRepository.UpdateAsync(sysOrganizationunits);

                //Update Abporganizationunits
                await UpdateAbporganizationunits(input);

                await uow.CompleteAsync();
                ret.IsSuccessful = true;
            }
            catch
            {
                await uow.RollbackAsync();
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau";
            }
            return ret;
        }

        private async Task<CommonResultDto<bool>> UpdateAbporganizationunits(SysOrganizationunitsDto input)
        {
            var ret = new CommonResultDto<bool>();
            var _identityDb = _factory.DefaultDbFactory;
            using var trans = _identityDb.DbTransaction;
            try
            {
                if (input.PId.HasValue)
                {
                    var parent = await _phongBanRepository.GetAsync(input.PId.Value);
                    var pId = parent.OrganizationunitsId;
                    await _identityDb.Connection.ExecuteAsync($@"UPDATE abporganizationunits SET 
                    DisplayName = @DisplayName,
                    ParentId = @ParentId
                    WHERE Id = @Id",
                   new
                   {
                       DisplayName = input.TenPhongBan,
                       ParentId = pId,
                       Id = input.OrganizationunitsId
                   }, transaction: trans);

                    trans.Commit();
                }
                else
                {
                    await _identityDb.Connection.ExecuteAsync($@"UPDATE abporganizationunits SET 
                    DisplayName = @DisplayName
                    WHERE Id = @Id",
                     new
                     {
                         DisplayName = input.TenPhongBan,
                         Id = input.OrganizationunitsId
                     }, transaction: trans);

                    trans.Commit();
                }
                ret.IsSuccessful = true;
            }
            catch
            {
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau";
            }

            return ret;
        }
        #endregion

        #region oldCode
        [HttpPost]
        public async Task<PagedResultDto<SysOrganizationunitsDto>> GetList(PagedRequestOrganizationunitsDto input)
        {
            try
            {
                var _yTeCoSoConnection = _factory.TravelTicketDbFactory.Connection;
                var prm = new
                {
                    TextSearch = input.Filter.LikeTextSearch(),
                    OrganizationunitsId = input.OrganizationunitsId
                };
                var tskItems = _yTeCoSoConnection.QueryAsync<SysOrganizationunitsDto>(GetQuerySql(input, true), prm);
                var tskTotal = _yTeCoSoConnection.QueryFirstOrDefaultAsync<int>(GetQuerySql(input, false), prm);
                await Task.WhenAll(tskTotal, tskItems);
                var ret = new PagedResultDto<SysOrganizationunitsDto>()
                {
                    Items = tskItems.Result.ToList(),
                    TotalCount = tskTotal.Result
                };

                return ret;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private string GetQuerySql(PagedRequestOrganizationunitsDto input, bool isItems = true)
        {
            var select = new StringBuilder(isItems == false ? "1" :
               $@" u.*, (select COUNT(SysUserId) from sysorganizationunitsuser where IsDeleted = 0 and SysOrganizationunitsId = u.id ) as countUser");
            var sql = new StringBuilder(@$"
            SELECT {select} 
            FROM SysOrganizationunits u
            WHERE u.IsDeleted = 0
            ");
            if (input.OrganizationunitsId.HasValue)
            {
                sql.Append(" and u.Id = @OrganizationunitsId");
            }
            if (!string.IsNullOrEmpty(input.Filter))
            {
                sql.Append(" and (u.MaPhongBan like @TextSearch or u.TenPhongBan like @TextSearch or u.Email like @TextSearch or u.SoDienThoai like @TextSearch)");
            }

            //sql.Append(" ORDER BY u.Level ");

            if (isItems)
            {
                return $@"{sql} LIMIT {input.SkipCount},{input.MaxResultCount} ";
            }
            else
            {
                return $@"SELECT COUNT(1) from ({sql}) A";
            }

        }

       

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<SysOrganizationunitsDto>> CreateOrUpdate(SysOrganizationunitsDto input)
        {
            if (input.Id > 0)
            {
                return await UpdateUser(input);
            }
            else
            {
                return await CreateUser(input);
            }

        }

        private async Task<CommonResultDto<SysOrganizationunitsDto>> UpdateUser(SysOrganizationunitsDto input)
        {
            var _identityDb = _factory.DefaultDbFactory;
            using var trans = _identityDb.DbTransaction;
            try
            {
                var hasMa = await _phongBanRepository.AnyAsync(m => m.MaPhongBan == input.MaPhongBan && m.Id != input.Id);
                if (hasMa)
                {
                    return new CommonResultDto<SysOrganizationunitsDto>("Mã phòng ban: '" + input.MaPhongBan + "' đã tồn tại !");
                }

                var OrganEnt = await _phongBanRepository.GetAsync(input.Id);
                if (OrganEnt.CreatorId.HasValue)
                {
                    input.CreatorId = OrganEnt.CreatorId.Value;
                }
                _factory.ObjectMapper.Map(input, OrganEnt);
                await _phongBanRepository.UpdateAsync(OrganEnt);
                //update identity
                Guid? PId = new Guid();
                if (input.PId.HasValue)
                {
                    var getPbParent = await _phongBanRepository.GetAsync(input.PId.Value);
                    PId = getPbParent.OrganizationunitsId;
                    await _identityDb.Connection.ExecuteAsync($@"UPDATE abporganizationunits SET 
                    DisplayName = @DisplayName,
                    ParentId = @ParentId
                    WHERE Id = @Id",
                   new
                   {
                       DisplayName = input.TenPhongBan,
                       ParentId = PId,
                       Id = OrganEnt.OrganizationunitsId
                   }, transaction: trans);

                    trans.Commit();
                }
                else
                {
                    await _identityDb.Connection.ExecuteAsync($@"UPDATE abporganizationunits SET 
                    DisplayName = @DisplayName
                    WHERE Id = @Id",
                     new
                     {
                         DisplayName = input.TenPhongBan,
                         Id = OrganEnt.OrganizationunitsId
                     }, transaction: trans);

                    trans.Commit();
                }


                //var tskItems = await _identityConnection.QueryAsync<AbpOrganizationUnitDto>(
                //    $@" SELECT * from abporganizationunits  WHERE Id = @Id",
                //new
                //{
                //    Id = OrganEnt.OrganizationunitsId,
                //});
                //var getIndenity = tskItems.FirstOrDefault();
                //getIndenity.DisplayName = input.TenPhongBan;
                //if (input.PId.HasValue)
                //{
                //    var getPbParent = await _phongBanRepository.GetAsync(input.PId.Value);
                //    getIndenity.ParentId = getPbParent.OrganizationunitsId;
                //}
                //var identityAbpOrgan = _factory.ObjectMapper.Map<AbpOrganizationUnitDto, OrganizationUnit>(getIndenity);
                //await _organizationUnitManager.UpdateAsync(identityAbpOrgan);
                //await _factory.CurrentUnitOfWork.SaveChangesAsync();

                return new CommonResultDto<SysOrganizationunitsDto>(input);
            }
            catch (Exception ex)
            {
                trans.Rollback();
                return new CommonResultDto<SysOrganizationunitsDto>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }

        private async Task<CommonResultDto<SysOrganizationunitsDto>> CreateUser(SysOrganizationunitsDto input)
        {
            try
            {
                var hasMa = await _phongBanRepository.AnyAsync(m => m.MaPhongBan == input.MaPhongBan && m.Id != input.Id);
                //var hasMaUser = await CheckMaUser(userDto.Ma, userDto.KhachHangId.Value);
                if (hasMa)
                {
                    return new CommonResultDto<SysOrganizationunitsDto>("Mã phòng ban: '" + input.MaPhongBan + "' đã tồn tại !");
                }

                var identityDto = new OrganizationUnitCreateDto()
                {
                    DisplayName = input.TenPhongBan
                };
                if (input.PId.HasValue)
                {
                    var getPbParent = await _phongBanRepository.GetAsync(input.PId.Value);
                    identityDto.ParentId = getPbParent.OrganizationunitsId;
                }
                var identityAbpOrgan = _factory.ObjectMapper.Map<OrganizationUnitCreateDto, OrganizationUnit>(identityDto);
                await _organizationUnitManager.CreateAsync(identityAbpOrgan);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();

                var sysOrganEnt = _factory.ObjectMapper.Map<SysOrganizationunitsDto, SysOrganizationunits>(input);
                sysOrganEnt.OrganizationunitsId = identityAbpOrgan.Id;
                await _phongBanRepository.InsertAsync(sysOrganEnt);
                await _factory.CurrentUnitOfWork.SaveChangesAsync();
                var ret = _factory.ObjectMapper.Map<SysOrganizationunits, SysOrganizationunitsDto>(sysOrganEnt);
                ret.Id = sysOrganEnt.Id;
                ret.TenPhongBanKhongDau = ret.TenPhongBan.ConvertToFts();

                return new CommonResultDto<SysOrganizationunitsDto>(ret);
            }
            catch (Exception ex)

            {
                return new CommonResultDto<SysOrganizationunitsDto>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }
        #endregion

        #region Xóa phòng ban
        public async Task<CommonResultDto<bool>> XoaPhongBan(long id)
        {
            var ret = new CommonResultDto<bool>();
            ret.IsSuccessful = true;

            using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                var sysEnt = await _phongBanRepository.FirstOrDefaultAsync(x => x.Id == id);
                if (sysEnt == null)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = "Phòng ban không tồn tại";
                    return ret;
                }
                if (sysEnt.CreatorId != _factory.CurrentUser.Id)
                {
                    ret.IsSuccessful = false;
                    ret.ErrorMessage = "Không có quyền xóa phòng ban này";
                    return ret;
                }

                var getChild = _phongBanRepository.Where(x => x.PId == sysEnt.Id).ToList();
                var guidIdListChild = getChild.Select(x => x.OrganizationunitsId).ToList();
                guidIdListChild.Add(sysEnt.OrganizationunitsId);
                if (guidIdListChild?.Count > 0)
                {
                    foreach (var g in guidIdListChild)
                    {
                        await XoaOrganizationunitAbp(g);
                    }
                }

                var idListChild = getChild.Select(x => x.Id).ToList();
                idListChild.Add(sysEnt.Id);
                await _phongBanRepository.DeleteAsync(x => idListChild.Contains(x.Id));
                await _phongBanUserRepository.DeleteAsync(x => idListChild.Contains(x.SysOrganizationunitsId));
                
                await uow.CompleteAsync();
            }
            catch(Exception ex)
            {
                await uow.RollbackAsync();
                ret.IsSuccessful = false;
                ret.ErrorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau";
            }

            return ret;
        }

        private async Task XoaOrganizationunitAbp(Guid OrganizationUnitId)
        {
            var db = _factory.DefaultDbFactory;
            //xóa phòng ban abp
            await db.Connection.ExecuteAsync($@"UPDATE abporganizationunits SET IsDeleted = 1,
                    DeleterId = @DeleterId,
                    DeletionTime = @DeletionTime 
                    WHERE Id = @Id",
            new
            {
                Id = OrganizationUnitId,
                DeleterId = _factory.CurrentUser.Id,
                DeletionTime = DateTime.Now
            });
            //xóa phòng ban user abp
            await db.Connection.ExecuteAsync($@"DELETE FROM abpuserorganizationunits 
                    WHERE OrganizationUnitId = @Id",
           new
           {
               Id = OrganizationUnitId
           });
        }
        #endregion

        #region Nhân viên - phòng ban
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<PagedResultDto<SysOrganizationunitsUserDto>> GetListNhanVienByPhongBanId(PagedRequestOrganizationunitsDto input)
        {
            try
            {
                var _identityConnection = _factory.TravelTicketDbFactory.Connection;
                var prm = new
                {
                    OrganizationunitsId = input.OrganizationunitsId,
                    TextSearch = input.Filter.LikeTextSearch()
                };
                var tskItems = _identityConnection.QueryAsync<SysOrganizationunitsUserDto>(GetQuerySqlNhanVienByPhongBanId(input, true), prm);
                var tskTotal = _identityConnection.QueryFirstOrDefaultAsync<int>(GetQuerySqlNhanVienByPhongBanId(input, false), prm);
                await Task.WhenAll(tskTotal, tskItems);
                var ret = new PagedResultDto<SysOrganizationunitsUserDto>()
                {
                    Items = tskItems.Result.ToList(),
                    TotalCount = tskTotal.Result
                };

                return ret;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GetQuerySqlNhanVienByPhongBanId(PagedRequestOrganizationunitsDto input, bool isItems = true)
        {
            var select = new StringBuilder(isItems == false ? "1" :
               $@" orUser.SysOrganizationunitsId, orUser.SysUserId,u.UserId as AbpUserId, u.UserName as MaNhanVien, u.HoTen as TenNhanVien, u.Email, u.SoDienThoai,
                    organ.OrganizationunitsId as AbpOrganizationunitsId, organ.MaPhongBan, organ.TenPhongBan");
            var sql = new StringBuilder(@$"
            SELECT {select} 
            from sysorganizationunitsuser as orUser
            left join sysuser as u on orUser.SysUserId = u.Id
            left join sysorganizationunits as organ on orUser.SysOrganizationunitsId = organ.Id
            WHERE orUser.IsDeleted = 0 and orUser.SysOrganizationunitsId = @OrganizationunitsId
            ");
            if (!string.IsNullOrEmpty(input.Filter))
            {
                sql.Append(" and (organ.MaPhongBan like @TextSearch or organ.TenPhongBan like @TextSearch or u.UserName like @TextSearch or u.HoTen like @TextSearch or u.Email like @TextSearch or u.SoDienThoai like @TextSearch)");
            }

            //sql.Append(" ORDER BY u.Level ");

            if (isItems)
            {
                return $@"{sql} ORDER BY orUser.Id DESC  LIMIT {input.SkipCount},{input.MaxResultCount} ";
            }
            else
            {
                return $@"SELECT COUNT(1) from ({sql}) A";
            }

        }

        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> AddUserToOrganizationunits(GetListUserOrganizationunitDto input)
        {
            try
            {
                if (input.ArrUsers != null && input.ArrUsers.Count > 0)
                {
                    foreach (var item in input.ArrUsers)
                    {
                        await _userManager.AddToOrganizationUnitAsync(item.AbpUserId, input.AbpOrganizationunitsId);
                        await _phongBanUserRepository.InsertAsync(new SysOrganizationunitsUser
                        {
                            SysOrganizationunitsId = input.SysOrganizationunitsId.Value,
                            SysUserId = item.SysUserId
                        });
                    }
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();
                }

                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>(ex.Message ?? "Lỗi xử lý !! ");
            }
        }
        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<CommonResultDto<bool>> RemoveUserFromOrganizationunits(GetListUserOrganizationunitDto input)
        {
            try
            {
                if (input.ArrUsers != null && input.ArrUsers.Count > 0)
                {
                    var mapArrUserIds = input.ArrUsers.Select(m => m.SysUserId).ToList();
                    await _phongBanUserRepository.DeleteAsync(m => m.SysOrganizationunitsId == input.SysOrganizationunitsId && mapArrUserIds.Any(b => b == m.SysUserId) == true);
                    foreach (var item in input.ArrUsers)
                    {
                        await _userManager.RemoveFromOrganizationUnitAsync(item.AbpUserId, input.AbpOrganizationunitsId);
                    }

                }

                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<PagedResultDto<SysOrganizationunitsUserDto>> GetListNhanVienNotInOrgan(PagedRequestOrganizationunitsDto input)
        {
            try
            {
                var _identityConnection = _factory.TravelTicketDbFactory.Connection;
                var prm = new
                {
                    OrganizationunitsId = input.OrganizationunitsId,
                    TextSearch = input.Filter.LikeTextSearch()
                };
                var tskItems = _identityConnection.QueryAsync<SysOrganizationunitsUserDto>(GetQuerySqlNhanVienNotInOrgan(input, true), prm);
                var tskTotal = _identityConnection.QueryFirstOrDefaultAsync<int>(GetQuerySqlNhanVienNotInOrgan(input, false), prm);
                await Task.WhenAll(tskTotal, tskItems);
                var ret = new PagedResultDto<SysOrganizationunitsUserDto>()
                {
                    Items = tskItems.Result.ToList(),
                    TotalCount = tskTotal.Result
                };

                return ret;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GetQuerySqlNhanVienNotInOrgan(PagedRequestOrganizationunitsDto input, bool isItems = true)
        {
            var select = new StringBuilder(isItems == false ? "1" :
               $@"
	                s.Id AS SysUserId,
	                s.UserId AS AbpUserId,
	                s.UserName AS MaNhanVien,
	                s.HoTen AS TenNhanVien,
	                GROUP_CONCAT( sr.Ten ) AS ListRoleName 
                ");
            var sql = new StringBuilder(@$"
                        SELECT {select} 
                        FROM sysuser AS s
                          LEFT JOIN sysuserrole AS sur ON s.Id = sur.SysUserId
	                      LEFT JOIN sysrole AS sr ON sur.SysRoleId = sr.Id 
	                      AND sr.IsDeleted = 0
                        WHERE
                          s.IsDeleted = 0 
                          AND s.Id NOT IN ( SELECT SysUserId FROM sysorganizationunitsuser AS sy WHERE sy.IsDeleted = 0 AND SysOrganizationunitsId = @OrganizationunitsId ) 
            ");
            if (!string.IsNullOrEmpty(input.Filter))
            {
                sql.Append(" and (s.UserName like @TextSearch or s.HoTen like @TextSearch or s.SoDienThoai like @TextSearch or s.Email like @TextSearch) ");
            }

            sql.Append(" GROUP BY s.Id ");

            if (isItems)
            {
                return $@"{sql} LIMIT {input.SkipCount},{input.MaxResultCount} ";
            }
            else
            {
                return $@"SELECT COUNT(1) from ({sql}) A";
            }

        }
        #endregion



    }
}
