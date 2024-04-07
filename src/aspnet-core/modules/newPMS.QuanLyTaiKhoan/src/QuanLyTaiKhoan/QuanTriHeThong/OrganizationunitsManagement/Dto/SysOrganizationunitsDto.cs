using newPMS.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;
using static newPMS.CommonEnum;

namespace newPMS.QuanLyTaiKhoan.Dtos
{
    public class SysOrganizationunitsDto : SysOrganizationunits
    {
        public long Id { get; set; }
        public int? CountUser { get; set; }
        public Guid CreatorId { get; set; }
        public int Level { get; set; }
        public List<SysOrganizationunitsDto> ListSysOrganizationunits { get; set; }
    }  


    
    public class AbpOrganizationUnitDto //: FullAuditedAggregateRoot<Guid>
    {
        public Guid Id { get; set; }
        public Guid? TenantId { get; set; }
        public Guid? ParentId { get; set; }
        public string Code { get; set; }
        public string DisplayName { get; set; }
        public bool IsDeleted { get; set; }
        public Guid? DeleterId { get; set; }
        public DateTime? DeletionTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
        public Guid? LastModifierId { get; set; }
        public DateTime CreationTime { get; set; }
        public Guid? CreatorId { get; set; }
        //public ExtraPropertyDictionary ExtraProperties { get; set; }
        public string ConcurrencyStamp { get; set; }

    }

    #region Nhân viên - phòng ban
    public class SysOrganizationunitsUserDto : SysOrganizationunitsUser
    {
        //Nhân viên
        public Guid AbpUserId { get; set; }
        public string MaNhanVien { get; set; }
        public string TenNhanVien { get; set; }
        public string Email { get; set; }
        public string SoDienThoai { get; set; }
        //Phòng ban
        public Guid AbpOrganizationunitsId { get; set; }
        public string MaPhongBan { get; set; }
        public string TenPhongBan { get; set; }
        public string ListRoleName { get; set; }
        
    }

    public class GetListUserOrganizationunitDto
    {
        public List<SysOrganizationunitsUserDto> ArrUsers { get; set; }
        public long? SysOrganizationunitsId { get; set; }
        public Guid AbpOrganizationunitsId { get; set; }
    }
    #endregion

}
