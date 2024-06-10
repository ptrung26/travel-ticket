using MediatR;
using newPMS.Entities;
using newPMS.Entities.KhachHang;
using newPMS.KhachHang.Dtos;
using newPMS.TourSanPham.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.ObjectMapping;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace newPMS.KhachHang.Request
{
    public class CreateOrUpdateKhachHangRequest : CreateOrUpdateKhachHangDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateKhachHangHandler : IRequestHandler<CreateOrUpdateKhachHangRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateKhachHangHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateKhachHangRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<KhachHangEntity, long>();
                if (request.Id > 0)
                {
                    var update = await _repos.GetAsync(request.Id);
                    if (update == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Khách hàng không tồn tại hoặc đã bị xoá"
                        };
                    }

                    _factory.ObjectMapper.Map<CreateOrUpdateKhachHangDto, KhachHangEntity>(request, update);
                    await _repos.UpdateAsync(update);
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = update.Id,
                    };
                }
                else
                {
                    var newKH = _factory.ObjectMapper.Map<CreateOrUpdateKhachHangDto, KhachHangEntity>(request);
                    var newId = (await _repos.InsertAsync(newKH, true)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId,
                    };
                }
            }
            catch (Exception ex)
            {
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                };
            }
        }
    }
}
