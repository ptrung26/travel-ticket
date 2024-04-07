using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using OfficeOpenXml;
using Ord.Niis.Swagger;
using StackExchange.Redis;
using System;
using System.Linq;
using Volo.Abp;
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.Auditing;
using Volo.Abp.Autofac;
using Volo.Abp.Caching;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.Timing;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.Extensions.FileProviders;
using System.IO;
using System.Text;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Autofac.Core;
using Volo.Abp.Json;

namespace Ord.Niis
{

    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(AbpCachingModule),
        typeof(AbpCachingStackExchangeRedisModule),
          typeof(AbpAspNetCoreMultiTenancyModule),
        typeof(AbpAspNetCoreMvcModule),
        typeof(AbpPermissionManagementEntityFrameworkCoreModule),
        typeof(AbpAuditLoggingEntityFrameworkCoreModule)

        )]
    public class OrdBaseHttpApiModule : AbpModule
    {
        private const string DefaultCorsPolicyName = "Default";
        //private const string CacheBaseConfig = "ViDD_Cache";


        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var hostingEnvironment = context.Services.GetHostingEnvironment();
            var configuration = context.Services.GetConfiguration();
            //context.Services.AddAntiforgery(options => options.Cookie.Name = ".AspNetCore.Antiforgery.n_cOLQTzwG4");
            //context.Services.AddAntiforgery(options => options.HeaderName = "XSRF-TOKEN");
            context.Services.AddControllers(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
            }).AddNewtonsoftJson();

            context.Services.AddSwaggerGen(
                options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo
                    {
                        Title = configuration["Service:Title"],
                        Version = "v1"
                    });
                    options.AddSecurityDefinition("Bearer",
                        new OpenApiSecurityScheme
                        {
                            In = ParameterLocation.Header,
                            Description = "Please enter into field the word 'Bearer' following by space and JWT",
                            Name = "Authorization",
                            Type = SecuritySchemeType.ApiKey
                        });
                    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] { }
                        }
                    });
                    //options.TagActionsBy((docName) => description())
                    options.DocInclusionPredicate((docName, description) => true);
                    //options.CustomSchemaIds(type => type.FullName);
                    options.ParameterFilter<SwaggerEnumParameterFilter>(); // chua thay td
                    options.SchemaFilter<SwaggerEnumSchemaFilter>();
                    options.OperationFilter<SwaggerOperationIdFilter>();
                    //options.OperationFilter<SwaggerOperationFilter>();
                    //options.CustomDefaultSchemaIdSelector();

                });


            Configure<AbpLocalizationOptions>(options =>
            {
                options.Languages.Add(new LanguageInfo("cs", "cs", "Čeština"));
                options.Languages.Add(new LanguageInfo("vi", "cs", "Čeština"));
                options.Languages.Add(new LanguageInfo("en", "en", "English"));
                options.Languages.Add(new LanguageInfo("pt-BR", "pt-BR", "Português"));
                options.Languages.Add(new LanguageInfo("sl", "sl", "Slovenščina"));
                options.Languages.Add(new LanguageInfo("tr", "tr", "Türkçe"));
                options.Languages.Add(new LanguageInfo("zh-Hans", "zh-Hans", "简体中文"));
            });
            var issuer = configuration["AuthServer:Authority"].TrimEnd('/');
            var key = issuer + "TravelTicket-2e7a1e80-16ee-4e52-b5c6-5e8892453459";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            context.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidIssuer = issuer,
                        ValidAudience = issuer,
                        IssuerSigningKey = securityKey,
                    };
                });

            //context.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //    .AddJwtBearer(options =>
            //    {
            //        options.Authority = configuration["AuthServer:Authority"];
            //        options.RequireHttpsMetadata = false;
            //        options.Audience = configuration["Service:AuthApiName"];
            //    });


            //context.Services.AddAuthentication("Bearer")
            //    .AddIdentityServerAuthentication(options =>
            //    {
            //        options.Authority = configuration["AuthServer:Authority"];
            //        options.RequireHttpsMetadata = false;
            //        options.ApiName = configuration["Service:AuthApiName"];
            //    });
            ConfigureCache(context);

            //if (!hostingEnvironment.IsDevelopment())
            //{
            //    var isUsingRedis = configuration["Redis:IsUsing"];
            //    if (isUsingRedis != null && !string.IsNullOrEmpty(isUsingRedis) && isUsingRedis.ToLower() == "true")
            //    {
            //        var redis = ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]);
            //        context.Services
            //            .AddDataProtection()
            //            .PersistKeysToStackExchangeRedis(redis, configuration["Service:Name"] + "-Protection-Keys");
            //    }
            //}

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
                        )
                        //.WithAbpExposedHeaders()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .SetIsOriginAllowedToAllowWildcardSubdomains();
                });
            });
            context.Services.AddRouting(options =>
            {
                options.LowercaseUrls = true;
                options.AppendTrailingSlash = true;
            });
            Configure<AbpClockOptions>(options =>
            {
                options.Kind = DateTimeKind.Local;
            });

            Configure<AbpAuditingOptions>(options =>
            {
                options.IsEnabled = true; //Disables the auditing system
            });
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            context.Services.Configure<AbpJsonOptions>(options =>
            {
                options.UseHybridSerializer = false;
            });

        }
        private void ConfigureCache(ServiceConfigurationContext context)
        {
            var configuration = context.Services.GetConfiguration();
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
            var configuration = context.GetConfiguration();
            if (!context.GetEnvironment().IsDevelopment())
            {
                app.UseHsts();
            }
            app.UseCorrelationId();
            app.UseStaticFiles();
            app.UseRouting();
            //app.UseCors(DefaultCorsPolicyName);
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseJwtTokenMiddleware();

            app.UseAbpClaimsMap();
            app.UseAbpRequestLocalization();
            app.UseAuthorization();

            app.UseSwagger(c =>
            {
                c.RouteTemplate = "api/" + configuration["Service:BaseUrl"] + "/swagger/{documentName}/swagger.json";

            });
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/api/" + configuration["Service:BaseUrl"] + "/swagger/v1/swagger.json", configuration["Service:Title"]);
                options.RoutePrefix = "api/" + configuration["Service:BaseUrl"] + "/swagger-ui";

            });

            app.UseAuditing();
            app.UseConfiguredEndpoints();
        }
    }
}
