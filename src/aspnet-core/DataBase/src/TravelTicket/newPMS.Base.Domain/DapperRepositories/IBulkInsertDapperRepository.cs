using newPMS.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace newPMS.DapperRepositories
{
    public interface IBulkInsertDapperRepository : ITransientDependency
    {
        Task CommonBase(string sql, object[] prm);
        Task SysPermissionAdmin(IEnumerable<SysPermissionAdminEntity> entities);
        Task SysUserRole(IEnumerable<SysUserRoleEntity> entities);
    }
}
