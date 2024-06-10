using Abp.Application.Services.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
    public class GetDichVuXeByIdRequest : EntityDto<long>, IRequest<CommonResultDto<DichVuXeDto>>
    {
    }

    public class GetDichVuXeByIdHandler : IRequestHandler<GetDichVuXeByIdRequest, CommonResultDto<DichVuXeDto>>
    {
        private readonly IOrdAppFactory _factory;
        public GetDichVuXeByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<DichVuXeDto>> Handle(GetDichVuXeByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<DichVuCungCapXeEntity, long>();
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var dichVuXe = await _repos.GetAsync(request.Id);
                if (dichVuXe == null)
                {
                    return new CommonResultDto<DichVuXeDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Dịch vụ xe không tồn tại hoặc đã bị xoá",
                    };
                }

                var dto = new DichVuXeDto
                {
                    Id = dichVuXe.Id,
                    Ma = dichVuXe.Ma,
                    Ten = dichVuXe.Ten,
                    GhiChu = dichVuXe.GhiChu,
                    GiaBan = dichVuXe.GiaBan,
                    GiaNett = dichVuXe.GiaNett,
                    IsHasThueVAT = dichVuXe.IsHasThueVAT,
                    JsonTaiLieu = dichVuXe.JsonTaiLieu,
                    LoaiTienTeCode = dichVuXe.LoaiTienTeCode,
                    LoaiXeCode = dichVuXe.LoaiXeCode,
                    NhaCungCapXeId = dichVuXe.NhaCungCapXeId,
                    SoChoCode = dichVuXe.SoChoCode,
                    SoKMDuTinh = dichVuXe.SoKMDuTinh,
                    TuNgay = dichVuXe.TuNgay,
                    DenNgay = dichVuXe.DenNgay,
                    TinhTrang = dichVuXe.TinhTrang, 
                };
                var loaiXeCode = csRepos.FirstOrDefault(x => x.Code == dto.LoaiXeCode);
                var loaiTienTeCode = csRepos.FirstOrDefault(x => x.Code == dto.LoaiTienTeCode);
                var loaiChoNgoiCode = csRepos.FirstOrDefault(x => x.Code == dto.SoChoCode); 
                if (loaiXeCode != null)
                {
                    dto.LoaiXeDisplay = loaiXeCode.Display; 
                }
                if (loaiTienTeCode != null)
                {
                    dto.LoaiTienTeDisplay = loaiTienTeCode.Display;
                }
                if (loaiChoNgoiCode != null)
                {
                    dto.SoChoDisplay = loaiChoNgoiCode.Display;
                }

                return new CommonResultDto<DichVuXeDto>
                {
                    IsSuccessful = true,
                    DataResult = dto
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new CommonResultDto<DichVuXeDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
