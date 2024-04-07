using newPMS.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Identity;
using static newPMS.CommonEnum;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class SysUserDto : EntityDto<long>
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Ma { get; set; }
        #region Thông tin của người dùng
        [StringLength(200)]
        public string HoTen { get; set; }
        [StringLength(200)]
        public string HoTenKhongDau { get; set; }
        [StringLength(500)]
        public string Email { get; set; }
        [StringLength(20)]
        public string SoDienThoai { get; set; }
        #endregion
        public long? KhachHangId { get; set; }
        public long? PhongBanId { get; set; }
        public int? Level { get; set; }
        public string ListRoleName { get; set; }
        public string StrLevel
        {
            get
            {
                return Level.HasValue ? CommonEnum.GetEnumDescription((LEVEL)(int)Level) : "";
            }
        }


        #region Thông tin cơ sở

        public string MaCoSo { get; set; }
        public string TenCoSo { get; set; }
        public string TenTinh { get; set; }
        public string TenHuyen { get; set; }
        public string TenXa { get; set; }
        public bool IsCreator { get; set; } = false;
        public bool IsLock { get; set; } = false;
        public long? TinhId { get; set; }
        public long? HuyenId { get; set; }
        public DateTime? CreationTime { get; set; }

        #endregion
        public SysUserDto()
        {

        }
    }

    public class AbpUserMapCreateDto : IdentityUserCreateDto
    {
        public string PasswordHash { get; set; }
    }
    public class AbpUserMapUpdateDto : IdentityUserUpdateDto
    {
        public string PasswordHash { get; set; }
    }

    public class SysUserPermissionDto
    {
        public Guid UserId { get; set; }
        public long SysUserId { get; set; }
        public long? KhachHangId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string SurName { get; set; }
        public string Avatar { get; set; } //Lưu ảnh đại diện vào đây
        public List<string> PermissionNames { get; set; }
        public string RoleMobile { get; set; }
    }
}
