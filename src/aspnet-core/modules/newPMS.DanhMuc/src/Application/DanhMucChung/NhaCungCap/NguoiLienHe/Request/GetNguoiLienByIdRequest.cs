using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
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

namespace newPMS.DanhMucChung.NhaCungCap.NguoiLienHe.Request
{
    public class GetNguoiLienByIdRequest : EntityDto<long>, IRequest<CommonResultDto<NguoiLienHeNCCDto>>
    {
    }

    public class GetNguoiLienHeByIdHandler: IRequestHandler<GetNguoiLienByIdRequest, CommonResultDto<NguoiLienHeNCCDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetNguoiLienHeByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<NguoiLienHeNCCDto>> Handle(GetNguoiLienByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var lh = await _factory.Repository<NguoiLienHeNCCEntity, long>().GetAsync(request.Id);

                var dto = new NguoiLienHeNCCDto
                {
                    Id = lh.Id,
                    ChucVu = lh.ChucVu,
                    DienThoai = lh.DienThoai,
                    Email = lh.Email,
                    HoVaTen = lh.HoVaTen,
                    NhaCungCapCode = lh.NhaCungCapCode,
                    NhaCungCapId = lh.NhaCungCapId,
                    PhongBan = lh.PhongBan,
                };

                return new CommonResultDto<NguoiLienHeNCCDto>
                {
                    IsSuccessful = true,
                    DataResult = dto,
                };
            } catch(Exception ex)
            {
                return new CommonResultDto<NguoiLienHeNCCDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau",
                };
            }
        }
    }
}
