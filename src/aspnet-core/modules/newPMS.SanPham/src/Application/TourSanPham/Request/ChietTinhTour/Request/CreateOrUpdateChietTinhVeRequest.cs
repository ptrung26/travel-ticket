using MediatR;
using newPMS.Entities.ChietTinh;
using newPMS.TourSanPham.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Uow;

namespace newPMS.TourSanPham.Request
{
    public class CreateOrUpdateChietTinhVeRequest : IRequest<CommonResultDto<bool>>
    {
        public List<ChietTinhVeDto> ListChietTinhVe { get; set; }
    }

    public class CreateOrUpdateChietTinhVeHandler : IRequestHandler<CreateOrUpdateChietTinhVeRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory;

        public CreateOrUpdateChietTinhVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<bool>> Handle(CreateOrUpdateChietTinhVeRequest request, CancellationToken cancellationToken)
        {
            var _uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                var _repos = _factory.Repository<ChietTinhDichVuVeEntity, long>();
                foreach (var item in request.ListChietTinhVe)
                {
                    var update = await _repos.GetAsync(item.Id);
                    if (update == null)
                    {
                        await _uow.RollbackAsync(cancellationToken);
                        return new CommonResultDto<bool>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Chiết tinnh xe không tồn tại hoặc đã bị xóa",
                        };
                    }

                    _factory.ObjectMapper.Map(item, update);
                    await _repos.UpdateAsync(update);
                }

                await _uow.CompleteAsync(cancellationToken);

                return new CommonResultDto<bool>
                {
                    IsSuccessful = true,
                };

            }
            catch (Exception ex)
            {
                await _uow.RollbackAsync();
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                };
            }

        }
    }
}
