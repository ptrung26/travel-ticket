using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using newPMS;
using newPSG.PMS.Dto;
using System.Collections.Generic;
using Volo.Abp.Application.Services;

namespace newPSG.PMS.AppCore
{

    //[Authorize]
    public class CommonEnumAppService : DanhMucAppService
    {
        public CommonEnumAppService()
        {
        }

        public CommonEnumDto GetAllEnum()
        {
            return new CommonEnumDto();
        }

        //public List<ItemEnumDto<int>> GetListLevel()
        //{
        //    return EnumToList(typeof(LEVEL));
        //}

        //[HttpGet("/api/danh-muc/[controller]/gioitinh")]
        //public List<ItemEnumDto<int>> GetListGioiTinh()
        //{
        //    return EnumToList(typeof(GioiTinh));
        //}
    }
}
