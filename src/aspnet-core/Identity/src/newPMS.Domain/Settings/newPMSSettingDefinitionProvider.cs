using Volo.Abp.Settings;

namespace newPMS.Settings
{
    public class newPMSSettingDefinitionProvider : SettingDefinitionProvider
    {
        public override void Define(ISettingDefinitionContext context)
        {
            //Define your own settings here. Example:
            //context.Add(new SettingDefinition(newPMSSettings.MySetting1));
        }
    }
}
