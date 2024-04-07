using AutoMapper;
using newPMS.QuanLyTaiKhoan.Dtos;
using newPMS.Entities;
using newPMS.QuanTriHeThong.Dtos;
using Volo.Abp.Identity;

namespace newPMS
{
    public class QuanLyTaiKhoanApplicationAutoMapperProfile : Profile
    {
        public QuanLyTaiKhoanApplicationAutoMapperProfile()
        {
            //SYS
            CreateMap<SysRoleDto, SysRoleEntity>().ReverseMap();
            //CreateMap<RoleLevelDto, RoleLevelEntity>().ReverseMap();
            CreateMap<SysPermissionAdminDto, SysPermissionAdminEntity>().ReverseMap();
            CreateMap<SysUserDto, SysUserEntity>().ReverseMap();
            CreateMap<CreateOrUpdateSysUserDto, SysUserEntity>().ReverseMap();
            CreateMap<ImportUserDto, SysUserEntity>().ReverseMap();
            CreateMap<IdentityRoleDto, IdentityRole>().ReverseMap();
            //CreateMap<IdentityUserCreateDto, IdentityUser>().ReverseMap();
            //CreateMap<IdentityUserUpdateDto, IdentityUser>().ReverseMap();
            CreateMap<AbpUserMapCreateDto, IdentityUser>().ReverseMap();
            CreateMap<AbpUserMapUpdateDto, IdentityUser>().ReverseMap();
            CreateMap<SysOrganizationunitsDto, SysOrganizationunits>().ReverseMap();
            CreateMap<OrganizationUnitCreateDto, OrganizationUnit>().ReverseMap();
            CreateMap<AbpOrganizationUnitDto, OrganizationUnit>().ReverseMap();
        }
    }
}