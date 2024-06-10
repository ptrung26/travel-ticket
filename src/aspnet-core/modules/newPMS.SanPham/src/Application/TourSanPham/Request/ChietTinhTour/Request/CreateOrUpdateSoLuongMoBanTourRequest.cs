using Abp.Application.Services.Dto;
using MediatR;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.TourSanPham.Request.ChietTinhTour.Request
{
    public class CreateOrUpdateSoLuongMoBanTourRequest : EntityDto<long>, IRequest<CommonResultDto<bool>>
    {
        public int SoLuongMoBan { get; set; }
        public DateTime? ThoiGianMoBan { get; set; }    
    }

    public class CreateOrUpdateSoLuongMoBanTourHandler: IRequestHandler<CreateOrUpdateSoLuongMoBanTourRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory; 

        public CreateOrUpdateSoLuongMoBanTourHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<bool>> Handle(CreateOrUpdateSoLuongMoBanTourRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _tourRepos = _factory.Repository<TourSanPhamEntity, long>();
                var tour = _tourRepos.FirstOrDefault(x => x.Id == request.Id);
                if (tour == null)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Tour sản phẩm không tồn tại hoặc đã bị xoá"
                    }; 
                }

                tour.SoLuongMoBan = request.SoLuongMoBan;
                tour.ThoiGianMoBan = request.ThoiGianMoBan; 
                await _tourRepos.UpdateAsync(tour);
                return new CommonResultDto<bool>
                {
                    IsSuccessful = true,
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau"
                };
            }
        }
    }
}
