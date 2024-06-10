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

namespace newPMS.DanhMucChung.DichVu.DichVuXe.Request
{
    public class GetNhaCungCapDichVuXeRequest : IRequest<CommonResultDto<List<NhaCungCapDichVuXeDto>>>
    {
    }

    public class GetAllNhaCungCapDichVuXeHandler : IRequestHandler<GetNhaCungCapDichVuXeRequest, CommonResultDto<List<NhaCungCapDichVuXeDto>>>
    {

        private readonly IOrdAppFactory _factory;

        public GetAllNhaCungCapDichVuXeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<List<NhaCungCapDichVuXeDto>>> Handle(GetNhaCungCapDichVuXeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var _nccXeRepos = _factory.Repository<NhaCungCapXeEntity, long>().AsNoTracking();
                var _dichVuXeRepos = _factory.Repository<DichVuCungCapXeEntity, long>().AsNoTracking();

                var listNhaCungCap = _nccXeRepos
                .Select(item => new NhaCungCapDichVuXeDto
                {
                    Id = item.Id,
                    Ten = item.Ten,
                    Fax = item.Fax,
                    Email = item.Email,
                    IsHasThueVAT = item.IsHasVAT,
                    ListDichVuXe = new List<DichVuXeDto>()
                }).ToList();

                foreach (var nhaCungCap in listNhaCungCap)
                {
                    nhaCungCap.ListDichVuXe = _dichVuXeRepos
                        .Where(x => x.NhaCungCapXeId == nhaCungCap.Id)
                        .Select(x => new DichVuXeDto
                        {
                            Id = x.Id,
                            Ma = x.Ma,
                            Ten = x.Ten,
                            GhiChu = x.GhiChu,
                            GiaBan = x.GiaBan,
                            GiaNett = x.GiaNett,
                            IsHasThueVAT = x.IsHasThueVAT,
                            JsonTaiLieu = x.JsonTaiLieu,
                            LoaiTienTeCode = x.LoaiTienTeCode,
                            LoaiXeCode = x.LoaiXeCode,
                            NhaCungCapXeId = x.NhaCungCapXeId,
                            SoChoCode = x.SoChoCode,
                            SoKMDuTinh = x.SoKMDuTinh,
                            TuNgay = x.TuNgay,
                            DenNgay = x.DenNgay,
                            TinhTrang = x.TinhTrang,
                        }).ToList();
                }


                foreach (var ncc in listNhaCungCap)
                {
                    foreach (var dv in ncc.ListDichVuXe)
                    {
                        var loaiXeCode = csRepos.FirstOrDefault(x => x.Code == dv.LoaiXeCode);
                        var loaiTienTeCode = csRepos.FirstOrDefault(x => x.Code == dv.LoaiTienTeCode);
                        var loaiChoNgoiCode = csRepos.FirstOrDefault(x => x.Code == dv.SoChoCode);

                        if (loaiXeCode != null)
                        {
                            dv.LoaiXeDisplay = loaiXeCode.Display;
                        }
                        if (loaiTienTeCode != null)
                        {
                            dv.LoaiTienTeDisplay = loaiTienTeCode.Display;
                        }
                        if (loaiChoNgoiCode != null)
                        {
                            dv.SoChoDisplay = loaiChoNgoiCode.Display;
                        }
                    }
                }

                return new CommonResultDto<List<NhaCungCapDichVuXeDto>>
                {
                    IsSuccessful = true,
                    DataResult = listNhaCungCap
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<List<NhaCungCapDichVuXeDto>>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
