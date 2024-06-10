using AutoMapper;
using newPMS.Booking.DichVuLe.Dtos;
using newPMS.Booking.Dtos;
using newPMS.Booking.ThanhVienDoan.Dtos;
using newPMS.DanhMuc.Dtos;
using newPMS.DanhMucChung.DichVu.DichVuPhong.Dtos;
using newPMS.DanhMucChung.Dtos;
using newPMS.Entities;
using newPMS.Entities.Booking;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities.DichVu;

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
            CreateMap<CreateOrUpdateNhaCungCapXeDto, NhaCungCapXeEntity>().ReverseMap();
            CreateMap<NhaCungCapXeEntity, CreateOrUpdateNhaCungCapXeDto>().ReverseMap();

            CreateMap<DichVuCungCapXeEntity, CreateOrUpdateDichVuXeDto>().ReverseMap();
            CreateMap<CreateOrUpdateDichVuXeDto, DichVuCungCapXeEntity>().ReverseMap();
            CreateMap<DichVuXeDto, DichVuCungCapXeEntity>().ReverseMap();
            CreateMap<DichVuCungCapXeEntity, DichVuXeDto>().ReverseMap();

            CreateMap<DichVuVeDto, DichVuVeEntity>().ReverseMap();
            CreateMap<DichVuVeEntity, DichVuVeDto>().ReverseMap();
            CreateMap<CreateOrUpdateNhaCungCapVeDto, NhaCungCapVeEntity>().ReverseMap(); 
            CreateMap<NhaCungCapVeEntity, CreateOrUpdateNhaCungCapVeDto>().ReverseMap();
            CreateMap<NhaCungCapVeDto, NhaCungCapVeEntity>().ReverseMap();
            CreateMap<NhaCungCapVeEntity, NhaCungCapVeDto>().ReverseMap();

            CreateMap<DichVuVeDto, DichVuVeEntity>().ReverseMap();
            CreateMap<DichVuVeEntity, DichVuVeDto>().ReverseMap();
            CreateMap<CreateOrUpdateDichVuVeDto, DichVuVeEntity>().ReverseMap();

            CreateMap<CreateOrUpdateHangPhongDto, DichVuHangPhongEntity >().ReverseMap();
            CreateMap<DichVuHangPhongEntity, CreateOrUpdateHangPhongDto>().ReverseMap();
            CreateMap<CreateOrUpDateDichVuGiaPhongDto, DichVuGiaPhongEntity>().ReverseMap();
            CreateMap<DichVuGiaPhongEntity, CreateOrUpDateDichVuGiaPhongDto>().ReverseMap();

            CreateMap<NguoiLienHeNCCDto, NguoiLienHeNCCEntity>().ReverseMap();
            CreateMap<NguoiLienHeNCCEntity, NguoiLienHeNCCDto>().ReverseMap();

            CreateMap<DichVuHangPhongDto, DichVuHangPhongEntity>().ReverseMap();
            CreateMap<DichVuHangPhongEntity, DichVuHangPhongDto>().ReverseMap();
            CreateMap<DichVuGiaPhongDto, DichVuGiaPhongEntity>().ReverseMap();
            CreateMap<DichVuGiaPhongEntity, DichVuGiaPhongDto>().ReverseMap();

            CreateMap<HopDongNCCDto, HopDongNCCEntity>().ReverseMap();
            CreateMap<HopDongNCCEntity, HopDongNCCDto>().ReverseMap();


            #endregion


            #region Booking
            CreateMap<BookingDichVuTourEntity, DichVuBookingTourDto>().ReverseMap();
            CreateMap<DichVuBookingTourDto, BookingDichVuTourEntity>().ReverseMap();

            CreateMap<ChiTietDichVuBookingTourDto, ChiTietBookingDichVuTourEntity>().ReverseMap();
            CreateMap<ChiTietBookingDichVuTourEntity, ChiTietDichVuBookingTourDto>().ReverseMap();

            CreateMap<CreateOrUpdatThongTinBookingDto, BookingEntity>().ReverseMap();
            CreateMap<BookingEntity, CreateOrUpdatThongTinBookingDto>().ReverseMap();

            CreateMap<CreateOrUpdateDichVuBookingTourDto, BookingDichVuTourEntity>().ReverseMap();
            CreateMap<BookingDichVuTourEntity, CreateOrUpdateDichVuBookingTourDto>().ReverseMap();

            CreateMap<CrudChiTietDichVuBookingTour, ChiTietBookingDichVuTourEntity>().ReverseMap();
            CreateMap<ChiTietBookingDichVuTourEntity, CrudChiTietDichVuBookingTour>().ReverseMap();

            CreateMap<ThongTinChungBookingDto, BookingEntity>().ReverseMap();
            CreateMap<BookingEntity, ThongTinChungBookingDto>().ReverseMap();

            CreateMap<ChiTietBookingDichVuLeEntity, CreateOrUpdateDichVuBookingLeDto>();
            CreateMap<CreateOrUpdateDichVuBookingLeDto, ChiTietBookingDichVuLeEntity>();

            CreateMap<ChiTietThanhVienDoanDto, ChiTietThanhVienDoanBooking>();
            CreateMap<ChiTietThanhVienDoanBooking, ChiTietThanhVienDoanDto>();

            CreateMap<ChiTietDichVuLeBookingDto, ChiTietBookingDichVuLeEntity>();
            CreateMap<ChiTietBookingDichVuLeEntity, ChiTietDichVuLeBookingDto>();


            #endregion
        }
    }
}