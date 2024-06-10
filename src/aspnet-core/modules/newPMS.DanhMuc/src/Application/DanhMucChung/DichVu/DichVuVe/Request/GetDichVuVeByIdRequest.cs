using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.DichVu;
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
    public class GetDichVuVeByIdRequest : EntityDto<long>, IRequest<CommonResultDto<DichVuVeDto>>
    {
    }

    public class GetDichVuVeByIdHandler : IRequestHandler<GetDichVuVeByIdRequest, CommonResultDto<DichVuVeDto>>
    {
        private readonly IOrdAppFactory _factory;
        public GetDichVuVeByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<DichVuVeDto>> Handle(GetDichVuVeByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<DichVuVeEntity, long>();
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var dichVuVe = await _repos.GetAsync(request.Id);
                if (dichVuVe == null)
                {
                    return new CommonResultDto<DichVuVeDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Dịch vụ vé không tồn tại hoặc đã bị xoá",
                    };
                }

                var dto = new DichVuVeDto
                {
                    Id = dichVuVe.Id,
                    Ma = dichVuVe.Ma,
                    Ten = dichVuVe.Ten,
                    GhiChu = dichVuVe.GhiChu,
                    GiaBan = dichVuVe.GiaBan,
                    GiaNett = dichVuVe.GiaNett,
                    IsHasThueVAT = dichVuVe.IsHasThueVAT,
                    JsonTaiLieu = dichVuVe.JsonTaiLieu,
                    LoaiTienTeCode = dichVuVe.LoaiTienTeCode,
                    NhaCungCapVeId = dichVuVe.NhaCungCapVeId,
                    TuNgay = dichVuVe.TuNgay,
                    DenNgay = dichVuVe.DenNgay,
                    TinhTrang = dichVuVe.TinhTrang,
                };
                var loaiTienTeCode = csRepos.FirstOrDefault(x => x.Code == dto.LoaiTienTeCode);
                if (loaiTienTeCode != null)
                {
                    dto.LoaiTienTeDisplay = loaiTienTeCode.Display;
                }

                return new CommonResultDto<DichVuVeDto>
                {
                    IsSuccessful = true,
                    DataResult = dto
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new CommonResultDto<DichVuVeDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
