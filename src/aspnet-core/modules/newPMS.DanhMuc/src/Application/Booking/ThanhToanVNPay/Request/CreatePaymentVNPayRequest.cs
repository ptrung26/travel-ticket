using MediatR;
using newPMS.Booking.ThanhToanVNPay.Dtos;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using Stimulsoft.Base.Excel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.Booking.ThanhToanVNPay.Request
{
    public class CreatePaymentVNPayRequest : PaymentDto, IRequest<CommonResultDto<string>>
    {
    }

    public class CreatePaymentVNPayHandler : IRequestHandler<CreatePaymentVNPayRequest, CommonResultDto<string>>
    {
        private readonly IOrdAppFactory _factory;

        public CreatePaymentVNPayHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<CommonResultDto<string>> Handle(CreatePaymentVNPayRequest request, CancellationToken cancellationToken)
        {
            {
                var vnpaySection = _factory.AppSettingConfiguration.GetSection("Vnpay");
                /*   var ipAddress = _factory.HttpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();*/

                var timeNow = DateTime.Now; 
                var tick = DateTime.Now.Ticks.ToString();
                var pay = new VnPayLibrary();
                var expiredTime = DateTime.Now.AddMinutes(15);
                pay.AddRequestData("vnp_Version", "2.1.1");
                pay.AddRequestData("vnp_Command", vnpaySection["Command"]);
                pay.AddRequestData("vnp_TmnCode", vnpaySection["TmnCode"]);
                pay.AddRequestData("vnp_Amount", ((int)request.ThanhTien * 100).ToString());
                pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
                pay.AddRequestData("vnp_CurrCode", vnpaySection["CurrCode"]);
                pay.AddRequestData("vnp_IpAddr", "127.0.0.1");
                pay.AddRequestData("vnp_Locale", vnpaySection["Locale"]);
                pay.AddRequestData("vnp_OrderInfo", $"{request.TenTour} - {request.Gia}");
                pay.AddRequestData("vnp_OrderType", "other");
                pay.AddRequestData("vnp_TxnRef", tick);
                pay.AddRequestData("vnp_ExpireDate", expiredTime.ToString("yyyyMMddHHmmss"));
                pay.AddRequestData("vnp_ReturnUrl", vnpaySection["ReturnUrl"]);

                var paymentUrl = pay.CreateRequestUrl(vnpaySection["BaseUrl"], vnpaySection["HashSecret"]);

                return new CommonResultDto<string>
                {
                    IsSuccessful = true,
                    DataResult = paymentUrl,
                };
            }
        }
    }
}
