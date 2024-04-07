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
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.PermissionManagement;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;

namespace newPMS
{
    [DependsOn(
        typeof(AbpDddApplicationModule),
        typeof(AbpAutoMapperModule),
        typeof(OrdBaseApplicationModule),
        typeof(BaseApplicationContractsModule),
        typeof(ApplicationSharedModule),
        typeof(AbpTextTemplatingModule),
        typeof(SettingManagementModule),
        typeof(AbpIdentityProDomainSharedModule),
        typeof(AbpIdentityApplicationContractsModule),
        typeof(AbpIdentityDomainModule),
        typeof(AbpIdentityDomainSharedModule),
        typeof(AbpIdentityEntityFrameworkCoreModule),

        typeof(AbpPermissionManagementApplicationModule),
        typeof(AbpPermissionManagementApplicationContractsModule),
        typeof(AbpPermissionManagementDomainModule),
        typeof(AbpPermissionManagementDomainSharedModule),
        typeof(AbpPermissionManagementEntityFrameworkCoreModule)
        )]
    public class QuanLyTaiKhoanApplicationModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<QuanLyTaiKhoanApplicationModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<QuanLyTaiKhoanApplicationModule>(validate: false);
            });
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<QuanLyTaiKhoanApplicationModule>("newPMS");
            });
            // Cấu hình MediatR
            context.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            context.Services.AddMediatR(typeof(QuanLyTaiKhoanApplicationModule).GetTypeInfo().Assembly);
        }
    }
}
