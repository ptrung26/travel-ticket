using AutoMapper;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;

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
            CreateMap<CheckValidImportExcelQuocTichDto, DanhMucQuocGiaEntity>().ReverseMap();
            CreateMap<DanhMucQuocGiaEntity, CheckValidImportExcelQuocTichDto>().ReverseMap();
            CreateMap<CheckValidImportExcelDanhMucTinhDto, DanhMucTinhEntity>().ReverseMap();
            CreateMap<DanhMucTinhEntity, CheckValidImportExcelDanhMucTinhDto>().ReverseMap();
            CreateMap<CheckValidImportExcelDanhMucHuyenDto, DanhMucHuyenEntity>().ReverseMap();
            CreateMap<DanhMucHuyenEntity, CheckValidImportExcelDanhMucHuyenDto>().ReverseMap();
            CreateMap<XaDto, DanhMucXaEntity>().ReverseMap();
            CreateMap<NhaCungCapDto, NhaCungCapEntity>().ReverseMap();
            CreateMap<TepDinhKemEntity, TepDinhKemDto>().ReverseMap();
            CreateMap<CodeSystemEntity, CodeSystemDto>().ReverseMap();
            CreateMap<ConfigSystemEntity, ConfigSystemDto>().ReverseMap();
            CreateMap<CodeSystemEntity, CheckValidImportExcelCodeSystemDto>().ReverseMap();

            #region Nhà cung cập 
            CreateMap<NhaCungCapKhachSanEntity, CreateOrUpdateNhaCungCapKhachSanDto>().ReverseMap();
            CreateMap<CreateOrUpdateNhaCungCapKhachSanDto, NhaCungCapKhachSanEntity>().ReverseMap();
            CreateMap<NhaCungCapKhachSanDto, NhaCungCapKhachSanEntity>().ReverseMap();

            #endregion
        }
    }
}