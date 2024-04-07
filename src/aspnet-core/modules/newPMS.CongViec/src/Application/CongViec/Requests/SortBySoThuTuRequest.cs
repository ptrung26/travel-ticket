using MediatR;
using newPMS.CongViec.Dtos;
using newPMS.Entities;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace newPMS.CongViec.Request
{
    public class SortBySoThuTuRequest : IRequest<bool>
    {
        public List<CongViecDto> ListCongViec { get; set; }
    }
    public class SortBySoThuTuHandler : IRequestHandler<SortBySoThuTuRequest, bool>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IRepository<CongViecEntity, long> _congViecRepos;
        public SortBySoThuTuHandler(IOrdAppFactory factory, IRepository<CongViecEntity, long> congViecRepos)
        {
            _factory = factory;
            _congViecRepos = congViecRepos;
        }

        public async Task<bool> Handle(SortBySoThuTuRequest req, CancellationToken cancellation)
        {
            if (req.ListCongViec.Count > 0)
            {
                foreach (var item in req.ListCongViec)
                {
                    var congViec = _congViecRepos.FirstOrDefault(x => x.Id == item.Id);
                    congViec.SoThuTu = item.SoThuTu;
                    await _congViecRepos.UpdateAsync(congViec);
                }

            }
            return true;
        }
    }

}
