using MediatR;
using MySqlX.XDevAPI.Relational;
using newPMS.CongViec.Dtos;
using newPMS.CongViec.Request;
using newPMS.Entities;
using NUglify.Helpers;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using static newPMS.CommonEnum;

namespace newPMS.CongViec.Requests
{
    public class BulkInsertCongViecRequest : CongViecDto, IRequest<CommonResultDto<bool>>
    {
    }

    public class BulkInsertCongViecHandler : IRequestHandler<BulkInsertCongViecRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IUnitOfWork uow;
        private readonly IRepository<CongViecEntity, long> _congViecRepos;
        private readonly IRepository<CongViecUserEntity, long> _congViecUser;
        private readonly IRepository<SysUserEntity, long> _sysUser;
        private readonly IRepository<CongViecLichSuEntity, long> _congViecLichSu;
        public BulkInsertCongViecHandler(IOrdAppFactory factory, IRepository<CongViecEntity, long> congViecRepos,
            IRepository<CongViecUserEntity, long> congViecUser, 
            IRepository<SysUserEntity, long> sysUser, 
            IRepository<CongViecLichSuEntity, long> congViecLichSu)
        {
            _factory = factory;
            _congViecRepos = congViecRepos;
            _congViecUser = congViecUser;
            _sysUser = sysUser;
            _congViecLichSu = congViecLichSu; 

        }
        public async Task<CommonResultDto<bool>> Handle(BulkInsertCongViecRequest request, CancellationToken cancellationToken)
        {
            try
            {
                using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
                await InsertCongViec(request, null, 0);
                await uow.CompleteAsync();
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };

            }
            catch (Exception ex)
            {
                await uow.RollbackAsync();
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra",
                };
            }

        }

        public async Task InsertCongViec(CongViecDto congViecDto, long? parentId, int level)
        {
            congViecDto.Level = level;
            var usersession = _factory.UserSession;
            var congViecEntity = _factory.ObjectMapper.Map<CongViecDto, CongViecEntity>(congViecDto);
            congViecEntity.ParentId = parentId;
            var congViec = await _congViecRepos.InsertAsync(congViecEntity, true);
            congViecDto.Id = congViec.Id;

            var listInsertCongViecUser = new List<CongViecUserEntity>();
            listInsertCongViecUser.Add(new CongViecUserEntity
            {
                CongViecId = congViec.Id,
                SysUserId = congViecDto.SysUserId
            });

            if (congViecDto.ParentId > 0)
            {
                await CongViecUserForParent(congViecDto.ParentId.Value, listInsertCongViecUser);
            }

            await _congViecUser.InsertManyAsync(listInsertCongViecUser);

            if (congViecDto.Level == (int)LEVEL_CONG_VIEC.MUC_VIEC_NHO)
            {
                var history = new CongViecLichSuEntity();
                history.CongViecId = congViecDto.ParentId;
                history.SysUserId = congViecDto.SysUserId;
                history.HanhDong = $"Đã thêm mới công việc nhỏ: {congViecDto.Ten}.";
                await _congViecLichSu.InsertAsync(history);
            }

            if (congViecDto.Level == (int)LEVEL_CONG_VIEC.CONG_VIEC)
            {
                var history = new CongViecLichSuEntity();
                history.CongViecId = congViec.Id;
                history.SysUserId = congViecDto.SysUserId;
                history.HanhDong = "Đã tạo mới công việc này";
                await _congViecLichSu.InsertAsync(history);
            }

            if (congViecDto.Children?.Count > 0)
            {
                foreach (var cv in congViecDto.Children)
                {
                    await InsertCongViec(cv, congViec.Id, level + 1);
                }
            }

        }

        private async Task<bool> CongViecUserForParent(long parentId, List<CongViecUserEntity> list)
        {
            try
            {
                var congViec = _congViecRepos.FirstOrDefault(x => x.Id == parentId);
                if (congViec != null)
                {
                    list.Add(new CongViecUserEntity()
                    {
                        CongViecId = congViec.Id,
                    });

                    if (congViec.ParentId > 0)
                    {
                        await CongViecUserForParent(congViec.ParentId.Value, list);
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
