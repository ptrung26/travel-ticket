using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.DanhMuc.Request
{
    public class CheckValidImportExcelXaRequest : IRequest<List<CheckValidImportExcelXaDto>>
    {
        public List<CheckValidImportExcelXaDto> Input { get; set; }
    }

    public class CheckValidImportExcelXaHander : IRequestHandler<CheckValidImportExcelXaRequest, List<CheckValidImportExcelXaDto>>
    {
        private readonly IRepository<DanhMucTinhEntity, string> _tinhRepos;
        private readonly IRepository<DanhMucHuyenEntity, string> _huyenRepos;
        private readonly IRepository<DanhMucXaEntity, string> _xaRepos;

        private DanhMucTinhEntity _tinh;
        private DanhMucHuyenEntity _huyen;

        public CheckValidImportExcelXaHander(
            IRepository<DanhMucTinhEntity, string> tinhRepos,
            IRepository<DanhMucHuyenEntity, string> huyenRepos,
            IRepository<DanhMucXaEntity, string> xaRepos
            )
        {
            _tinhRepos = tinhRepos;
            _huyenRepos = huyenRepos;
            _xaRepos = xaRepos;
        }

        public async Task<List<CheckValidImportExcelXaDto>> Handle(CheckValidImportExcelXaRequest request, CancellationToken cancellationToken)
        {
            var res = new List<CheckValidImportExcelXaDto>();

            foreach (var item in request.Input)
            {
                item.ListError = new List<string>();

                await SimpleNullandExistValidator(item);

                //// fast return for display as least as possible error messages
                //if(item.ListError.Count != 0)
                //{
                //    item.IsValid = item.ListError.Count == 0;
                //    res.Add(item);
                //    continue;
                //}

                // check huyện có thuộc tỉnh hay k
                if (_huyen != null && _tinh != null && _huyen.TinhId != _tinh.Id)
                {
                    item.ListError.Add($"Huyện {_huyen.Ten} không thuộc tỉnh {_tinh.Ten} !");
                }

                item.IsValid = item.ListError.Count == 0;
                res.Add(item);
            }

            return res;
        }

        public async Task SimpleNullandExistValidator(CheckValidImportExcelXaDto input)
        {
            if (string.IsNullOrWhiteSpace(input.TinhId))
            {
                input.ListError.Add("Mã tỉnh không hợp lệ!");
                //return;
            }
            else
            {
                _tinh = await _tinhRepos.FirstOrDefaultAsync(tinh => tinh.Id == input.TinhId);
                if (_tinh == null)
                {
                    input.ListError.Add("Mã tỉnh không tồn tại!");
                    //return;
                }
            }
            if (string.IsNullOrWhiteSpace(input.HuyenId))
            {
                input.ListError.Add("Mã huyện không hợp lệ!");
            }
            else
            {
                _huyen = await _huyenRepos.FirstOrDefaultAsync(huyen => huyen.Id == input.HuyenId);
                if (_huyen == null)
                {
                    input.ListError.Add("Mã huyện không tồn tại!");
                    //return;
                }
            }
            if (string.IsNullOrWhiteSpace(input.Id))
            {
                input.ListError.Add("Mã Xã không hợp lệ!");
                //return;
            }
        }
    }
}