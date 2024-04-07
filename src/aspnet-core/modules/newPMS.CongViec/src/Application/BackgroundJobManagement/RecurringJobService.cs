using Dapper;
using Hangfire.RecurringJobExtensions;
using Microsoft.EntityFrameworkCore;
using newPMS.CongViec.Dtos;
using newPMS.Dto;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Factory;
using Stimulsoft.Base.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Emailing;
using Volo.Abp.TextTemplating;
using Volo.Abp.Threading;
using Volo.Abp.Uow;


namespace newPMS.BackgroundJobManagement
{
    public class CongViecRecurringJobService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IEmailSender _emailSender;
        private readonly ITemplateRenderer _templateRenderer;

        public CongViecRecurringJobService(
           IEmailSender emailSender, ITemplateRenderer templateRenderer,
           IOrdAppFactory factory
        )
        {
            _emailSender = emailSender;
            _templateRenderer = templateRenderer;
            _factory = factory;
        }
        public void GuiCanhBaoCongViecDenHan()
        {
            try
            {

               var query = $@"SELECT 
               cu.SysUserId, cv.Ten, us.HoTen, us.Email,
               cv.NgayKetThuc, cv.NgayHoanThanh, cv.isHoanThanh
               FROM cv_congviecuser cu
               LEFT JOIN sysuser us ON cu.SysUserId = us.Id
               LEFT JOIN cv_congviec cv ON cu.CongViecId = cv.Id AND cv.IsDeleted = 0 AND (cv.isHoanThanh = 0 or cv.IsHoanThanh is NULL)
               WHERE cu.IsDeleted = 0 AND (DATEDIFF(NgayHoanThanh, CURDATE()) <= 1 OR DATEDIFF(NgayKetThuc, CURDATE()) <= 1)";
                var listDenHan = _factory.TravelTicketDbFactory.Connection.Query<CongViecUserDto>($" {query}").ToList();
                foreach (var item in listDenHan)
                {
                    var khoangThoiGian = DateTime.UtcNow - (item.NgayKetThuc ?? DateTime.UtcNow);
                    var khoangThoiGianHoanThanh = DateTime.UtcNow - (item.NgayHoanThanh ?? DateTime.UtcNow);
                    if (khoangThoiGian.TotalDays == 1 || khoangThoiGianHoanThanh.TotalDays == 1)
                    {
                        item.IsDenHan = false;
                    }
                    else if (khoangThoiGian.TotalDays <= 0 || khoangThoiGianHoanThanh.TotalDays <= 0)
                    {
                        item.IsDenHan = true;
                    }

                }
                /*AsyncHelper.RunSync(() => SendEmailCanhBaoDenHan(listDenHan));*/
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public async Task<int> SendEmailCanhBaoDenHan(List<CongViecUserDto> list)
        {
            try
            {
                foreach (var item in list)
                {
                    if (!string.IsNullOrWhiteSpace(item.Email))
                    {
                        //Gửi mail
                        var emailBody = await _templateRenderer.RenderAsync(
                             TemplateName.CanhBaoCongViecDenHan, item);
                        var mail = new MailMessage(new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName), new MailAddress(item.Email));
                        string subject = "";
                        string messageHetHan = "";
                        if (item.IsDenHan == false)
                        {
                            messageHetHan = "sắp đến hạn";
                            subject = "Cảnh báo công việc sắp đến hạn ngày  [ " + DateTime.Now.ToString("dd/MM/yyyy") + " ] ";
                        }
                        else
                        {
                            messageHetHan = "đến hạn";
                            subject = "Cảnh báo công việc đến hạn ngày  [ " + DateTime.Now.ToString("dd/MM/yyyy") + " ] ";
                        }
                        var travelTicketDB = _factory.DefaultDbFactory.Connection;
                        var check = await travelTicketDB.QueryFirstOrDefaultAsync<TextTemplateDto>("SELECT Name, Content from abptexttemplatecontents WHERE Name=@Name", new
                        {
                            Name = "CanhBaoCongViecDenHan"
                        });
                        string urlImage = Path.Combine(_factory.HostingEnvironment.WebRootPath, "Assets/Images/logo.png");
                        emailBody = check.Content
                            .Replace("{{model.message_thong_bao_den_han}}", messageHetHan)
                            .Replace("{{model.logo}}", urlImage);
                        mail.Subject = subject;
                        mail.Body = emailBody;
                        mail.IsBodyHtml = true;
                        await _emailSender.SendAsync(mail);
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {

                throw;
            }
        }

    }
}
