using MediatR;
using MediatR.Pipeline;
using Microsoft.Extensions.DependencyInjection;
using OrdBaseApplication;
using System.Reflection;
using newPMS.ApplicationShared;
using Volo.Abp.Application;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;
using Volo.Abp.TextTemplating;
using Volo.Abp.VirtualFileSystem;

namespace newPMS
{
    [DependsOn(
       typeof(AbpDddApplicationModule),
        typeof(AbpAutoMapperModule),
        typeof(OrdBaseApplicationModule),
        typeof(BaseApplicationContractsModule),
       typeof(ApplicationSharedModule),
       typeof(AbpTextTemplatingModule),
         typeof(SettingManagementModule)
        )]
    public class CongViecApplicationModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<CongViecApplicationModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<CongViecApplicationModule>(validate: false);
            });
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<CongViecApplicationModule>("newPMS");
            });
            // Cấu hình MediatR
            context.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            context.Services.AddMediatR(typeof(CongViecApplicationModule).GetTypeInfo().Assembly);
        }
    }
}
