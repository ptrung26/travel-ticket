using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.DanhMuc.NhaCungCap;
using newPMS.Entities.DichVu;
using newPMS.Entities.TableDungChung;
using Volo.Abp;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace newPMS.EntityFrameworkCore
{
    public static class BaseDbContextModelCreatingExtensions
    {
        public static void ConfigureBase(this ModelBuilder builder)
        {
            Check.NotNull(builder, nameof(builder));

            #region "Danh mục dùng chung"

            builder.Entity<TepDinhKemEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<ConfigSystemEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<CodeSystemEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<CodeSystemMapEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<DanhMucTinhEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<DanhMucHuyenEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<DanhMucXaEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<DanhMucQuocGiaEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<NhaCungCapEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<NhaCungCapKhachSanEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            #endregion

            #region Dịch vụ
            builder.Entity<DichVuHangPhongEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<DichVuGiaPhongEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });

            builder.Entity<DichVuCungCapXeEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });

            builder.Entity<DichVuNhaHangEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });

            #endregion

            #region Quản lý tài khoản

            builder.Entity<SysRoleEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysRoleLevelEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysPermissionAdminEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysUserRoleEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysUserEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysOrganizationunits>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysOrganizationunitsUser>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<SysNotificationsEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            builder.Entity<UserFireBaseTokenEntity>(b =>
            {
                b.ConfigureByConvention();
                // index
            });
            #endregion

            #region Sản phẩm 
            builder.Entity<TourSanPhamEntity>(b =>
            {
                b.ConfigureByConvention();
            });
            #endregion

            #region "Công việc"
            builder.Entity<CongViecEntity>(b =>
                    {
                        b.ConfigureByConvention();
                    });
            builder.Entity<CongViecUserEntity>(b =>
            {
                b.ConfigureByConvention();
            });
            builder.Entity<CongViecTraoDoiEntity>(b =>
            {
                b.ConfigureByConvention();
            });
            builder.Entity<CongViecLichSuEntity>(b =>
            {
                b.ConfigureByConvention();
            });
            #endregion



            /* Configure your own tables/entities inside here */

            //builder.Entity<YourEntity>(b =>
            //{
            //    b.ToTable(BaseConsts.DbTablePrefix + "YourEntities", BaseConsts.DbSchema);
            //    b.ConfigureByConvention(); //auto configure for the base class props
            //    //...
            //});

            //if (builder.IsHostDatabase())
            //{
            //    /* Tip: Configure mappings like that for the entities only available in the host side,
            //     * but should not be in the tenant databases. */
            //}
        }
    }
}