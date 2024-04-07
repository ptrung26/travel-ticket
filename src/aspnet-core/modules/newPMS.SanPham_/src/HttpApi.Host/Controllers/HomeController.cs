using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Volo.Abp.AspNetCore.Mvc;

namespace newPMS.Controllers
{
    public class HomeController : AbpController
    {
        private readonly IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public ActionResult Index()
        {
            var url = _configuration["Service:BaseUrl"];
            return Redirect($"~/api/{url}/swagger-ui");
        }
    }
}
