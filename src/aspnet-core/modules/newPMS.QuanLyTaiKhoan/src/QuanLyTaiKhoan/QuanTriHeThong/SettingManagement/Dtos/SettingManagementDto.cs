using System;
using System.ComponentModel.DataAnnotations;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class SettingManagementDto
    {
        #region Emailing
        public string DefaultFromDisplayName { get; set; } //Abp.Mailing.DefaultFromDisplayName
        public string DefaultFromAddress { get; set; } //Abp.Mailing.DefaultFromAddress
        public string SmtpHost { get; set; }//Abp.Mailing.Smtp.Host
        public string SmtpPort { get; set; } //Abp.Mailing.Smtp.Port
        public string SmtpDomain { get; set; } //Abp.Mailing.Smtp.Domain
        public string SmtpUserName { get; set; }//Abp.Mailing.Smtp.Name
        public string SmtpPassword { get; set; }//Abp.Mailing.Smtp.Password
        #endregion
    }
    public class AbpSettingDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
