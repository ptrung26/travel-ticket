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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace newPMS.TourSanPham.Request
{
    public class CreateOrUpdateTourSanPhamRequest : CreateOrUpdateTourSanPhamDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateTourSanPhamHandler : IRequestHandler<CreateOrUpdateTourSanPhamRequest, CommonResultDto<long>>
    {

        private readonly IOrdAppFactory _factory; 
        public CreateOrUpdateTourSanPhamHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateTourSanPhamRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _repos = _factory.Repository<TourSanPhamEntity, long>(); 
                if(request.Id > 0)
                {
                    var update = await _repos.GetAsync(request.Id); 
                    if(update == null)
                    {
                        return new CommonResultDto<long>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Tour sản phẩm không tồn tại hoặc đã bị xoá"
                        }; 
                    }

                    _factory.ObjectMapper.Map<CreateOrUpdateTourSanPhamDto, TourSanPhamEntity>(request, update);
                    await _repos.UpdateAsync(update);
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = update.Id,
                    };
                } else
                {
                    var newSP = _factory.ObjectMapper.Map<CreateOrUpdateTourSanPhamDto, TourSanPhamEntity>(request);
                    var newId = (await _repos.InsertAsync(newSP, true)).Id;
                    var listChuongTrinhTour = new List<ChuongTrinhTourEntity>();
                    for(int i = 1; i <= request.SoNgay; ++i)
                    {
                        listChuongTrinhTour.Add(new ChuongTrinhTourEntity
                        {
                            TourSanPhamId = newId,
                            NgayThu = i,
                        }); 
                    }
                    await _factory.Repository<ChuongTrinhTourEntity, long>().InsertManyAsync(listChuongTrinhTour);

                    return new CommonResultDto<long>
                    {
                        IsSuccessful = true,
                        DataResult = newId,
                    };
                }
            } catch(Exception ex)
            {
                Console.WriteLine("SanPham_TourSP: " + ex.Message);
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                }; 
            }
        }
    }
}
