using Volo.Abp.Emailing;
using Volo.Abp.Settings;

namespace newPMS.Settings
{
    public class newPMSSettingDefinitionProvider : SettingDefinitionProvider
    {
        public override void Define(ISettingDefinitionContext context)
        {
            //Define your own settings here. Example:
            //context.Add(new SettingDefinition(newPMSSettings.MySetting1));
            context.Add(
            new SettingDefinition(EmailSettingNames.Smtp.Host, "smtp.gmail.com"),
            new SettingDefinition(EmailSettingNames.Smtp.Port, "587"),
            new SettingDefinition(EmailSettingNames.Smtp.EnableSsl, "true"),
            new SettingDefinition(EmailSettingNames.Smtp.UseDefaultCredentials, "false"),
            new SettingDefinition(EmailSettingNames.Smtp.Domain, ""),
            new SettingDefinition(EmailSettingNames.Smtp.UserName, "viemganpath@gmail.com"),
            new SettingDefinition(EmailSettingNames.Smtp.Password, "0n0eKQiMUo/tnDO+5rRSVQ==")
            );
        }
    }
}
