using MediatR;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using static newPMS.CommonEnum;

namespace newPMS.CongViec.Request
{
    public class DeleteCongViecRequest : IRequest<CommonResultDto<bool>>
    {
        public long Id { get; set; }
    }
    public class DeleteCongViecHandler : IRequestHandler<DeleteCongViecRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IRepository<CongViecEntity, long> _congViecRepos;
        private readonly IRepository<CongViecUserEntity, long> _congViecUserRepos;
        private readonly IRepository<CongViecLichSuEntity, long> _congViecLichSuRepos;
        public DeleteCongViecHandler(IOrdAppFactory factory,
            IRepository<CongViecUserEntity, long> congViecUserRepos,
            IRepository<CongViecEntity, long> congViecRepos,
            IRepository<CongViecLichSuEntity, long> congViecLichSuRepos)
        {
            _factory = factory;
            _congViecUserRepos = congViecUserRepos;
            _congViecRepos = congViecRepos;
            _congViecLichSuRepos = congViecLichSuRepos;
        }

        public async Task<CommonResultDto<bool>> Handle(DeleteCongViecRequest req, CancellationToken cancellation)
        {
            using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                var congViec = _congViecRepos.FirstOrDefault(x => x.Id == req.Id);
                if (congViec == null)
                {
                    return new CommonResultDto<bool>
                    {
                        DataResult = false,
                        ErrorMessage = "Công việc không tồn tại hoặc đã bị xóa!"
                    };
                }

                //delete công việc
                var listIdCongViec = new List<long> { req.Id };
                GetListIdCongViec(req.Id, listIdCongViec);
                await _congViecRepos.DeleteManyAsync(listIdCongViec);

                //delete công viêc user
                await _congViecUserRepos.DeleteAsync(x => listIdCongViec.Contains(x.CongViecId.Value));

                //updatehistory nếu là mục việc nhỏ
                if (congViec.Level == (int)LEVEL_CONG_VIEC.MUC_VIEC_NHO)
                {
                    var history = new CongViecLichSuEntity();
                    history.CongViecId = congViec.ParentId;
                    history.SysUserId = _factory.UserSession.SysUserId;
                    history.HanhDong = $"Đã xóa công việc nhỏ: {congViec.Ten}";
                    await _congViecLichSuRepos.InsertAsync(history);
                }

                await uow.CompleteAsync();
                return new CommonResultDto<bool>
                {
                    DataResult = true,
                };

            }
            catch (Exception ex)
            {
                await uow.RollbackAsync();
                return new CommonResultDto<bool>
                {
                    DataResult = false,
                    ErrorMessage = "Có lỗi xảy ra"
                };
            }

        }

        private List<long> GetListIdCongViec(long parentId, List<long> list)
        {
            var listChildCongViec = _congViecRepos.Where(x => x.ParentId == parentId).ToList();
            list.AddRange(listChildCongViec.Select(s => s.Id));
            if (listChildCongViec?.Count > 0 && listChildCongViec.Any(x => x.ParentId.HasValue))
            {
                foreach (var c in listChildCongViec)
                {
                    GetListIdCongViec(c.Id, list);
                }
            }
            return list;
        }
    }
}
