using MediatR;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
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
    public class GetComboboxHangPhongRequest : IRequest<CommonResultDto<List<ComboBoxDto>>>
    {
        public long NhaCungCapKhachSanId { get; set; }
    }

    public class GetComboboxHangPhongHandler : IRequestHandler<GetComboboxHangPhongRequest, CommonResultDto<List<ComboBoxDto>>>
    {
        private readonly IOrdAppFactory _factory; 
        public GetComboboxHangPhongHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
    
        public async Task<CommonResultDto<List<ComboBoxDto>>> Handle(GetComboboxHangPhongRequest request, CancellationToken cancellationToken)
        {
            try
            { 
                var _hangPhongRepos = _factory.Repository<DichVuHangPhongEntity, long>(); 
                var result = _hangPhongRepos.Where(x => x.NhaCungCapId == request.NhaCungCapKhachSanId)
                    .Select(x => new ComboBoxDto
                    {
                        Data = x,
                        DisplayText = x.TenHangPhong,
                        Value = x.Id,
                    }).ToList();

                return new CommonResultDto<List<ComboBoxDto>>
                {
                    IsSuccessful = true,
                    DataResult = result,
                };

            } catch(Exception ex)
            {
                return new CommonResultDto<List<ComboBoxDto>>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau"
                };
            }
        }
    }

}
