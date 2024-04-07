using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Request
{
    public class GetTepDinhKemByIdDanhMucRequest : IRequest<List<TepDinhKemDto>>
    {
        public long IdDanhMuc { get; set; }
        public int LoaiDanhMuc { get; set; }
    }

    public class GetTepDinhKemByIdDanhMucHandle : AppBusinessBase, IRequestHandler<GetTepDinhKemByIdDanhMucRequest, List<TepDinhKemDto>>
    {
        public async Task<List<TepDinhKemDto>> Handle(GetTepDinhKemByIdDanhMucRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var tepDinhKemRepos = Factory.Repository<TepDinhKemEntity, long>();
                var query = (from tep in tepDinhKemRepos.Where(x => x.IdDanhMuc == request.IdDanhMuc && x.LoaiDanhMuc == request.LoaiDanhMuc)
                             select new TepDinhKemDto
                             {
                                 Id = tep.Id,
                                 TenGoc = tep.TenGoc,
                                 TenLuuTru = tep.TenLuuTru,
                                 DuongDan = tep.DuongDan,
                                 DuongDanTuyetDoi = tep.DuongDanTuyetDoi
                             }
                            );
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private string GetUrlTaiFile(string duongDan)
        {
            var urlLink = "/api/ngoai-kiem/file/taitepdinhkem?url=";
            string urlRoot = Factory.AppSettingConfiguration.GetSection("AuthServer").GetSection("Authority").Value;
            return $@"{urlRoot}{urlLink}{duongDan}";
        }
    }
}