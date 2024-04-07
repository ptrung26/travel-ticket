
using Volo.Abp.TextTemplating;

namespace newPMS
{
    public class MyTemplateDefinitionProvider : TemplateDefinitionProvider
    {

        public override void Define(ITemplateDefinitionContext context)
        {
            var rootFolter = "/_TemplateDefinition/Template/";
            context.Add(
                 new TemplateDefinition(TemplateName.DangKyTaiKhoanKhachHang)
                     .WithVirtualFilePath(
                        rootFolter + "DangKyTaiKhoanKhachHang.tpl",
                         isInlineLocalized: true)
                     );
            context.Add(
                new TemplateDefinition(TemplateName.SendPasswordResetCode)
                    .WithVirtualFilePath(
                       rootFolter + "SendPasswordResetCode.tpl",
                        isInlineLocalized: true)
                    );
            context.Add(
               new TemplateDefinition(TemplateName.SendPassword)
                   .WithVirtualFilePath(
                      rootFolter + "SendPassword.tpl",
                       isInlineLocalized: true)
                   );
            context.Add(
                new TemplateDefinition(TemplateName.SendThongBaoHeThong)
                    .WithVirtualFilePath(
                       rootFolter + "SendThongBaoHeThong.tpl",
                        isInlineLocalized: true)
                    );
            context.Add(
               new TemplateDefinition(TemplateName.GuiTaiKhoanQuaEmail)
                   .WithVirtualFilePath(
                      rootFolter + "GuiTaiKhoanQuaEmail.tpl",
                       isInlineLocalized: true)
                   );
        }
    }
}
