using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace newPMS.EntityFrameworkCore
{
    /* This class is needed for EF Core console commands
     * (like Add-Migration and Update-Database commands) */
    public class BaseMigrationsDbContextFactory : IDesignTimeDbContextFactory<BaseMigrationsDbContext>
    {
        public BaseMigrationsDbContext CreateDbContext(string[] args)
        {
            BaseEfCoreEntityExtensionMappings.Configure();

            var configuration = BuildConfiguration();

            var builder = new DbContextOptionsBuilder<BaseMigrationsDbContext>()
                .UseMySql(configuration.GetConnectionString("TravelTicket"), MySqlServerVersion.LatestSupportedServerVersion);

            return new BaseMigrationsDbContext(builder.Options);
        }

        private static IConfigurationRoot BuildConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../newPMS.Base.DbMigrator/"))
                .AddJsonFile("appsettings.json", optional: false);

            return builder.Build();
        }
    }
}
