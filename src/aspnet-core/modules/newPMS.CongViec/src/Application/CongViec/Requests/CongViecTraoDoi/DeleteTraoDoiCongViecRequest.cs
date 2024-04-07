using MediatR;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.CongViec.Request 
{ 
    public class DeleteTraoDoiCongViecRequest:IRequest<CommonResultDto<bool>>
    {
        public long Id { get; set; }
    }

    public class DeleteTraoDoiCongViecHandler:IRequestHandler<DeleteTraoDoiCongViecRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factoty;
        public DeleteTraoDoiCongViecHandler(IOrdAppFactory factoty)
        {
            _factoty = factoty;
        }
        public async Task<CommonResultDto<bool>> Handle(DeleteTraoDoiCongViecRequest request, CancellationToken cancellation)
        {
            try
            {
                var traoDoi = await _factoty.Repository<CongViecTraoDoiEntity, long>().FirstOrDefaultAsync(x => x.Id == request.Id);
                if (traoDoi != null)
                {
                    await _factoty.Repository<CongViecTraoDoiEntity, long>().DeleteAsync(traoDoi);
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = true
                    };
                }
                else
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Không tìm thấy nội dung trao đổi!"
                    };
                }
            
            }
            catch (Exception ex)
            {
                throw ex;
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra"
                };
            }
        }
    } 
}
