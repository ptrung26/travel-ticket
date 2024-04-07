using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using newPMS.Entities;
using newPMS.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.Dapper;
using Volo.Abp.EntityFrameworkCore;

namespace newPMS.DapperRepositories
{
   public  class BulkInsertDapperRepository : DapperRepository<BaseDbContext>, IBulkInsertDapperRepository
    {
        public BulkInsertDapperRepository(IDbContextProvider<BaseDbContext> dbContextProvider) : base(dbContextProvider)
        {
        }

        public async Task CommonBase(string sql, object[] prm)
        {
            await DbConnection.ExecuteAsync(sql, prm, transaction: DbTransaction);
        }

        public async Task SysPermissionAdmin(IEnumerable<SysPermissionAdminEntity> entities)
        {
            var sql = $@"
            INSERT INTO SysPermissionAdmin
            (SysRoleId, Name)
            VALUES(@SysRoleId, @Name)";
            await this.CommonBase(sql, entities.ToArray());
        }
        
        public async Task SysUserRole(IEnumerable<SysUserRoleEntity> entities)
        {
            var sql = $@"
            INSERT INTO SysUserRole
            (SysRoleId, SysUserId)
            VALUES(@SysRoleId, @SysUserId)";
            await this.CommonBase(sql, entities.ToArray());
        }
        
    }
}
