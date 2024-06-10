using Abp.Application.Services.Dto;
using MediatR;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
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
    public class GetChiTietHopDongNCCByIdRequest: EntityDto<long>,  IRequest<CommonResultDto<HopDongNCCDto>>
    {
    }

    public class GetChiTietHopDongNCCByIdHandler : IRequestHandler<GetChiTietHopDongNCCByIdRequest, CommonResultDto<HopDongNCCDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetChiTietHopDongNCCByIdHandler(IOrdAppFactory factory) {
            _factory = factory; 
        }
        public async Task<CommonResultDto<HopDongNCCDto>> Handle(GetChiTietHopDongNCCByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _hopDongRepos = await _factory.Repository<HopDongNCCEntity, long>().GetListAsync();

                var hopDong = _hopDongRepos.FirstOrDefault(x => x.Id == request.Id);
                if (hopDong == null)
                {
                    return new CommonResultDto<HopDongNCCDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Hợp đồng không tồn tại hoặc đã bị xoá", 
                    };
                }

                var hd = new HopDongNCCDto
                {
                    Id = hopDong.Id,
                    Ma = hopDong.Ma,
                    LoaiHopDongCode = hopDong.LoaiHopDongCode,
                    NgayHetHan = hopDong.NgayHetHan,
                    NgayHieuLuc = hopDong.NgayHieuLuc,
                    NgayKy = hopDong.NgayKy,
                    NguoiLapHopDong = hopDong.NguoiLapHopDong,
                    TinhTrang = hopDong.TinhTrang,

                }; 


                return new CommonResultDto<HopDongNCCDto>
                {
                    IsSuccessful = true,
                    DataResult = hd,
                }; 

            } catch(Exception ex)
            {
                Console.WriteLine("HD_GetHDNCCById:" + ex.Message); 
                return new CommonResultDto<HopDongNCCDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                }; 
            }
            
        }
    }
}
