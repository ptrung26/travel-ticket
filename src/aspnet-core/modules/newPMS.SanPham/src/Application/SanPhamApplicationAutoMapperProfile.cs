using AutoMapper;
using newPMS.Entities;
using newPMS.Entities.Booking;
using newPMS.Entities.ChietTinh;
using newPMS.Entities.KhachHang;
using newPMS.KhachHang.Dtos;
using newPMS.TourSanPham.Dtos;

namespace newPMS
{
    public class SanPhamApplicationAutoMapperProfile : Profile
    {
        public SanPhamApplicationAutoMapperProfile()
        {
            CreateMap<CreateOrUpdateTourSanPhamDto, TourSanPhamEntity>().ReverseMap();
            CreateMap<TourSanPhamEntity, CreateOrUpdateTourSanPhamDto>().ReverseMap();

            CreateMap<ChuongTrinhTourDto, ChuongTrinhTourEntity>().ReverseMap();
            CreateMap<ChuongTrinhTourEntity, ChuongTrinhTourDto>().ReverseMap();

            CreateMap<ChietTinhXeDto, ChietTinhDichVuXeEntity>().ReverseMap();
            CreateMap<ChietTinhDichVuXeEntity, ChietTinhXeDto>().ReverseMap();

            CreateMap<ChietTinhVeDto, ChietTinhDichVuVeEntity>().ReverseMap();
            CreateMap<ChietTinhDichVuVeEntity, ChietTinhVeDto>().ReverseMap();

            CreateMap<CreateOrUpdateKhachHangDto, KhachHangEntity>().ReverseMap();
            CreateMap<KhachHangEntity, CreateOrUpdateKhachHangDto>().ReverseMap();

            CreateMap<ChiTietBookingDichVuTourEntity, ChiTietBookingDichVuLeEntity>().ReverseMap();
            CreateMap<ChiTietBookingDichVuLeEntity, ChiTietBookingDichVuTourEntity>().ReverseMap();

        }
    }
}