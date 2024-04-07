
using Volo.Abp.TextTemplating;

namespace newPMS
{
    public class MyTemplateDefinitionProvider : TemplateDefinitionProvider
    {

        public override void Define(ITemplateDefinitionContext context)
        {
            var rootFolder = "/_TemplateDefinition/Template/";
            context.Add(
                 new TemplateDefinition(TemplateName.CanhBaoCongViecDenHan)
                     .WithVirtualFilePath(
                        rootFolder + "CanhBaoCongViecDenHan.tpl",
                         isInlineLocalized: true)
                     );
            
        }
    }
}
