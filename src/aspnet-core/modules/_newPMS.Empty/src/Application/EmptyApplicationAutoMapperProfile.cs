using AutoMapper;
using newPMS.ApplicationShared.SharedDtos.BenhNhanManagement;
using newPMS.Entities;
namespace newPMS
{
    public class EmptyApplicationAutoMapperProfile : Profile
    {
        public EmptyApplicationAutoMapperProfile()
        {
            //CreateMap<BenhNhanEntity, BenhNhanSharedDto>().ReverseMap();
        }
    }
}