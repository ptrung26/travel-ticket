
using Volo.Abp.TextTemplating;

namespace newPMS
{
    public class MyTemplateDefinitionProvider : TemplateDefinitionProvider
    {

        public override void Define(ITemplateDefinitionContext context)
        {
            var rootFolder = "/_TemplateDefinition/Template/";
            context.Add(
                new TemplateDefinition(TemplateName.LienHeNCC)
                    .WithVirtualFilePath(
                       rootFolder + "LienHeNCC.tpl",
                        isInlineLocalized: true)
                    );
            context.Add(
               new TemplateDefinition(TemplateName.XacNhanHuyBooking)
                   .WithVirtualFilePath(
                      rootFolder + "YeuCauHuyDichVu.tpl",
                       isInlineLocalized: true)
                   );

        }
    }
}
