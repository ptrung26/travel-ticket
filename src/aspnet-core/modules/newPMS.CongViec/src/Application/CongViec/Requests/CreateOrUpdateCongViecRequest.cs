using Dapper;
using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using newPMS.Permissions;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using static newPMS.CommonEnum;
using Volo.Abp.Uow;
using NUglify.Helpers;
using Volo.Abp.Authorization.Permissions;
using newPMS.CongViec.Requests;

namespace newPMS.CongViec.Request
{
    public class CreateOrUpdateCongViecRequest : CongViecDto, IRequest<CommonResultDto<CongViecDto>>
    {
    }

    public class CreateOrUpdateCongViecHandle : IRequestHandler<CreateOrUpdateCongViecRequest, CommonResultDto<CongViecDto>>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IRepository<CongViecEntity, long> _congViecRepos;
        private readonly IRepository<CongViecUserEntity, long> _congViecUser;
        private readonly IRepository<SysUserEntity, long> _sysUser;
        private readonly IRepository<CongViecLichSuEntity, long> _congViecLichSu;

        public CreateOrUpdateCongViecHandle(IOrdAppFactory factory, IRepository<CongViecUserEntity, long> congViecUser,
            IRepository<CongViecEntity, long> congViecRepos, IRepository<SysUserEntity, long> sysUser, IRepository<CongViecLichSuEntity, long> congViecLichSu)
        {
            _factory = factory;
            _congViecUser = congViecUser;
            _congViecRepos = congViecRepos;
            _sysUser = sysUser;
            _congViecLichSu = congViecLichSu;
        }
        public async Task<CommonResultDto<CongViecDto>> Handle(CreateOrUpdateCongViecRequest input, CancellationToken cancellation)
        {
            using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                var usersession = _factory.UserSession;
                if (input.Id > 0)
                {
                    //update công việc
                    var updateCongViec = await _congViecRepos.GetAsync(input.Id);
                    _factory.ObjectMapper.Map<CongViecDto, CongViecEntity>(input, updateCongViec);
                    await _congViecRepos.UpdateAsync(updateCongViec);

                    /* create, delete công việc user */
                    // Những user đang làm công việc hiện tại ngoại trừ mình 
                    var listCurrentCongViecUser = await _congViecUser.GetListAsync(x => x.CongViecId == input.Id && x.SysUserId != usersession.SysUserId);
                    if (input.ListUser?.Count > 0)
                    {
                        foreach (var user in input.ListUser)
                        {
                            user.CongViecId = input.Id;
                        }
                    }

                    var listCreate = input.ListUser?.FindAll(x => !listCurrentCongViecUser.Select(c => c.SysUserId).Contains(x.SysUserId)).ToList();
                    var listDelete = listCurrentCongViecUser?.FindAll(x => input.ListUser == null || !input.ListUser.Select(c => c.SysUserId).Contains(x.SysUserId))
                                     .Where(x => x.SysUserId != updateCongViec.SysUserId).ToList();

                    if (listCreate?.Count > 0)
                    {
                        var listInsertCongViecUser = new List<CongViecUserEntity>();
                        var insertEntities = _factory.ObjectMapper.Map<List<CongViecUserDto>, List<CongViecUserEntity>>(listCreate);
                        listInsertCongViecUser.AddRange(insertEntities);

                        if (updateCongViec.ParentId > 0)
                        {
                            await CongViecUserForParent(updateCongViec.ParentId.Value, listCreate.Select(s => s.SysUserId.Value).ToList(), listInsertCongViecUser);
                        }

                        if (listInsertCongViecUser?.Count > 0)
                        {
                            var congViecUserEntites = listInsertCongViecUser.DistinctBy(d => new { d.SysUserId, d.CongViecId }).Where(x => !_congViecUser.Any(a => a.CongViecId == x.CongViecId && a.SysUserId == x.SysUserId)).ToList();
                            await _congViecUser.InsertManyAsync(congViecUserEntites);
                        }
                    }

                    if (listDelete?.Count > 0)
                    {
                        if (updateCongViec.Level == (int)LEVEL_CONG_VIEC.DU_AN)
                        {
                            RemoveListDeleteCongViecUser(listDelete);
                        }
                        await _congViecUser.DeleteManyAsync(listDelete);
                    }
                }
                else
                {
                    var congViecEntity = _factory.ObjectMapper.Map<CongViecDto, CongViecEntity>(input);
                    congViecEntity.SysUserId = usersession.SysUserId;
                    var congViec = await _congViecRepos.InsertAsync(congViecEntity, true);
                    input.Id = congViec.Id;

                    var listInsertCongViecUser = new List<CongViecUserEntity>();
                    listInsertCongViecUser.Add(new CongViecUserEntity
                    {
                        CongViecId = congViec.Id,
                        SysUserId = usersession.SysUserId
                    });

                    if (input.ListUser?.Count > 0)
                    {
                        var congViecUserEntities = _factory.ObjectMapper.Map<List<CongViecUserDto>, List<CongViecUserEntity>>(input.ListUser).ToList()
                                                .Select(s =>
                                                {
                                                    s.CongViecId = congViec.Id;
                                                    return s;
                                                }).ToList();

                        if (congViecUserEntities?.Count > 0)
                        {
                            listInsertCongViecUser.AddRange(congViecUserEntities);
                        }

                        if (input.ParentId > 0)// thêm user cho công việc cha
                        {
                            await CongViecUserForParent(input.ParentId.Value, input.ListUser.Select(s => s.SysUserId.Value).ToList(), listInsertCongViecUser);
                        }
                    }

                    var congViecUserEntites = listInsertCongViecUser.DistinctBy(d => new { d.SysUserId, d.CongViecId }).Where(x => !_congViecUser.Any(a => a.CongViecId == x.CongViecId && a.SysUserId == x.SysUserId)).ToList();
                    await _congViecUser.InsertManyAsync(congViecUserEntites);

                    if (input.Level == (int)LEVEL_CONG_VIEC.MUC_VIEC_NHO)
                    {
                        var history = new CongViecLichSuEntity();
                        history.CongViecId = input.ParentId;
                        history.SysUserId = usersession.SysUserId;
                        history.HanhDong = $"Đã thêm mới công việc nhỏ: {input.Ten}.";
                        await _congViecLichSu.InsertAsync(history);
                    }

                    if (input.Level == (int)LEVEL_CONG_VIEC.CONG_VIEC)
                    {
                        var history = new CongViecLichSuEntity();
                        history.CongViecId = congViec.Id;
                        history.SysUserId = usersession.SysUserId;
                        history.HanhDong = "Đã tạo mới công việc này";
                        await _congViecLichSu.InsertAsync(history);
                    }
                }

                await uow.CompleteAsync();
                return new CommonResultDto<CongViecDto>
                {
                    IsSuccessful = true,
                    DataResult = input
                };
            }
            catch (Exception ex)
            {
                await uow.RollbackAsync();
                return new CommonResultDto<CongViecDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private void RemoveListDeleteCongViecUser(List<CongViecUserEntity> current)
        {
            var itemsToRemove = new List<CongViecUserEntity>();

            foreach (var item in current)
            {
                var us = _sysUser.FirstOrDefault(x => x.Id == item.SysUserId);

                if (us != null && CheckRoleUS("CongViec.QuanLyCongViec.NhanVien", us.UserId))
                {
                    itemsToRemove.Add(item);
                }
            }

            foreach (var itemToRemove in itemsToRemove)
            {
                current.Remove(itemToRemove);
            }
        }


        private async Task<bool> CongViecUserForParent(long parentId, List<long> listSysUserId, List<CongViecUserEntity> list)
        {
            try
            {
                var congViec = _congViecRepos.FirstOrDefault(x => x.Id == parentId);
                if (congViec != null)
                {
                    if (listSysUserId.Count > 0)
                    {
                        foreach (var id in listSysUserId)
                        {
                            list.Add(new CongViecUserEntity()
                            {
                                CongViecId = congViec.Id,
                                SysUserId = id
                            });
                        }
                    }

                    if (congViec.ParentId > 0)
                    {
                        await CongViecUserForParent(congViec.ParentId.Value, listSysUserId, list);
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool CheckRoleUS(string inputRole, Guid UserId)
        {
            var check = false;
            var sqlRoleId = new StringBuilder($@"
                                        SELECT
	                                        `abppermissiongrants`.`Name` 
                                        FROM
	                                        `abppermissiongrants`
	                                        LEFT JOIN `abproles` ON `abproles`.`Name` = `abppermissiongrants`.`ProviderKey`
	                                        LEFT JOIN `abpuserroles` ON `abproles`.`Id` = `abpuserroles`.`RoleId`
                                        WHERE
	                                        `abpuserroles`.`UserId` = '{UserId}'");
            var listRole = _factory.DefaultDbFactory.Connection.Query<string>(sqlRoleId.ToString());

            foreach (var role in listRole)
            {
                if (role == inputRole)
                {
                    check = true;
                }
            }
            return check;

        }

    }


}
