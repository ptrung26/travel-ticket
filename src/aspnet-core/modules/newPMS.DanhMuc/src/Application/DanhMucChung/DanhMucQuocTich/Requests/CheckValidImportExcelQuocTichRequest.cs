using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Dtos
{
    public class CheckValidImportExcelQuocTichRequest : IRequest<List<CheckValidImportExcelQuocTichDto>>
    {
        public List<CheckValidImportExcelQuocTichDto> Input { get; set; }
    }

    public class CheckValidImportExcelQuocTichHander : IRequestHandler<CheckValidImportExcelQuocTichRequest, List<CheckValidImportExcelQuocTichDto>>
    {
        private readonly IRepository<DanhMucQuocGiaEntity, string> _quocGiaRepos;

        public CheckValidImportExcelQuocTichHander(IRepository<DanhMucQuocGiaEntity, string> quocGiaRepos)
        {
            _quocGiaRepos = quocGiaRepos;
        }

        public async Task<List<CheckValidImportExcelQuocTichDto>> Handle(CheckValidImportExcelQuocTichRequest request, CancellationToken cancellationToken)
        {
            var res = new List<CheckValidImportExcelQuocTichDto>();

            foreach (var item in request.Input)
            {
                item.ListError = new List<string>();

                if (string.IsNullOrWhiteSpace(item.Alpha2Code) || item.Alpha2Code.Length > 2 || item.Alpha2Code.Length < 2)
                {
                    item.ListError.Add("alpha-2 code phải có đúng 2 kí tự! ");
                }
                if (string.IsNullOrWhiteSpace(item.Alpha3Code) || item.Alpha3Code.Length > 3 || item.Alpha3Code.Length < 3)
                {
                    item.ListError.Add("alpha-3 code phải có đúng 3 kí tự! ");
                }

                item.IsValid = item.ListError.Count == 0;
                res.Add(item);
            }

            return res;
        }
    }
}