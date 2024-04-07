using AutoMapper;
using newPMS.Users;
using Volo.Abp.AutoMapper;

namespace newPMS
{
    public class newPMSApplicationAutoMapperProfile : Profile
    {
        public newPMSApplicationAutoMapperProfile()
        {
            /* You can configure your AutoMapper mapping configuration here.
             * Alternatively, you can split your mapping configurations
             * into multiple profile classes for a better organization. */

            CreateMap<AppUser, AppUserDto>().Ignore(x => x.ExtraProperties);
        }
    }
}