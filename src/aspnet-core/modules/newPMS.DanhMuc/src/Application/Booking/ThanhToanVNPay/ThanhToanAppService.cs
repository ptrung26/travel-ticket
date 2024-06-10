using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using newPMS.Booking.ThanhToanVNPay.Dtos;
using newPMS.Booking.ThanhToanVNPay.Request;
using newPMS.DanhMuc;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace newPMS.Booking.ThanhToanVNPay
{
    public class ThanhToanAppService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;
        public ThanhToanAppService(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        [HttpPost(Utilities.ApiUrlBase + "Payment")]
        public async Task<CommonResultDto<string>> CreatePayment([FromBody] CreatePaymentVNPayRequest request)
        {
            var result = await _factory.Mediator.Send(request);
            return result; 
            
        }

        [HttpGet(Utilities.ApiUrlBase + "PaymentExecute")]
        public async Task<IActionResult> PaymentExecute()
        {
            var vnpayData = _factory.HttpContextAccessor.HttpContext.Request.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
            var vnp_HashSecret = _factory.AppSettingConfiguration.GetSection("Vnpay").GetSection("HashSecret").Value;
            var processUrl = _factory.AppSettingConfiguration.GetSection("Vnpay").GetSection("ProcessUrl").Value;
            var vnpay = new VnPayLibrary();

            foreach (var (key, value) in vnpayData)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value);
                }
            }

            var vnp_SecureHash = vnpay.GetResponseData("vnp_SecureHash");

            if (vnpay.ValidateSignature(vnp_SecureHash, vnp_HashSecret))
            {
                var transactionStatus = vnpay.GetResponseData("vnp_ResponseCode");
                if (transactionStatus == "00")
                {
                    // Thanh toán thành công
                    return new  RedirectResult(processUrl);
                }
                else
                {
                    // Thanh toán thất bại
                    return new RedirectResult(processUrl);
                }
            }
            else
            {
                // Chữ ký không hợp lệ
                return new RedirectResult(processUrl);
            }
        }
         



    }
}
