using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace OrdBaseApplication.Factory
{
    public interface IOrdRepositories : IScopedDependency
    {
    }
    public class OrdRepositories : IOrdRepositories
    {
        private readonly IOrdAppFactory _factory;

        public OrdRepositories(IOrdAppFactory factory)
        {
            _factory = factory;
        }
    }
}
