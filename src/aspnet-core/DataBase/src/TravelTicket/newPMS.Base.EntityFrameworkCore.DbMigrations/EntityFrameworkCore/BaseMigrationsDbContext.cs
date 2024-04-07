using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace newPMS.EntityFrameworkCore
{
    /* This DbContext is only used for database migrations.
     * It is not used on runtime. See BaseDbContext for the runtime DbContext.
     * It is a unified model that includes configuration for
     * all used modules and your application.
     */
    [ConnectionStringName("TravelTicket")]
    public class BaseMigrationsDbContext : AbpDbContext<BaseMigrationsDbContext>
    {
        public BaseMigrationsDbContext(DbContextOptions<BaseMigrationsDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ConfigureBase();
        }
    }
}