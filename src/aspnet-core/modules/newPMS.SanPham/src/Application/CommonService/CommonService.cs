using Dapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newPMS.AppConst;
using newPMS.ComboData;
using newPMS.Common.Dtos;
using newPMS.CommonService.Business;
using newPMS.CommonService.Query;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using static newPMS.CommonEnum;

namespace newPMS.CommonService
{
    //[Authorize]
    public class CommonService : ApplicationService
    {
        private readonly IOrdAppFactory _factory;
        protected IMediator Mediator => _factory.Mediator;
        private readonly ComboBaseAppService _comBoBaseService;

        public CommonService(IOrdAppFactory factory,
             ComboBaseAppService comBoBaseService)
        {
            _factory = factory;
            _comBoBaseService = comBoBaseService;
        }


        [HttpPost(Utilities.ApiUrlBase + "GetLoaiTourCombobox")]
        public List<ComboBoxDto> GetLoaiTourCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiTour");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetLoaiHinhThaiDuLichCombobox")]
        public List<ComboBoxDto> GetLoaiHinhThaiDuLichCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiHinhThaiDuLich");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }


        [HttpPost(Utilities.ApiUrlBase + "GetListDichVu")]
        public List<ComboBoxDto> GetListDichVuCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "LoaiDichVu");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }

        [HttpPost(Utilities.ApiUrlBase + "GetKhoangKhach")]
        public List<ComboBoxDto> GetKhoangKhachCombobox()
        {
            var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
            var cs = csRepos.FirstOrDefault(x => x.Code == "KhoangKhach");
            var query = _factory.Repository<CodeSystemEntity, long>().AsNoTracking()
                .Where(x => x.ParentId == cs.Id)
                 .Select(x => new ComboBoxDto()
                 {
                     Value = x.Code.ToString(),
                     DisplayText = $"{x.Display}",
                 }).ToList();
            return query;
        }


    }
}
