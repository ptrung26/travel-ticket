using Dapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.Common.Dtos;
using newPMS.DanhMuc;
using newPMS.Entities;
using NUglify.Helpers;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Caching;
using static newPMS.CommonEnum;

namespace newPMS.ComboData
{
    [Authorize]
    public class ComboBaseAppService : ApplicationService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IDistributedCache<List<ComboBoxDto>> _cache;
        protected IMediator Mediator => _factory.Mediator;

        public ComboBaseAppService(IOrdAppFactory factory,
            IDistributedCache<List<ComboBoxDto>> cache)
        {
            _factory = factory;
            _cache = cache;
        }

        [HttpGet(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> GetTreeOrganizationUnit()
        {
            try
            {
                #region sql query

                var sql = new StringBuilder($@"select Id, PId, MaPhongBan, TenPhongBan from sysorganizationunits where IsDeleted=0");

                #endregion

                var data = await _factory.TravelTicketDbFactory.Connection.QueryAsync<TreeOrganizationDto>(sql.ToString());
                List<ComboBoxDto> allData = data.Where(x => x.PId == null).Select(x => new ComboBoxDto()
                {
                    Value = x.Id,
                    DisplayText = x.TenPhongBan,
                    HideText = x.TenPhongBan,
                }).ToList();
                List<ComboBoxDto> result = new List<ComboBoxDto>();
                allData.Where(x => x.Data == null).ForEach(item =>
                {
                    result.Add(item);
                    result.AddRange(data.Where(x => x.PId == (long)item.Value).Select(x => new ComboBoxDto()
                    {
                        Value = x.Id,
                        DisplayText = "--" + x.TenPhongBan,
                        HideText = "--" + x.TenPhongBan,
                    }).ToList());
                });
                return result;
            }
            catch
            {
                return null;
            }
        }


        [HttpPost(Utilities.ApiUrlActionBase)]
        public async Task<List<ComboBoxDto>> GetAllOrganizationUnitByUserId()
        {
            var userSession = _factory.UserSession;
            var result = await (from pb in _factory.Repository<SysOrganizationunits, long>()
                                join pb_user in _factory.Repository<SysOrganizationunitsUser, long>().Where(m => m.SysUserId == userSession.SysUserId) on pb.Id equals pb_user.SysOrganizationunitsId
                                select new ComboBoxDto
                                {
                                    Value = pb.Id,
                                    DisplayText = pb.TenPhongBan,
                                    IsActive = true,
                                }).ToListAsync();


            return result;
        }
    }
}