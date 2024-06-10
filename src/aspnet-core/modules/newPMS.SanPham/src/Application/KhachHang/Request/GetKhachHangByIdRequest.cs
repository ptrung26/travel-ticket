using MediatR;
using newPMS.Entities.KhachHang;
using newPMS.KhachHang.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.KhachHang.Request
{
    public class GetKhachHangByIdRequest : EntityDto<long>, IRequest<CommonResultDto<KhachHangDto>>
    {
    }

    public class GetKhachHangByIdHandler : IRequestHandler<GetKhachHangByIdRequest, CommonResultDto<KhachHangDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetKhachHangByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<KhachHangDto>> Handle(GetKhachHangByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var khachHang = await _factory.Repository<KhachHangEntity, long>().GetAsync(request.Id); 
                if(khachHang == null)
                {
                    return new CommonResultDto<KhachHangDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Khách hàng không tồn tại, hoặc đã bị xoá", 
                    };
                }

                var dto = new KhachHangDto
                {
                    DiaChi = khachHang.DiaChi,
                    Id = khachHang.Id,
                    Email = khachHang.Email,
                    Ma = khachHang.Ma,
                    SoDienThoai = khachHang.SoDienThoai,
                    Ten = khachHang.Ten,

                };

                return new CommonResultDto<KhachHangDto>
                {
                    IsSuccessful = true,
                    DataResult = dto
                };
            } catch(Exception ex)
            {
                return new CommonResultDto<KhachHangDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                };
            }
        }
    }
}
