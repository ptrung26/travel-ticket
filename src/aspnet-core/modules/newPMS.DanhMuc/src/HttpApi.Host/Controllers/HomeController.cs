using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Volo.Abp.AspNetCore.Mvc;

namespace newPMS.DanhMuc.Controllers
{
    public class HomeController : AbpController
    {
        private readonly IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public ActionResult IndexDanhMuc()
        {
            return Redirect($"~/api/danh-muc/swagger-ui");
        }
    }
}
