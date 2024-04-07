using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Volo.Abp.Auditing;
using static newPMS.CommonEnum;

namespace newPMS.Web.Controllers
{
    public class CustomerController : Controller
    {
        private readonly IConfiguration _configuration;
        public CustomerController(
            IConfiguration configuration
            )
        {
            _configuration = configuration;
        }
    }
}