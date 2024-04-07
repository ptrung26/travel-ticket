using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using System.Linq;
using static newPMS.CommonEnum;


namespace newPMS.DanhMuc.Request
{
    public class CheckValidImportExcelDanhMucTinhRequest : IRequest<List<CheckValidImportExcelDanhMucTinhDto>>
    {
        public List<CheckValidImportExcelDanhMucTinhDto> Input { get; set; }
    }

    public class CheckValidImportExcelDanhMucTinhHander : IRequestHandler<CheckValidImportExcelDanhMucTinhRequest, List<CheckValidImportExcelDanhMucTinhDto>>
    {
        private readonly IRepository<DanhMucTinhEntity, string> _DanhMucTinhRepos;
        public CheckValidImportExcelDanhMucTinhHander(
            IRepository<DanhMucTinhEntity, string> DanhMucTinhRepos
            )
        {
            _DanhMucTinhRepos = DanhMucTinhRepos;
        }

        public async Task<List<CheckValidImportExcelDanhMucTinhDto>> Handle(CheckValidImportExcelDanhMucTinhRequest request, CancellationToken cancellationToken)
        {
            var res = new List<CheckValidImportExcelDanhMucTinhDto>();
            var listEnumPhanVung = GetPhanVungTinh();
            foreach (var item in request.Input)
            {
                item.ListError = new List<string>();
                var tinhId = _DanhMucTinhRepos.FirstOrDefault(t => t.Id == item.Id);
                var maTinh = _DanhMucTinhRepos.FirstOrDefault(t => t.Ma == item.Ma);

                if (tinhId != null)
                {
                    item.ListError.Add("Tỉnh Id đã tồn tại!");
                }

                if (maTinh != null)
                {
                    item.ListError.Add("Mã tỉnh đã tồn tại!");
                }

                if (string.IsNullOrEmpty(item.Ten.Trim()) || string.IsNullOrEmpty(item.Id.Trim()) || string.IsNullOrEmpty(item.Cap.Trim()))
                {
                    item.ListError.Add("Dữ liệu không hợp lệ!");
                }

                if (!string.IsNullOrEmpty(item.StrTinhGan) && item.StrTinhGan.ToLower() == "có")
                {
                    item.IsTinhGan = true;
                }

                if (!string.IsNullOrEmpty(item.StrPhanVung))
                {
                    var phanVung = listEnumPhanVung.FirstOrDefault(t => t.Name.ToLower() == item.StrPhanVung.ToLower());
                    if (phanVung != null)
                    {
                        item.PhanVung = (int)phanVung.Id;
                    }
                }

                if (item.ListError?.Count > 0)
                {
                    item.IsValid = false;
                }
                res.Add(item);
            }
            return res;
        }

    }

}
