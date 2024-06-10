using Dapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.Common.Dtos;
using newPMS.Entities;
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

    }
}