using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Emailing;
using Volo.Abp.Emailing.Templates;
using Volo.Abp.TextTemplating;

namespace newPMS.TestMail
{
    public class TestMailAppService : ApplicationService
    {
        private readonly IEmailSender _emailSender;
        private readonly ITemplateRenderer _templateRenderer;

        public TestMailAppService(IEmailSender emailSender, ITemplateRenderer templateRenderer)
        {
            _emailSender = emailSender;
            _templateRenderer = templateRenderer;
        }
        public async Task SendAsync(string targetEmail)
        {
            try
            {
                var emailBody = await _templateRenderer.RenderAsync(
               StandardEmailTemplates.Message,
               new
               {
                   message = "ABP Framework provides IEmailSender service that is used to send emails."
               });

                await _emailSender.SendAsync(
                    targetEmail,
                    "Subject",
                    emailBody
                );
            }
            catch (Exception ex)
            {

               
            }
                
        }
    }
}
