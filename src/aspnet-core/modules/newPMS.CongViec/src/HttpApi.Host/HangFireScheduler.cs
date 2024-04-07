using Abp.Dependency;
using Castle.Core.Logging;
using System.Threading.Tasks; 

namespace TravelTicket.CongViec
{
    public class HangFireScheduler : ISingletonDependency
    {
        public ILogger Logger { get; set; }

        public HangFireScheduler()
        {
            Logger = NullLogger.Instance;
        } 
    }
}
