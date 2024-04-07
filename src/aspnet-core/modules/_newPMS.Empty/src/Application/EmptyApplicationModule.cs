using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.DependencyInjection;
using OrdBaseApplication;
using System.Reflection;
using Volo.Abp.Application;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;
using newPMS;
using newPMS.ApplicationShared;

namespace newPMS
{
    [DependsOn(
       typeof(AbpDddApplicationModule),
        typeof(AbpAutoMapperModule),
        typeof(OrdBaseApplicationModule),
        typeof(BaseApplicationContractsModule),
        typeof(ApplicationSharedModule)
        )]
    public class EmptyApplicationModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<EmptyApplicationModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<EmptyApplicationModule>(validate: false);
            });
            // Cấu hình MediatR
            context.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            context.Services.AddMediatR(typeof(EmptyApplicationModule).GetTypeInfo().Assembly);
        }
    }
}
