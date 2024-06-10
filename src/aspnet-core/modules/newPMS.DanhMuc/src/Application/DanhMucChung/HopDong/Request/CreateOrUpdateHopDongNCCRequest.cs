using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Uow;

namespace newPMS.DanhMucChung.Request
{
    public class CreateOrUpdateHopDongNCCRequest : CreateOrUpdateHopDongNCCDto, IRequest<CommonResultDto<long>>
    {

    }

    public class CreateOrUpdateHopDongNCCHandler : IRequestHandler<CreateOrUpdateHopDongNCCRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateHopDongNCCHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateHopDongNCCRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _hdRepos = _factory.Repository<HopDongNCCEntity, long>();
                if(request.Id > 0)
                {
                    var update = await _hdRepos.GetAsync(request.Id); 
                    if(update == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Hợp đồng không tồn tại hoặc đã bị xoá!"
                        }; 
                    }

                    _factory.ObjectMapper.Map<CreateOrUpdateHopDongNCCDto, HopDongNCCEntity>(request, update);
                    await _hdRepos.UpdateAsync(update);

                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = update.Id, 
                    };
                }
                else
                {

                    var insert =  _factory.ObjectMapper.Map<CreateOrUpdateHopDongNCCDto, HopDongNCCEntity>(request);
                    var newId = (await _hdRepos.InsertAsync(insert)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId,
                    };
                }
            }
            catch (Exception ex)
            {
                Console.Write("HD_XE_CRUD: " + ex.Message);
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!",
                };
            }
        }
    }
}
