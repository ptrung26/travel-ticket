using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Volo.Abp.AspNetCore.Mvc;

namespace newPMS.TaiKhoan.Controllers
{
    public class HomeController : AbpController
    {
        private readonly IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public ActionResult IndexTaiKhoan()
        {
            return Redirect($"~/api/tai-khoan/swagger-ui");
        }
    }
}
