using newPMS.MultiTenancy;
using newPMS.Settings;
using Volo.Abp.BlobStoring.Database;
using Volo.Abp.Emailing;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;

namespace newPMS
{
    [DependsOn(
        typeof(BaseDomainSharedModule),
          typeof(AbpEmailingModule),
        typeof(BlobStoringDatabaseDomainModule)
        )]
    public class BaseDomainModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpMultiTenancyOptions>(options =>
            {
                options.IsEnabled = MultiTenancyTravelTicketConsts.IsEnabled;
            });

            Configure<AbpLocalizationOptions>(options =>
            {
                options.Languages.Add(new LanguageInfo("en", "en", "English", "gb"));
                options.Languages.Add(new LanguageInfo("tr", "tr", "Türkçe", "tr"));
                options.Languages.Add(new LanguageInfo("sl", "sl", "Slovenščina", "si"));
                options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "简体中文", "cn"));
            });
            //#if DEBUG
            //                        context.Services.Replace(ServiceDescriptor.Singleton<IEmailSender, NullEmailSender>());
            //#endif
        }
    }
}
