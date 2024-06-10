using MediatR;
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

namespace newPMS.DanhMucChung.Request
{
    public class CreateOrUpdateNguoiLienHeNCCRequest : NguoiLienHeNCCDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateNguoiLienHeNCCHandler : IRequestHandler<CreateOrUpdateNguoiLienHeNCCRequest, CommonResultDto<long>>
    {
        private readonly IOrdAppFactory _factory; 
        public CreateOrUpdateNguoiLienHeNCCHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateNguoiLienHeNCCRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _nguoiLienHeRepos = _factory.Repository<NguoiLienHeNCCEntity, long>();
                if (request.Id > 0)
                {
                    var nguoiLienHe = await _nguoiLienHeRepos.GetAsync(request.Id);
                    if (nguoiLienHe == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Người liên hệ không tồn tại hoặc đã bị xoá"
                        };
                    }
                    _factory.ObjectMapper.Map(request, nguoiLienHe);
                    await _nguoiLienHeRepos.UpdateAsync(nguoiLienHe);
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = request.Id, 
                    };

                } else
                {
                    var nguoiLienHe = new NguoiLienHeNCCEntity(); 

                    _factory.ObjectMapper.Map(request, nguoiLienHe);
                    var newId = (await _nguoiLienHeRepos.InsertAsync(nguoiLienHe, true)).Id;
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId, 
                    };

                }
            } catch(Exception ex)
            {
                Console.WriteLine(ex.Message); 
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau", 
                };
            }
          
        }
    }
}
