using AutoMapper;
using newPMS.CongViec.Dtos;
using newPMS.CongViec.Request;
using newPMS.Entities;

namespace newPMS
{
    public class CongViecApplicationAutoMapperProfile : Profile
    {
        public CongViecApplicationAutoMapperProfile()
        {
            CreateMap<CongViecDto, CongViecEntity>().ReverseMap();
            CreateMap<CreateOrUpdateCongViecRequest, CongViecEntity>().ReverseMap();
            CreateMap<CongViecUserDto, CongViecUserEntity>().ReverseMap();
            CreateMap<CongViecEntity, CongViecDto>().ReverseMap();
            CreateMap<TraoDoiCongViecDto, CongViecTraoDoiEntity>().ReverseMap();

        }
    }
}