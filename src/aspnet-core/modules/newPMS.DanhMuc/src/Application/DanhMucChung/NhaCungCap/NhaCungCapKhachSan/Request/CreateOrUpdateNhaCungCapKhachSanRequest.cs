using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Foundatio.Utility;
using MediatR;
using Microsoft.Extensions.Logging;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities.DichVu;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Volo.Abp.Uow;

namespace newPMS.DanhMuc.Request
{
    public class CreateOrUpdateNhaCungCapKhachSanRequest : CreateOrUpdateNhaCungCapKhachSanDto,
        IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateNhaCungCapKhachSanHandler : IRequestHandler<CreateOrUpdateNhaCungCapKhachSanRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory; 
        public CreateOrUpdateNhaCungCapKhachSanHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateNhaCungCapKhachSanRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _nccRepos = _factory.Repository<NhaCungCapKhachSanEntity, long>();

                if (request.Id > 0)
                {
                    var updateNCC = await _nccRepos.GetAsync(x => x.Id == request.Id);
                    if (updateNCC == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Khách sạn không tồn tại hoặc đã bị xoá!"
                        };
                    }

                    _factory.ObjectMapper.Map<CreateOrUpdateNhaCungCapKhachSanDto, NhaCungCapKhachSanEntity>(request, updateNCC);
                    await _nccRepos.UpdateAsync(updateNCC);

                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = updateNCC.Id
                    };
                } else
                {
                    var insertNCC = new NhaCungCapKhachSanEntity();
                    _factory.ObjectMapper.Map<CreateOrUpdateNhaCungCapKhachSanDto, NhaCungCapKhachSanEntity>(request, insertNCC);
                    var newId = (await _nccRepos.InsertAsync(insertNCC)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId
                    };
                }
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau!", 
                }; 
            }
            
        }
    }
}
