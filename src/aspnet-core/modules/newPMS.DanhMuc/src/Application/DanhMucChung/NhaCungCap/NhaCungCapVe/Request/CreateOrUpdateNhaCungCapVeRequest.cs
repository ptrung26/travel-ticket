using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMuc.Request;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities.DanhMuc.NhaCungCap;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.ObjectMapping;

namespace newPMS.DanhMucChung.NhaCungCap.NhaCungCapVe.Request
{
    public class CreateOrUpdateNhaCungCapVeRequest : CreateOrUpdateNhaCungCapVeDto,
        IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateNhaCungCapVeHandler : IRequestHandler<CreateOrUpdateNhaCungCapVeRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateNhaCungCapVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateNhaCungCapVeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _nccRepos = _factory.Repository<NhaCungCapVeEntity, long>();

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

                    _factory.ObjectMapper.Map<CreateOrUpdateNhaCungCapVeDto, NhaCungCapVeEntity>(request, updateNCC);
                    await _nccRepos.UpdateAsync(updateNCC);

                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = updateNCC.Id
                    };
                }
                else
                {
                    var insertNCC = new NhaCungCapVeEntity();
                    _factory.ObjectMapper.Map<CreateOrUpdateNhaCungCapVeDto, NhaCungCapVeEntity>(request, insertNCC);
                    var newId = (await _nccRepos.InsertAsync(insertNCC)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId
                    };
                }
            }
            catch (Exception ex)
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
