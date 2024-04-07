using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.Entities;

using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using System.Web;
using Volo.Abp.Account;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.TextTemplating;
using IdentityUser = Volo.Abp.Identity.IdentityUser;
using System.IO;

namespace newPMS.QuanLyTaiKhoan.Services
{
    public class TaiKhoanNoAuthAppService : QuanLyTaiKhoanAppService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IConfiguration _configuration;
        private readonly IdentityUserManager _userManager;
        private readonly IEmailSender _emailSender;
        private readonly ITemplateRenderer _templateRenderer;
        private readonly IPasswordHasher<IdentityUser> _passwordHasher;
        private readonly IRepository<SysUserEntity, long> _sysUserRepos;
        public TaiKhoanNoAuthAppService(
            IOrdAppFactory factory,
             IConfiguration configuration,
             IdentityUserManager userManager,
            IEmailSender emailSender,
            ITemplateRenderer templateRenderer,
            IPasswordHasher<IdentityUser> passwordHasher,
            IRepository<SysUserEntity, long> sysUserRepos
            )
        {
            _factory = factory;
            _configuration = configuration;
            _userManager = userManager;
            _emailSender = emailSender;
            _templateRenderer = templateRenderer;
            _passwordHasher=passwordHasher;
            _sysUserRepos=sysUserRepos;
        }

        #region "Gửi email đặt lại mật khẩu"
        [HttpPost]
        public async Task<CommonResultDto<bool>> SendPasswordResetCode(SendPasswordResetCodeDto input)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(input.Email);
                if (user!=null)
                {
                    var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var url = _factory.AppSettingConfiguration.GetSection("UrlLogin").Value;

                    //TODO: Use AbpAspNetCoreMultiTenancyOptions to get the key
                    var link = $"{url}/account/resetpassword?userId={user.Id}&tenantId={user.TenantId}&resetToken={UrlEncoder.Default.Encode(resetToken)}";

                    if (!input.ReturnUrl.IsNullOrEmpty())
                    {
                        link += "&returnUrl=" + NormalizeReturnUrl(input.ReturnUrl);
                    }

                    if (!input.ReturnUrlHash.IsNullOrEmpty())
                    {
                        link += "&returnUrlHash=" + input.ReturnUrlHash;
                    }

                    //string urlImage = _factory.AppSettingConfiguration.GetSection("UrlLogoEmail").Value;
                    string urlImage = "https://eqa.ump.edu.vn/assets/logo/logo-col.png";
                    var _config = _factory.Repository<ConfigSystemEntity, long>().AsNoTracking();
                    var turnOnSendEmail = _config.FirstOrDefault(x => x.Ma == "isActiveEmail");
                    if (turnOnSendEmail?.GiaTri == "true")
                    {
                        var emailBody = await _templateRenderer.RenderAsync(
                             TemplateName.SendPasswordResetCode,
                             new
                             {
                                 ten = user.Name,
                                 logo = urlImage,
                                 url = link
                             });
                        var mail = new MailMessage(new MailAddress(BaseConsts.EmailAppDefault, BaseConsts.AppName), new MailAddress(input.Email));
                        mail.Subject = "Đặt lại mật khẩu";
                        mail.Body = emailBody;
                        mail.IsBodyHtml = true;
                        await _emailSender.SendAsync(mail);
                    }
                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Email tài khoản không tồn tại!");
                }
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }
        private string NormalizeReturnUrl(string returnUrl)
        {
            if (returnUrl.IsNullOrEmpty())
            {
                return returnUrl;
            }

            //Handling openid connect login
            if (returnUrl.StartsWith("/connect/authorize/callback", StringComparison.OrdinalIgnoreCase))
            {
                if (returnUrl.Contains("?"))
                {
                    var queryPart = returnUrl.Split('?')[1];
                    var queryParameters = queryPart.Split('&');
                    foreach (var queryParameter in queryParameters)
                    {
                        if (queryParameter.Contains("="))
                        {
                            var queryParam = queryParameter.Split('=');
                            if (queryParam[0] == "redirect_uri")
                            {
                                return HttpUtility.UrlDecode(queryParam[1]);
                            }
                        }
                    }
                }
            }

            return returnUrl;
        }
        #endregion

        #region "Đặt lại mật khẩu"
        [HttpPost]
        public async Task<CommonResultDto<bool>> ResetPassword(ResetPasswordDto input) //Không check resettoken
        {
            try
            {
                var sysUser = await _sysUserRepos.FirstOrDefaultAsync(m => m.UserId == input.UserId);
                if (sysUser!=null)
                {
                    var user = await _userManager.GetByIdAsync(input.UserId);
                    var abpUserUpdate = new AbpUserMapUpdateDto
                    {
                        ConcurrencyStamp = user.ConcurrencyStamp,
                        UserName = user.UserName,
                        Name = user.Name,
                        Surname = user.Surname,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        PasswordHash = !string.IsNullOrWhiteSpace(input.Password) ? _passwordHasher.HashPassword(user, input.Password) : user.PasswordHash,
                        LockoutEnabled = user.LockoutEnabled,
                    };
                    _factory.ObjectMapper.Map(abpUserUpdate, user);
                    await _userManager.UpdateAsync(user);
                    await _factory.CurrentUnitOfWork.SaveChangesAsync();
                    return new CommonResultDto<bool>(true);
                }
                else
                {
                    return new CommonResultDto<bool>("Người dùng không tồn tại!!");
                }
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>(ex.Message ?? "Lỗi xử lý !! ");
            }

        }
        #endregion
    }
}
