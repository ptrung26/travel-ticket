using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.DependencyInjection;
using OrdBaseApplication;
using System.Reflection;
using Volo.Abp.Application;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;

namespace newPMS.ApplicationShared
{
    [DependsOn(
       typeof(AbpDddApplicationModule),
        typeof(AbpAutoMapperModule),
        typeof(OrdBaseApplicationModule)
        )]
    public class ApplicationSharedModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<ApplicationSharedModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<ApplicationSharedModule>(validate: false);
            });
            // Cấu hình MediatR
            context.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            context.Services.AddMediatR(typeof(ApplicationSharedModule).GetTypeInfo().Assembly);
        }
    }
}
