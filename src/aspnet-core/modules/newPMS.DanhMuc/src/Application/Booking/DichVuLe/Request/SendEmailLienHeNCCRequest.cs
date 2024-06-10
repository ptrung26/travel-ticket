using MediatR;
using OrdBaseApplication.Dtos;
using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Emailing;
using Volo.Abp.TextTemplating;
using System.Net.Mail;
using System.Net;
using OrdBaseApplication.Factory;
using newPMS.Entities.Booking;
using System.Linq.Dynamic.Core;
using System.Linq;


namespace newPMS.Booking.DichVuLe.Request
{
    public class SendEmailLienHeNCCRequest : IRequest<CommonResultDto<bool>>
    {
        public string TemplateEmail { get; set; }

        public string Email { get; set; }
        
        public long BookingId { get;set; }
    }

    public class SendEmailLienHeNCCHandler : IRequestHandler<SendEmailLienHeNCCRequest, CommonResultDto<bool>>
    {
        private readonly IEmailSender _emailSender;
        private readonly ITemplateRenderer _templateRenderer;
        private readonly IOrdAppFactory _factory; 

        public SendEmailLienHeNCCHandler( IEmailSender emailSender, ITemplateRenderer templateRenderer, IOrdAppFactory factory)
        {
            _emailSender = emailSender;
            _templateRenderer = templateRenderer;
            _factory = factory; 
        }


        public async Task<CommonResultDto<bool>> Handle(SendEmailLienHeNCCRequest request, CancellationToken cancellationToken)
        {

            try
            {
                var _dichVuLeBookingRepos = _factory.Repository<ChiTietBookingDichVuLeEntity, long>(); 
                var emailBody = await _templateRenderer.RenderAsync(TemplateName.LienHeNCC, new { content = request.TemplateEmail });

                using (var smtpClient = new SmtpClient(BaseConsts.Host, BaseConsts.Port))
                {
                    smtpClient.Credentials = new NetworkCredential(BaseConsts.EmailAppDefault, BaseConsts.EmailPassword);
                    smtpClient.EnableSsl = true;

                    // Create the email message
                    var mail = new MailMessage
                    {
                        From = new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName),
                        Subject = "Đặt dịch vụ nhà cung cấp",
                        Body = emailBody,
                        IsBodyHtml = true
                    };

                    mail.To.Add(request.Email);
                    await smtpClient.SendMailAsync(mail);

                }

                var listDVLe = _dichVuLeBookingRepos.Where(x => x.BookingId == request.BookingId).ToList(); 
                for(var i = 0; i < listDVLe.Count; i++)
                {
                    listDVLe[i].TrangThai = 2; 
                }

                await _dichVuLeBookingRepos.UpdateManyAsync(listDVLe);

                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra",
                    ExceptionError = ex.Message
                };
            }
        }
    }
}
