using Abp.Application.Services.Dto;
using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.ObjectMapping;

namespace newPMS.DanhMucChung.Request
{
    public class GetNCCXeByIdRequest : EntityDto<long>, IRequest<CommonResultDto<NhaCungCapXeDto>>
    {
    }

    public class GetNCCXeByIdHandler : IRequestHandler<GetNCCXeByIdRequest, CommonResultDto<NhaCungCapXeDto>>
    {
        private readonly IOrdAppFactory _factory;
        public GetNCCXeByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<NhaCungCapXeDto>> Handle(GetNCCXeByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<NhaCungCapXeEntity, long>();
                var xe = await _repos.GetAsync(request.Id);
                if (xe == null)
                {
                    return new CommonResultDto<NhaCungCapXeDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Dịch vụ xe không tồn tại hoặc đã bị xoá",
                    };
                }

                var dto = new NhaCungCapXeDto
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
                };

                return new CommonResultDto<NhaCungCapXeDto>
                {
                    IsSuccessful = true,
                    DataResult = dto
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new CommonResultDto<NhaCungCapXeDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
