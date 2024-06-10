using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities.DichVu;
using OrdBaseApplication.Dtos;

namespace newPMS.DanhMucChung.Request
{
    public class GetNhaCungCapDichVuVeRequest : IRequest<CommonResultDto<List<NhaCungCapDichVuVeDto>>>
    {
    }

    public class GetNhaCungCapDichVuVeHandler : IRequestHandler<GetNhaCungCapDichVuVeRequest, CommonResultDto<List<NhaCungCapDichVuVeDto>>>
    {

        private readonly IOrdAppFactory _factory;

        public GetNhaCungCapDichVuVeHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<List<NhaCungCapDichVuVeDto>>> Handle(GetNhaCungCapDichVuVeRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var _nccVeRepos = _factory.Repository<NhaCungCapVeEntity, long>().AsNoTracking();
                var _dichVuXeRepos = _factory.Repository<DichVuVeEntity, long>().AsNoTracking();

                var listNhaCungCap = _nccVeRepos
                .Select(item => new NhaCungCapDichVuVeDto
                {
                    Id = item.Id,
                    Ten = item.Ten,
                    Fax = item.Fax,
                    Email = item.Email,
                    IsHasThueVAT = item.IsHasVAT,
                    ListDichVuVe = new List<DichVuVeDto>()
                }).ToList();

                foreach (var nhaCungCap in listNhaCungCap)
                {
                    nhaCungCap.ListDichVuVe = _dichVuXeRepos
                        .Where(x => x.NhaCungCapVeId == nhaCungCap.Id)
                        .Select(x => new DichVuVeDto
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
                            NhaCungCapVeId = x.NhaCungCapVeId,
                            TuNgay = x.TuNgay,
                            DenNgay = x.DenNgay,
                            TinhTrang = x.TinhTrang,
                        }).ToList();
                }


                foreach (var ncc in listNhaCungCap)
                {
                    foreach (var dv in ncc.ListDichVuVe)
                    {
                        var loaiTienTeCode = csRepos.FirstOrDefault(x => x.Code == dv.LoaiTienTeCode);
                        if (loaiTienTeCode != null)
                        {
                            dv.LoaiTienTeDisplay = loaiTienTeCode.Display;
                        }
                      
                    }
                }

                return new CommonResultDto<List<NhaCungCapDichVuVeDto>>
                {
                    IsSuccessful = true,
                    DataResult = listNhaCungCap
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<List<NhaCungCapDichVuVeDto>>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}

