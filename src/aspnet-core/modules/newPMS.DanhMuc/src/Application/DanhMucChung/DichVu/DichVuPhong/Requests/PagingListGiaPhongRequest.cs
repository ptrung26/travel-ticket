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

namespace newPMS.DanhMucChung.DichVu.DichVuPhong.Requests
{
    public class PagingListGiaPhongRequest : PagedFullRequestDto, IRequest<PagedResultDto<DichVuGiaPhongDto>>
    {
        public long NhaCungCapKhachSanId { get; set; }
    }

    public class PagingListGiaPhongHandler : IRequestHandler<PagingListGiaPhongRequest, PagedResultDto<DichVuGiaPhongDto>>
    {
        private readonly IOrdAppFactory _factory;

        public PagingListGiaPhongHandler(OrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<PagedResultDto<DichVuGiaPhongDto>> Handle(PagingListGiaPhongRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var result = (from giaPhong in _factory.Repository<DichVuGiaPhongEntity, long>().AsNoTracking()
                              join hp in _factory.Repository<DichVuHangPhongEntity, long>().AsNoTracking()
                              on giaPhong.HangPhongId equals hp.Id
                              where giaPhong.NhaCungCapKhachSanId == request.NhaCungCapKhachSanId
                              select new DichVuGiaPhongDto
                              {
                                  Id = giaPhong.Id,
                                  TenHangPHong = hp.TenHangPhong, 
                                  NhaCungCapKhachSanId = giaPhong.NhaCungCapKhachSanId,
                                  GhiChu = giaPhong.GhiChu,
                                  GiaFOTBanNgayLe = giaPhong.GiaFOTBanNgayLe,
                                  GiaFOTBanNgayThuong = giaPhong.GiaFOTBanNgayThuong,
                                  HangPhongId = giaPhong.HangPhongId,
                                  IsHasThueVAT = giaPhong.IsHasThueVAT,
                                  GiaFOTNettNgayLe = giaPhong.GiaFOTNettNgayLe, 
                                  GiaFOTNettNgayThuong = giaPhong.GiaFOTNettNgayThuong, 
                                  LoaiPhongCode = giaPhong.LoaiPhongCode,
                                  LoaiTienTeCode = giaPhong.LoaiTienTeCode,
                                  NgayApDungDen = giaPhong.NgayApDungDen,
                                  NgayApDungTu = giaPhong.NgayApDungTu,
                              }).ToList();


                var totalCount =  result.AsQueryable().Count();
                var dataGrids = result.AsQueryable().PageBy(request).ToList(); 
                return new PagedResultDto<DichVuGiaPhongDto>(totalCount, dataGrids);
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra vui lòng thử lại sau");
            }
        }
    }
}
