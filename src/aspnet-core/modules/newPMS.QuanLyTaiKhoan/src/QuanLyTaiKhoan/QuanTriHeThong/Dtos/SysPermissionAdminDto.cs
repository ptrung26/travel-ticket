using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace newPMS.QuanTriHeThong.Dtos
{
    public class SysPermissionAdminDto: EntityDto<int>
    {
        public long SysRoleId { get; set; }
        /// <summary>
        ///  tên quyền
        /// </summary>
        [StringLength(500)]
        public string Name { get; set; }
    }
}
