﻿using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.DichVu;
using newPMS.Entities.TableDungChung;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace newPMS.EntityFrameworkCore
{
    /* This is your actual DbContext used on runtime.
     * It includes only your entities.
     * It does not include entities of the used modules, because each module has already
     * its own DbContext class. If you want to share some database tables with the used modules,
     * just create a structure like done for AppUser.
     *
     * Don't use this DbContext for database migrations since it does not contain tables of the
     * used modules (as explained above). See BaseMigrationsDbContext for migrations.
     */

    [ConnectionStringName(ConectionStringName.TravelTicket)]
    public class BaseDbContext : AbpDbContext<BaseDbContext>
    {
        #region "Danh mục dùng chung"

        public virtual DbSet<TepDinhKemEntity> TepDinhKemEntity { get; set; }
        public virtual DbSet<ConfigSystemEntity> ConfigSystemEntity { get; set; }
        public virtual DbSet<CodeSystemEntity> CodeSystemEntity { get; set; }
        public virtual DbSet<CodeSystemMapEntity> CodeSystemMapEntity { get; set; }
        public virtual DbSet<DanhMucTinhEntity> DanhMucTinhEntity { get; set; }
        public virtual DbSet<DanhMucHuyenEntity> DanhMucHuyenEntity { get; set; }
        public virtual DbSet<DanhMucXaEntity> DanhMucXaEntity { get; set; }
        public virtual DbSet<DanhMucQuocGiaEntity> DanhMucQuocGiaEntity { get; set; }
        public virtual DbSet<NhaCungCapEntity> NhaCungCapEntity { get; set; }
        #endregion "Danh mục dùng chung"

        #region Dịch vụ
        public virtual DbSet<DichVuHangPhongEntity> DichVuHangPhongEntity { get; set; }
        public virtual DbSet<DichVuGiaPhongEntity> DichVuGiaPhongEntity { get; set; }
        public virtual DbSet<DichVuCungCapXeEntity> DichVuCungCapXeEntity { get; set; }
        public virtual DbSet<DichVuNhaHangEntity> DichVuNhaHangEnity { get; set; }
        #endregion

        #region Quản lý tài khoản
        public virtual DbSet<SysRoleEntity> SysRoleEntity { get; set; }
        public virtual DbSet<SysRoleLevelEntity> SysRoleLevelEntity { get; set; }
        public virtual DbSet<SysPermissionAdminEntity> SysPermissionAdminEntity { get; set; }
        public virtual DbSet<SysUserRoleEntity> SysUserRoleEntity { get; set; }
        public virtual DbSet<SysUserEntity> SysUserEntity { get; set; }
        public virtual DbSet<SysOrganizationunits> SysOrganizationunits { get; set; }
        public virtual DbSet<SysOrganizationunitsUser> SysOrganizationunitsUser { get; set; }
        public virtual DbSet<SysNotificationsEntity> SysNotifications { get; set; }
        public virtual DbSet<UserFireBaseTokenEntity> UserFireBaseTokenEntity { get; set; }
        #endregion
      
        #region "Công việc"
        public virtual DbSet<CongViecEntity> CongViecEntity { get; set; }
        public virtual DbSet<CongViecUserEntity> CongViecUserEntity { get; set; }
        public virtual DbSet<CongViecTraoDoiEntity> CongViecTraoDoiEntity { get; set; }
        public virtual DbSet<CongViecLichSuEntity> CongViecLichSuEntity { get; set; }
        #endregion

        /* Add DbSet properties for your Aggregate Roots / Entities here.
         * Also map them inside newPMSDbContextModelCreatingExtensions.ConfigurenewPMS
         */

        public BaseDbContext(DbContextOptions<BaseDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /* Configure the shared tables (with included modules) here */

            //builder.Entity<AppUser>(b =>
            //{
            //    b.ToTable(AbpIdentityDbProperties.DbTablePrefix + "Users"); //Sharing the same table "AbpUsers" with the IdentityUser

            //    b.ConfigureByConvention();
            //    b.ConfigureAbpUser();

            //    /* Configure mappings for your additional properties.
            //     * Also see the newPMSEfCoreEntityExtensionMappings class.
            //     */
            //});
             
            /* Configure your own tables/entities inside the ConfigurenewPMS method */

            builder.ConfigureBase();
        }
    }
}