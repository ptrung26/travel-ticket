using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Volo.Abp.AspNetCore.Mvc;

namespace newPMS.CongViec.Controllers
{
    public class HomeController : AbpController
    {
        private readonly IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public ActionResult IndexCongViec()
        {
            return Redirect($"~/api/cong-viec/swagger-ui");
        }
    }
}
