using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.CongViec.Request
{
    public class CreateOrUpdateTraoDoiRequest : TraoDoiCongViecDto, IRequest<CommonResultDto<bool>>
    {
    }
    public class CreateOrUpdateTraoDoiHandle : IRequestHandler<CreateOrUpdateTraoDoiRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateTraoDoiHandle(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<bool>> Handle(CreateOrUpdateTraoDoiRequest input, CancellationToken cancellation)
        {
            try
            {
                if (input.Id > 0) //update
                {
                    var update = await _factory.Repository<CongViecTraoDoiEntity, long>().GetAsync(x => x.Id == input.Id);
                    update.SysUserId = _factory.UserSession.SysUserId;
                    _factory.ObjectMapper.Map(input, update);
                    await _factory.Repository<CongViecTraoDoiEntity, long>().UpdateAsync(update);
                }
                else
                {
                    var insert = new CongViecTraoDoiEntity();
                    _factory.ObjectMapper.Map(input, insert);
                    insert.SysUserId = _factory.UserSession.SysUserId;
                    await _factory.Repository<CongViecTraoDoiEntity, long>().InsertAsync(insert);
                }
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex)
            {
                throw ex;
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra",
                };
            }
        }
    }
}
