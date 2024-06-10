using MediatR;
using newPMS.Booking.Dtos;
using newPMS.Entities.Booking;
using newPMS.Entities.KhachHang;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Emailing;
using Volo.Abp.TextTemplating;

namespace newPMS.Booking.Request
{
    public class HuyBookingRequest : IRequest<CommonResultDto<bool>>
    {
        public ThongTinChungBookingDto Dto { get; set; }
        public bool IsQuaHan { get; set; }
    }

    public class HuyBookingHandler : IRequestHandler<HuyBookingRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IEmailSender _emailSender;
        private readonly ITemplateRenderer _templateRenderer;

        public HuyBookingHandler(IOrdAppFactory factory, IEmailSender emailSender, ITemplateRenderer templateRenderer)
        {
            _factory = factory;
            _emailSender = emailSender;
            _templateRenderer = templateRenderer;
        }
        public async Task<CommonResultDto<bool>> Handle(HuyBookingRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var _bookingRepos = _factory.Repository<BookingEntity, long>();
                var _khachHangRepos = _factory.Repository<KhachHangEntity, long>(); 
                var booking = await _bookingRepos.GetAsync(request.Dto.Id);
                var kh = await _khachHangRepos.GetAsync(request.Dto.KhachHangId); 
                if (booking == null)
                {
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Booking không tồn tại, hoặc đã bị xoá"
                    }; 
                }
                booking.TrangThai = 4; // Đang xử lý huỷ tour 
                await _bookingRepos.UpdateAsync(booking);

                var mess = request.IsQuaHan ? "Theo chính sách của công ty, chúng tôi sẽ hoàn trả 80% tổng số tiền đặt cọc vào phương thức thanh toán ban đầu của quý khách do đã đặt quá 24 giờ."
                    : "Theo chính sách của công ty, chúng tôi sẽ hoàn trả 100% tổng số tiền đặt cọc vào phương thức thanh toán ban đầu của quý khách.";
                var emailBody = await _templateRenderer.RenderAsync(TemplateName.XacNhanHuyBooking, new { 
                    tenTour = request.Dto.Ten, 
                    ma = request.Dto.Ma, 
                    message = mess,
                });

                using (var smtpClient = new SmtpClient(BaseConsts.Host, BaseConsts.Port))
                {
                    smtpClient.Credentials = new NetworkCredential(BaseConsts.EmailAppDefault, BaseConsts.EmailPassword);
                    smtpClient.EnableSsl = true;

                    // Create the email message
                    var mail = new MailMessage
                    {
                        From = new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName),
                        Subject = "Huỷ phiếu đặt tour du lịch",
                        Body = emailBody,
                        IsBodyHtml = true
                    };

                    // Add recipient
                    mail.To.Add(request.Dto.Email);

                    // Send the email
                    await smtpClient.SendMailAsync(mail);

                }

                return new CommonResultDto<bool>()
                {
                    IsSuccessful = true,
                };

            } catch(Exception ex)
            {
                return new CommonResultDto<bool>()
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau"
                }; 
            }
        }
    }
}
