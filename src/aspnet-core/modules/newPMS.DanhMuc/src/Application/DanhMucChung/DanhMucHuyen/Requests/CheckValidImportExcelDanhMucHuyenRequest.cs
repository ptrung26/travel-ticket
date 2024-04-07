using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Request
{
    public class CheckValidImportExcelDanhMucHuyenRequest : IRequest<List<CheckValidImportExcelDanhMucHuyenDto>>
    {
        public List<CheckValidImportExcelDanhMucHuyenDto> Input { get; set; }
    }

    public class CheckValidImportExcelDanhMucHuyenHander : IRequestHandler<CheckValidImportExcelDanhMucHuyenRequest, List<CheckValidImportExcelDanhMucHuyenDto>>
    {
        private readonly IRepository<DanhMucHuyenEntity, string> _DanhMucHuyenRepos;

        public CheckValidImportExcelDanhMucHuyenHander(
            IRepository<DanhMucHuyenEntity, string> DanhMucHuyenRepos
            )
        {
            _DanhMucHuyenRepos = DanhMucHuyenRepos;
        }

        public async Task<List<CheckValidImportExcelDanhMucHuyenDto>> Handle(CheckValidImportExcelDanhMucHuyenRequest request, CancellationToken cancellationToken)
        {
            var res = new List<CheckValidImportExcelDanhMucHuyenDto>();
            foreach (var item in request.Input)
            {
                item.ListError = new List<string>();
                var huyenId = _DanhMucHuyenRepos.FirstOrDefault(t => t.Id == item.Id);

                if (huyenId != null)
                {
                    item.ListError.Add("Dữ liệu đã tồn tại!");
                }

                if (string.IsNullOrEmpty(item.Ten.Trim()) || string.IsNullOrEmpty(item.Id.Trim()) || string.IsNullOrEmpty(item.Cap.Trim()) || string.IsNullOrEmpty(item.TenTinh.Trim()))
                {
                    item.ListError.Add("Dữ liệu không hợp lệ!");
                }

                res.Add(new CheckValidImportExcelDanhMucHuyenDto
                {
                    Id = item.Id,
                    Ten = item.Ten,
                    TenEn = item.TenEn,
                    TinhId = item.TinhId,
                    TenTinh = item.TenTinh,
                    Cap = item.Cap,
                    IsActive = item.IsActive,
                    IsValid = item.ListError.Count == 0,
                    ListError = item.ListError
                });
            }
            return res;
        }
    }
}