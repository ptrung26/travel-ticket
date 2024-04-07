using MediatR;
using newPMS.QuanTriHeThong.Dtos;
using OrdBaseApplication.Dtos;
using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class GetUserForEditOutput
    {
        public Guid? ProfilePictureId { get; set; }

        public CreateOrUpdateSysUserDto User { get; set; }

        public List<SysRoleDto> Roles { get; set; }
        //public List<RoleLevelDto> RoleLevels { get; set; }
        public List<string> ListIdSysOrganizationunits { get; set; }
        public List<AddOrRemoveSysOrganizationunits> ListAddSysOrganizationunits { get; set; }
        public List<long> ListRemoveSysOrganizationunits { get; set; }
    }

    public class AddOrRemoveSysOrganizationunits
    {
        public long SysOrganizationunitsId { get; set; }
        public long SysUserId { get; set; }
    }

    public class CreateOrUpdateUserRequest : IRequest<CommonResultDto<SysUserDto>>
    {
        public CreateOrUpdateSysUserDto UserDto { get; set; }
        //public long BenhVienId { get; set; }
        public List<long> ArrRoleIds { get; set; }
        public List<AddOrRemoveSysOrganizationunits> ListAddSysOrganizationunits { get; set; }
        public List<AddOrRemoveSysOrganizationunits> ListRemoveSysOrganizationunits { get; set; }
    }
    public class CreateMultiUserRequest
    {
        public List<CreateOrUpdateSysUserDto> ArrUserDto { get; set; }
    }
    public class DoiMatKhauRequest : IRequest<bool>
    {
        public long? SysUserId { get; set; }
        public Guid? UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }

    }



    public class GetListUserAdminCoSoRequest : PagedFullRequestDto, IRequest<PagedResultDto<SysUserDto>>
    {
        public long? TinhId { get; set; }
        public long? HuyenId { get; set; }
        public long? XaId { get; set; }
        public long? Id { get; set; }
        public long? SysRoleId { get; set; }
    }
    public class GetListUserCoSoRequest : PagedFullRequestDto, IRequest<PagedResultDto<SysUserDto>>
    {
        public long? SysRoleId { get; set; }
        public List<long?> ListSysRoleId { get; set; }
        public long? Id { get; set; }
        public long? KhachHangId { get; set; }
        public int? Level { get; set; }
        public List<int> ListLevelEnumIds { get; set; }
        public string MaTinh { get; set; }
        public string MaHuyen { get; set; }
        public string MaXa { get; set; }

    }
    public class LockUserRequest : IRequest<Guid>
    {
        public Guid UserId { get; set; }
        public bool IsLock { get; set; } = false;
    }
    public class LuuSysAppPrivateRoleUserRequset : IRequest<int>
    {
        public long SysUserId { get; set; }
        public string Code { get; set; }
    }
    public class SetRoleForUserRequest : IRequest<int>
    {
        /// <summary>
        /// Id của bảng UserExtend
        /// </summary>
        public long SysUserId { get; set; }
        public List<long> ListSysRoleId { get; set; }
    }
    public class XoaTaiKhoanRequest : IRequest<CommonResultDto<Guid>>
    {
        public Guid UserId { get; set; }

        public XoaTaiKhoanRequest(Guid id)
        {
            UserId = id;
        }
    }
    public class UserUpdateInfoRequest : IRequest<bool>
    {
        public string HoTen { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }

    }
    public class KhachHangSetPasswordRequest : IRequest<bool>
    {
        public long KhachHangId { get; set; }
        public string Password { get; set; }

    }
    public class KhoaPhongSetPasswordRequest : IRequest<bool>
    {
        public long SysUserId { get; set; }
        public string Password { get; set; }

    }
    public class TaoTaiKhoanKhoaPhongRequest : IRequest<bool>
    {
        public long Id { get; set; }
        public long KhachHangId { get; set; }
        public string UserName { get; set; }
        public string SoDienThoai { get; set; }
        public string Email { get; set; }
    }

    public class ImportMultiUserRequest
    {
        public List<ImportUserDto> ArrUserDto { get; set; }
    }
    public class ImportUserDto
    {
        public long? Id { get; set; }
        public long? UserV1Id { get; set; }
        public string UserName { get; set; }
        public string HoTen { get; set; }
        public string SurName { get; set; }
        public long? KhachHangId { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        public string MatKhau { get; set; }
        public bool? IsDeleted { get; set; }
        public string ListRole { get; set; }
    }
}
