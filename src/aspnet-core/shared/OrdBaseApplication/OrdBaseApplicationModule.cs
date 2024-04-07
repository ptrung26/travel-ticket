using Foundatio.Caching;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System.Reflection;
using Volo.Abp.Application;
using Volo.Abp.BlobStoring;
using Volo.Abp.Caching;
using Volo.Abp.Modularity;

namespace OrdBaseApplication
{
    [DependsOn(
        typeof(AbpDddApplicationModule),
        typeof(AbpCachingModule),
        typeof(AbpBlobStoringModule)
        )]
    public class OrdBaseApplicationModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var configuration = context.Services.GetConfiguration();
            // Cấu hình MediatR
            context.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            context.Services.AddMediatR(typeof(OrdBaseApplicationModule).GetTypeInfo().Assembly);
            Stimulsoft.Base.StiLicense.Key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHn/MSFaeH5wvS6va9K1ybgLTf2duhrT9P62ZqeKD4LUAmOUCQ" +
                                             "kKK1IGZxyCEX66sHYLSULQHmF33xM8Mx61UjBX3hg9bififSXby2x0Xc88+kJ+UbHwaKqWZc1qQOOVvjx/+rHjxpIx" +
                                             "fFcKvKx3XdOg46ivRH1kn4aCz+T269uV7KAiQVr+RtHSNpatcWaxb1B+YCVdatQ9tq0ovmpdhwTDjk+2pCsi3PVVNo" +
                                             "mxIH2K3L1CjtLXdJK+aLjSKrjW9MxPGH4pOz4ULv58t5PXOx3vk+V/DauxEh9gQRm5excAm8jzeeBQWwb3uADyMtC/" +
                                             "YU9iCfTgwLvVZPIIrIFbpLBn7TTGrHZgIp32+cs2G+MeDd5KsSO2/Masbbbz5fXyICPUC48hsecL55xNzBMkCnhrze" +
                                             "HRQxaE3FovUix/9nM+Usk5/83EflAv+AKCzS3aF/x5/y1kbwWDH/u5UHHCWvNRWO3WcmnjRs/z2uj91NM18fWi1zTn" +
                                             "MWywWhYHDgx9cJ/m5IxT7xRsSYwGVj6NIYPECfID5laCwRpFeKazocBGgg==";
            var redisConfiguration = ConfigurationOptions.Parse(configuration["Redis:Configuration"]);
            redisConfiguration.AbortOnConnectFail = false;
            var redis = ConnectionMultiplexer.Connect(redisConfiguration);
            context.Services.AddScoped<ICacheClient>(provider => new RedisCacheClient(new RedisCacheClientOptions()
            {
                ConnectionMultiplexer = redis
            }));
        }
    }
}
