using MediatR;
using newPMS.Entities;
using newPMS.TourSanPham.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.TourSanPham.Request
{
    public class GetChuongTrinhTourByIdRequest : EntityDto<long>,  IRequest<CommonResultDto<ChuongTrinhTourDto>>
    {
    }

    public class GetChuongTrinhTourByIdHandler :
        IRequestHandler<GetChuongTrinhTourByIdRequest, CommonResultDto<ChuongTrinhTourDto>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetChuongTrinhTourByIdHandler(IOrdAppFactory factory)
        {
            _factory = factory; 
        }
        public async Task<CommonResultDto<ChuongTrinhTourDto>> Handle(GetChuongTrinhTourByIdRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _factory.Repository<ChuongTrinhTourEntity, long>().GetAsync(request.Id); 
                if(result == null)
                {
                    return new CommonResultDto<ChuongTrinhTourDto>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Chương trình Tour không tồn tại hoặc đã bị xoá",
                    }; 
                }

                var dto = new ChuongTrinhTourDto
                {
                    Id = result.Id,
                    DiemDen = result.DiemDen,
                    ListDichVuJson = result.ListDichVuJson,
                    NgayThu = result.NgayThu,
                    NoiDung = result.NoiDung,
                    TenHanhTrinh = result.TenHanhTrinh,
                    TepDinhKemJson = result.TepDinhKemJson,
                    TourSanPhamId = result.TourSanPhamId,
                };

                return new CommonResultDto<ChuongTrinhTourDto>
                {
                    IsSuccessful = true,
                    DataResult = dto,
                };

            } catch(Exception ex)
            {
                Console.WriteLine("SP_ChuongTrinhTour_GetById: " + ex.Message); 
                return new CommonResultDto<ChuongTrinhTourDto>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra vui lòng thử lại sau"
                };
            }
        }
    }
}
