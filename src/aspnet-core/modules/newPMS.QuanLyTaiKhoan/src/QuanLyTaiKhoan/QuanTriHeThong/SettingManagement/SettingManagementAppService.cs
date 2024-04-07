using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using newPMS.Permissions;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.QuanLyTaiKhoan.Request;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.PermissionManagement;

namespace newPMS.QuanLyTaiKhoan.Services
{
    [Authorize]
    public class SettingManagementAppService : QuanLyTaiKhoanAppService
    {
        private readonly IOrdAppFactory _factory;
        private readonly IAuthorizationService _authorizationService;

        public SettingManagementAppService(
            IAuthorizationService authorizationService,
            IOrdAppFactory factory
            )
        {
            _authorizationService = authorizationService;
            _factory = factory;
        }
        #region "Setting Management"
        [HttpPost]
        public async Task<SettingManagementDto> GetSettingManagement()
        {
            var defautDb = _factory.DefaultDbFactory.Connection;
            SettingManagementDto setting = new SettingManagementDto();

            var sql = $@"SELECT * FROM AbpSettings";
            var listSetting = await defautDb.QueryAsync<AbpSettingDto>(sql);

            setting.DefaultFromDisplayName = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.DefaultFromDisplayName"))?.Value;
            setting.DefaultFromAddress = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.DefaultFromAddress"))?.Value;
            setting.SmtpHost = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Host"))!=null ? listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Host")).Value : "smtp.gmail.com";
            setting.SmtpPort = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Port"))!=null ? listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Port")).Value : "587";
            setting.SmtpDomain = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Domain"))?.Value;
            setting.SmtpUserName = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.UserName"))?.Value;
            setting.SmtpPassword = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Password"))?.Value;
            return setting;
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> UpdateSettingManagement(SettingManagementDto request)
        {
            try
            {
                var defautDb = _factory.DefaultDbFactory.Connection;
                var sql = $@"SELECT * FROM AbpSettings";
                var listSetting = await defautDb.QueryAsync<AbpSettingDto>(sql);
                var defaultFromDisplayName = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.DefaultFromDisplayName"));
                if (defaultFromDisplayName!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.DefaultFromDisplayName'", new
                    {
                        value = request.DefaultFromDisplayName
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`, `Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.DefaultFromDisplayName', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.DefaultFromDisplayName
                    });
                }
                var defaultFromAddress = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.DefaultFromAddress"));
                if (defaultFromAddress!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.DefaultFromAddress'", new
                    {
                        value = request.DefaultFromAddress
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`, `Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.DefaultFromAddress', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.DefaultFromAddress
                    });
                }
                var smtpHost = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Host"));
                if (smtpHost!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.Smtp.Host'", new
                    {
                        value = request.SmtpHost
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`, `Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.Smtp.Host', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.SmtpHost
                    });
                }
                var smtpPort = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Port"));
                if (smtpPort!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.Smtp.Port'", new
                    {
                        value = request.SmtpPort
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`, `Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.Smtp.Port', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.SmtpPort
                    });
                }
                var smtpDomain = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Domain"));
                if (smtpDomain!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.Smtp.Domain'", new
                    {
                        value = request.SmtpDomain
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`, `Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.Smtp.Domain', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.SmtpDomain
                    });
                }
                var smtpUserName = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.UserName"));
                if (smtpUserName!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.Smtp.UserName'", new
                    {
                        value = request.SmtpUserName
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`, `Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.Smtp.UserName', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.SmtpUserName
                    });
                }
                var smtpPassword = listSetting.FirstOrDefault(x => x.Name.Equals("Abp.Mailing.Smtp.Password"));
                if (smtpPassword!=null)
                {
                    await defautDb.ExecuteAsync("UPDATE AbpSettings SET Value = @value WHERE Name=N'Abp.Mailing.Smtp.Password'", new
                    {
                        value = request.SmtpPassword
                    });
                }
                else
                {
                    Guid id = Guid.NewGuid();
                    await defautDb.ExecuteAsync("INSERT INTO AbpSettings (`Id`,`Name`,`Value`,`ProviderName`,`ProviderKey`) VALUE (@id, 'Abp.Mailing.Smtp.Password', @value, 'G', null)", new
                    {
                        id = id,
                        value = request.SmtpPassword
                    });
                }
                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {

                return new CommonResultDto<bool>(ex.ToString());
            }
        }
        #endregion

        #region Text Template
        [HttpPost]
        [HttpPost(Utilities.ApiUrlBase + "GetList")]
        public async Task<PagedResultDto<TextTemplateDto>> GetListAsync(PagingTextTemplateRequest request)
        {
            return await _factory.Mediator.Send(request);
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> UpdateTextTemplate(TextTemplateDto request)
        {
            try
            {
                var defautDb = _factory.DefaultDbFactory.Connection;
                await defautDb.ExecuteAsync("UPDATE abptexttemplatecontents SET Content = @content WHERE Id=@id", new
                {
                    content = request.Content,
                    id = request.Id
                });
                return new CommonResultDto<bool>(true);
            }
            catch (Exception ex)
            {

                return new CommonResultDto<bool>(ex.ToString());
            }
        }
        #endregion
    }
}
