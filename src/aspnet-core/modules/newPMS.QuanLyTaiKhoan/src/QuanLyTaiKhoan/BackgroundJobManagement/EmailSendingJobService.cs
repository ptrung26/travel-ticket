using Dapper;
using newPMS.Entities;

using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Emailing;
using Volo.Abp.TextTemplating;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace newPMS.QuanLyTaiKhoan
{
    public class EmailSendingArgs
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
    public class EmailSendingJob : AsyncBackgroundJob<EmailSendingArgs>, ITransientDependency
    {
        private readonly IEmailSender _emailSender;

        public EmailSendingJob(IOrdAppFactory factory
            , IEmailSender emailSender
            , ITemplateRenderer templateRenderer)
        {
            _emailSender = emailSender;
        }


        public EmailSendingJob(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public override async Task ExecuteAsync(EmailSendingArgs args)
        {
            var mail = new MailMessage(new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName), new MailAddress(args.ToEmail));
            mail.Subject = args.Subject;
            mail.Body = args.Body;
            mail.IsBodyHtml = true;
            await _emailSender.SendAsync(mail);
        }
    }
}
