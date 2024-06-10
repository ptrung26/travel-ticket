using Abp.Application.Services.Dto;
using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.DanhMucChung.Request;
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
    public class GetNCCVeByIdRequest : EntityDto<long>, IRequest<CommonResultDto<NhaCungCapVeDto>>
    {
    }

    public class GetNCCVeByIdHandler : IRequestHandler<GetNCCVeByIdRequest, CommonResultDto<NhaCungCapVeDto>>
    {
        private readonly IOrdAppFactory _factory;
        public GetNCCVeByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<NhaCungCapVeDto>> Handle(GetNCCVeByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<NhaCungCapVeEntity, long>();
                var xe = await _repos.GetAsync(request.Id);
                if (xe == null)
                {
                    return new CommonResultDto<NhaCungCapVeDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Dịch vụ xe không tồn tại hoặc đã bị xoá",
                    };
                }

                var dto = new NhaCungCapVeDto
                {
                    Id = xe.Id,
                    Ma = xe.Ma,
                    Ten = xe.Ten,
                    Email = xe.Email,
                    Fax = xe.Fax,
                    SoSaoDanhGia = xe.SoSaoDanhGia,
                    AnhDaiDienUrl = xe.AnhDaiDienUrl,
                    DiaChi = xe.DiaChi,
                    DichVu = xe.DichVu,
                    IsHasVAT = xe.IsHasVAT,
                    MoTa = xe.MoTa,
                    NgayHetHanHopDong = xe.NgayHetHanHopDong,
                    QuocGiaId = xe.QuocGiaId,
                    TinhId = xe.TinhId,
                    TaiLieuJson = xe.TaiLieuJson,
                    TinhTrang = xe.TinhTrang,
                    MaSoThue = xe.MaSoThue
                };

                return new CommonResultDto<NhaCungCapVeDto>
                {
                    IsSuccessful = true,
                    DataResult = dto
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new CommonResultDto<NhaCungCapVeDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}