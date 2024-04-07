using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace newPMS.Pages
{
    public class Index_Tests : newPMSWebTestBase
    {
        [Fact]
        public async Task Welcome_Page()
        {
            var response = await GetResponseAsStringAsync("/");
            response.ShouldNotBeNull();
        }
    }
}
