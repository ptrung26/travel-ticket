//using Microsoft.AspNetCore.Mvc.ApplicationModels;
//using Microsoft.Extensions.Options;
//using System;
//using Volo.Abp.AspNetCore.Mvc;
//using Volo.Abp.AspNetCore.Mvc.Conventions;
//using Volo.Abp.DependencyInjection;

//namespace Ord.Niis.ReplaceServices
//{
//    [Dependency(ReplaceServices = true)]
//    [ExposeServices(typeof(IAbpServiceConvention))]
//    public class CustomAbpServiceConvention : AbpServiceConvention
//    {
//        public CustomAbpServiceConvention(IOptions<AbpAspNetCoreMvcOptions> options, IConventionalRouteBuilder conventionalRouteBuilder) : base(options , conventionalRouteBuilder)
//        {
//        }

//        protected override string SelectHttpMethod(ActionModel action, ConventionalControllerSetting configuration)
//        {
//            if (action.ActionName.StartsWith("GetList", StringComparison.OrdinalIgnoreCase))
//            {
//                return "POST";
//            }
//            return action.ActionName.StartsWith("Get", StringComparison.OrdinalIgnoreCase) ? "GET" : "POST";
//        }
//    }
//}
