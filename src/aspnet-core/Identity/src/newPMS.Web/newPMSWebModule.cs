using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authentication.Twitter;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using newPMS.EntityFrameworkCore;
using newPMS.Localization;
using newPMS.Permissions;
using newPMS.Web.HealthChecks;
using newPMS.Web.Menus;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Volo.Abp;
using Volo.Abp.Account.Admin.Web;
using Volo.Abp.Account.Public.Web.ExternalProviders;
using Volo.Abp.Account.Web;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Lepton;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Lepton.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;
using Volo.Abp.Auditing;
using Volo.Abp.AuditLogging.Web;
using Volo.Abp.Autofac;
using Volo.Abp.AutoMapper;
using Volo.Abp.Caching;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.Identity.Web;
using Volo.Abp.IdentityServer.Web;
using Volo.Abp.LanguageManagement;
using Volo.Abp.LeptonTheme.Management;
using Volo.Abp.Modularity;
using Volo.Abp.TextTemplateManagement.Web;
using Volo.Abp.Timing;
using Volo.Abp.UI.Navigation;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;
using Volo.Saas.Host;
using newPMSIdentiy.MultiTenancy;
using Volo.Abp.Swashbuckle;
using Volo.Abp.MultiTenancy;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using StackExchange.Redis;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Volo.Abp.Account;

namespace newPMS.Web
{
    [DependsOn(
        typeof(newPMSHttpApiModule),
        typeof(newPMSApplicationModule),
        typeof(newPMSEntityFrameworkCoreDbMigrationsModule),
        typeof(AbpAutofacModule),
        typeof(AbpIdentityWebModule),
        typeof(AbpAccountPublicWebIdentityServerModule),
        typeof(AbpAuditLoggingWebModule),
        typeof(LeptonThemeManagementWebModule),
        typeof(SaasHostWebModule),
        typeof(AbpAccountAdminWebModule),
        typeof(AbpIdentityServerWebModule),
        typeof(LanguageManagementWebModule),
        typeof(AbpAspNetCoreMvcUiLeptonThemeModule),
        typeof(TextTemplateManagementWebModule),
        typeof(AbpSwashbuckleModule),
        //typeof(AbpAspNetCoreSerilogModule)
        typeof(AbpCachingStackExchangeRedisModule),
           typeof(AbpCachingModule),
        typeof(QuanLyTaiKhoanApplicationModule),
        typeof(SharedApplicationModule),
        typeof(BaseEntityFrameworkCoreModule)
        )]
    public class newPMSWebModule : AbpModule
    {
        private const string DefaultCorsPolicyName = "Default";
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
            {
                options.AddAssemblyResource(
                    typeof(newPMSResource),
                    typeof(newPMSDomainModule).Assembly,
                    typeof(newPMSDomainSharedModule).Assembly,
                    typeof(newPMSApplicationModule).Assembly,
                    typeof(newPMSApplicationContractsModule).Assembly,
                    typeof(newPMSWebModule).Assembly
                );
            });
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var hostingEnvironment = context.Services.GetHostingEnvironment();
            var configuration = context.Services.GetConfiguration();



            ConfigureBundles();
            ConfigureUrls(configuration);
            ConfigurePages(configuration);
            ConfigureAuthentication(context, configuration);
            ConfigureAutoMapper();
            ConfigureVirtualFileSystem(hostingEnvironment);
            ConfigureNavigationServices();
            ConfigureAutoApiControllers();
            ConfigureSwaggerServices(context.Services);
            ConfigureExternalProviders(context);
            ConfigureHealthChecks(context);

            #region Custom
            Configure<AbpTenantResolveOptions>(options =>
            {
                var temp = configuration["AuthServer:Authority"];
                UriBuilder ub = new UriBuilder(temp);
                var urlSimple = ub.Host.Replace("www.", "");
                options.AddDomainTenantResolver("{0}." + urlSimple);
            });

            context.Services.ConfigureNonBreakingSameSiteCookies();
            ConfigureCors(context, configuration);


            ConfigureRedis(context, configuration, hostingEnvironment);

            Configure<AbpClockOptions>(options =>
            {
                options.Kind = DateTimeKind.Local;
            });

            Configure<AbpAuditingOptions>(options =>
            {
                options.IsEnabled = true; //Disables the auditing system
            });
            //// add session support
            //context.Services.AddSession(options =>
            //{
            //    options.IdleTimeout = TimeSpan.FromMinutes(30);
            //    options.Cookie.HttpOnly = true;
            //});
            #endregion
        }


        private void ConfigureHealthChecks(ServiceConfigurationContext context)
        {
            context.Services.AddnewPMSHealthChecks();
        }

        private void ConfigureBundles()
        {
            Configure<AbpBundlingOptions>(options =>
            {
                options.StyleBundles.Configure(
                    LeptonThemeBundles.Styles.Global,
                    bundle =>
                    {
                        bundle.AddFiles("/global-styles.css");
                    }
                );
            });
        }

        private void ConfigurePages(IConfiguration configuration)
        {
            Configure<RazorPagesOptions>(options =>
            {
                options.Conventions.AuthorizePage("/HostDashboard", newPMSPermissions.Dashboard.Host);
                options.Conventions.AuthorizePage("/TenantDashboard", newPMSPermissions.Dashboard.Tenant);
            });
        }

        private void ConfigureUrls(IConfiguration configuration)
        {
            Configure<AppUrlOptions>(options =>
            {
                options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
                /*                options.Applications["newPMS"].Urls[AccountUrlNames.PasswordReset] = "https://qcc-api.orenda.vn/account/resetpassword";
                                options.Applications["newPMS"].Urls[AccountUrlNames.EmailConfirmation] = "https://qcc-api.orenda.vn/account/email-confirmation";*/
                //options.Applications["Angular"].RootUrl = configuration["App:AngularUrl"];
                //options.Applications["Angular"].Urls[AccountUrlNames.PasswordReset] = "account/reset-password";
                //options.Applications["Angular"].Urls[AccountUrlNames.EmailConfirmation] = "account/email-confirmation";
            });
        }

        private void ConfigureAuthentication(ServiceConfigurationContext context, IConfiguration configuration)
        {
            var issuer = configuration["AuthServer:Authority"];
            var key = issuer + "TravelTicket-2e7a1e80-16ee-4e52-b5c6-5e8892453459";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            context.Services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.Authority = configuration["AuthServer:Authority"];
                    options.RequireHttpsMetadata = Convert.ToBoolean(configuration["AuthServer:RequireHttpsMetadata"]); ;
                    options.Audience = "newPMS";
                });

            //context.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //    .AddJwtBearer(options =>
            //    {
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateIssuerSigningKey = true,
            //            ValidateLifetime = true,
            //            ClockSkew = TimeSpan.Zero,
            //            ValidIssuer = issuer,
            //            ValidAudience = issuer,
            //            IssuerSigningKey = securityKey,
            //        };
            //    });

            //context.Services.AddAuthentication()
            //    .AddJwtBearer(options =>
            //    {
            //        options.Authority = configuration["AuthServer:Authority"];
            //        options.RequireHttpsMetadata = Convert.ToBoolean(configuration["AuthServer:RequireHttpsMetadata"]); ;
            //        options.Audience = "newPMS";
            //    });
        }

        private void ConfigureAutoMapper()
        {
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<newPMSWebModule>();
            });
        }

        private void ConfigureVirtualFileSystem(IWebHostEnvironment hostingEnvironment)
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.AddEmbedded<newPMSWebModule>();

                if (hostingEnvironment.IsDevelopment())
                {
                    options.FileSets.ReplaceEmbeddedByPhysical<newPMSDomainSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}newPMS.Domain.Shared", Path.DirectorySeparatorChar)));
                    options.FileSets.ReplaceEmbeddedByPhysical<newPMSDomainModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}newPMS.Domain", Path.DirectorySeparatorChar)));
                    options.FileSets.ReplaceEmbeddedByPhysical<newPMSApplicationContractsModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}newPMS.Application.Contracts", Path.DirectorySeparatorChar)));
                    options.FileSets.ReplaceEmbeddedByPhysical<newPMSApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}newPMS.Application", Path.DirectorySeparatorChar)));
                    options.FileSets.ReplaceEmbeddedByPhysical<newPMSHttpApiModule>(Path.Combine(hostingEnvironment.ContentRootPath, string.Format("..{0}..{0}src{0}newPMS.HttpApi", Path.DirectorySeparatorChar)));
                    options.FileSets.ReplaceEmbeddedByPhysical<newPMSWebModule>(hostingEnvironment.ContentRootPath);
                }
            });
        }

        private void ConfigureNavigationServices()
        {
            Configure<AbpNavigationOptions>(options =>
            {
                options.MenuContributors.Add(new newPMSMenuContributor());
            });

            Configure<AbpToolbarOptions>(options =>
            {
                options.Contributors.Add(new newPMSToolbarContributor());
            });
        }

        private void ConfigureAutoApiControllers()
        {
            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(newPMSApplicationModule).Assembly);
            });
        }

        private void ConfigureSwaggerServices(IServiceCollection services)
        {
            services.AddSwaggerGen(
                options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo { Title = "newPMS API", Version = "v1" });
                    options.DocInclusionPredicate((docName, description) => true);
                    options.CustomSchemaIds(type => type.FullName);
                }
            );
        }

        private void ConfigureExternalProviders(ServiceConfigurationContext context)
        {
            context.Services.AddAuthentication()
                .AddGoogle(GoogleDefaults.AuthenticationScheme, _ => { })
                .WithDynamicOptions<GoogleOptions, GoogleHandler>(
                    GoogleDefaults.AuthenticationScheme,
                    options =>
                    {
                        options.WithProperty(x => x.ClientId);
                        options.WithProperty(x => x.ClientSecret, isSecret: true);
                    }
                )
                .AddMicrosoftAccount(MicrosoftAccountDefaults.AuthenticationScheme, options =>
                {
                    //Personal Microsoft accounts as an example.
                    options.AuthorizationEndpoint = "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize";
                    options.TokenEndpoint = "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";
                })
                .WithDynamicOptions<MicrosoftAccountOptions, MicrosoftAccountHandler>(
                    MicrosoftAccountDefaults.AuthenticationScheme,
                    options =>
                    {
                        options.WithProperty(x => x.ClientId);
                        options.WithProperty(x => x.ClientSecret, isSecret: true);
                    }
                )
                .AddTwitter(TwitterDefaults.AuthenticationScheme, options => options.RetrieveUserDetails = true)
                .WithDynamicOptions<TwitterOptions, TwitterHandler>(
                    TwitterDefaults.AuthenticationScheme,
                    options =>
                    {
                        options.WithProperty(x => x.ConsumerKey);
                        options.WithProperty(x => x.ConsumerSecret, isSecret: true);
                    }
                );
        }

        private void ConfigureCors(ServiceConfigurationContext context, IConfiguration configuration)
        {
            context.Services.AddCors(options =>
            {
                options.AddPolicy(DefaultCorsPolicyName, builder =>
                {
                    builder
                        .WithOrigins(
                            configuration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        ).WithOrigins("http://192.168.3.32:6767")
                        .WithAbpExposedHeaders()
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
        }
            private void ConfigureRedis(
            ServiceConfigurationContext context,
            IConfiguration configuration,
            IWebHostEnvironment hostingEnvironment)
            {
                Configure<AbpDistributedCacheOptions>(options =>
                {
                    options.KeyPrefix = "TravelTicketWebApp:";
                });

                var redisConfiguration = ConfigurationOptions.Parse(configuration["Redis:Configuration"]);
                redisConfiguration.AbortOnConnectFail = false; 

                var redis = ConnectionMultiplexer.Connect(redisConfiguration);

                context.Services
                    .AddDataProtection()
                    .PersistKeysToStackExchangeRedis(redis, "TravelTicketWebApp-Protection-Keys");
            }


        public override void OnApplicationInitialization(ApplicationInitializationContext context)
        {
            var app = context.GetApplicationBuilder();
            var env = context.GetEnvironment();
            var configuration = context.GetConfiguration();
            if (Directory.Exists("" + configuration["FileUploads:RootVolume"] + ""))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider("" + configuration["FileUploads:RootVolume"] + ""),
                    RequestPath = "/Files"
                });
            }
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAbpRequestLocalization();

            if (!env.IsDevelopment())
            {
                app.UseErrorPage();
                app.UseHsts();
            }
            //Bo sung
            app.UseCors(DefaultCorsPolicyName);
            // add session support
            //app.UseSession();

            app.UseHttpsRedirection();
            app.UseCorrelationId();
            app.UseStaticFiles();
            app.UseRouting();
            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllerRoute(
            //        name: "Default",
            //        pattern: "{controller}/{action}/{id}",
            //        defaults: new { controller = "Home", action = "Index" },
            //        null,
            //        dataTokens: new[] { "newPMS.Web.Controllers" }
            //        );
            //});
            // Add this before any other middleware that might write cookies
            app.UseCookiePolicy();
            // This will write cookies, so make sure it's after the cookie policy
            app.UseAuthentication();
            app.UseJwtTokenMiddleware();

            if (MultiTenancyConsts.IsEnabled)
            {
                app.UseMultiTenancy();
            }

            app.UseUnitOfWork();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseSwagger();
            app.UseAbpSwaggerUI(options =>
            {
                var listApi = new List<Tuple<string, string>>()
                {
                    new Tuple<string, string>("ngoai-kiem","Ngoại kiểm"),
                    //new Tuple<string, string>("chuyen-mon","Chuyên môn"),
                    //new Tuple<string, string>("portal","Quản lý bài viết"),
                    //new Tuple<string, string>("phong-kham","Phòng khám"),
                };
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "newPMS API");
                foreach (var api in listApi)
                {
                    options.SwaggerEndpoint($"/api/{api.Item1}/swagger/v1/swagger.json", $"API module: {api.Item2}");
                }
            });
            app.UseAuditing();
            //app.UseAbpSerilogEnrichers();
            app.UseConfiguredEndpoints();
        }

    }
}
