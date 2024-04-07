using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using static newPMS.CommonEnum;

namespace newPMS.CongViec.Requests
{
    public class ViewCongViecByIdRequest : IRequest<CommonResultDto<CongViecDto>>
    {
        public long CongViecId { get; set; }
    }

    public class ViewCongViecByIdRequestHandler : IRequestHandler<ViewCongViecByIdRequest, CommonResultDto<CongViecDto>>
    {
        private readonly IOrdAppFactory _factory;
        private IRepository<CongViecEntity, long> _congViecRepos =>
            _factory.Repository<CongViecEntity, long>();
        private IRepository<SysUserEntity, long> _sysUserRepos =>
            _factory.Repository<SysUserEntity, long>();
        private IRepository<CongViecUserEntity, long> _congViecUserRepos =>
            _factory.Repository<CongViecUserEntity, long>();

        public ViewCongViecByIdRequestHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<CongViecDto>> Handle(ViewCongViecByIdRequest request, CancellationToken cancellationToken)
        {
            var response = new CommonResultDto<CongViecDto>();
            try
            {
                if (request.CongViecId > 0)
                {
                    var entity = _congViecRepos.FirstOrDefault(x => x.Id == request.CongViecId);
                    if (entity != null)
                    {
                        response.DataResult = _factory.ObjectMapper.Map<CongViecEntity, CongViecDto>(entity);
                        response.DataResult.ListUser = GetCongViecUser(response.DataResult.Id);
                        GetChildrenCongViec(response.DataResult, response.DataResult.Children);
                    }
                }
                response.IsSuccessful = true;
            }
            catch
            {
                response.IsSuccessful = false;
            }
            return response;
        }

        private void GetChildrenCongViec(CongViecDto congViec, List<CongViecDto> children)
        {
            var childrens = _congViecRepos.Where(x => x.ParentId == congViec.Id).Select(s => _factory.ObjectMapper.Map<CongViecEntity, CongViecDto>(s)).ToList();
            GetPhanTramCongViec(congViec, childrens);
            if (childrens?.Count > 0)
            {
                foreach (var c in childrens)
                {
                    if (_congViecRepos.Any(x => x.ParentId == c.Id))
                    {
                        GetChildrenCongViec(c, c.Children);
                    }

                    c.ListUser = GetCongViecUser(c.Id);
                    children.Add(c);
                }
            }
        }

        private List<CongViecUserDto> GetCongViecUser(long congViecId)
        {
            var response = (from cv_user in _congViecUserRepos.Where(x => x.CongViecId == congViecId)
                            join sys in _sysUserRepos on cv_user.SysUserId equals sys.Id into l_sys
                            from sys in l_sys.DefaultIfEmpty()
                            join cv in _congViecRepos on cv_user.CongViecId equals cv.Id into l_cv
                            from cv in l_cv.DefaultIfEmpty()
                            select new CongViecUserDto
                            {
                                Id = cv_user.Id,
                                SysUserId = cv_user.SysUserId,
                                CongViecId = cv_user.CongViecId,
                                UserId = sys != null ? sys.UserId : new Guid(),
                                HoTen = sys != null ? sys.HoTen : "",
                                AnhDaiDien = sys != null ? sys.Avatar : "",
                                UserName = sys != null ? sys.UserName : ""
                            }).ToList();
            return response;
        }

        private void GetPhanTramCongViec(CongViecDto congViec, List<CongViecDto> childrens)
        {
            if (childrens?.Count > 0)
            {
                congViec.SoViec = childrens.Count;
                congViec.SoViecDaHoanThanh = childrens.Count(x => x.TrangThai == (int)TRANG_THAI_CONG_VIEC.HOAN_THANH || (x.IsHoanThanh.HasValue && x.IsHoanThanh.Value));
            }
            else
            {
                congViec.PhanTramHoanThanh = 0;
            }
        }
    }
}
