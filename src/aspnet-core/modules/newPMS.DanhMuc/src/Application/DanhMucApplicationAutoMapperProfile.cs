using AutoMapper;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;

namespace newPMS
{
    public class DanhMucApplicationAutoMapperProfile : Profile
    {
        public DanhMucApplicationAutoMapperProfile()
        {
            CreateMap<HuyenDto, DanhMucHuyenEntity>().ReverseMap();
            CreateMap<TinhDto, DanhMucTinhEntity>().ReverseMap();
            CreateMap<XaDto, DanhMucXaEntity>().ReverseMap();
            CreateMap<QuocTichDto, DanhMucQuocGiaEntity>().ReverseMap();
            CreateMap<NhaCungCapDto, NhaCungCapEntity>().ReverseMap();
            CreateMap<TepDinhKemEntity, TepDinhKemDto>().ReverseMap();
            CreateMap<CodeSystemEntity, CodeSystemDto>().ReverseMap();
            CreateMap<ConfigSystemEntity, ConfigSystemDto>().ReverseMap();
            CreateMap<CodeSystemEntity, CheckValidImportExcelCodeSystemDto>().ReverseMap();
        }
    }
}