using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities;

namespace newPMS.Entities
{
    [Table("UserFireBaseTokens")]
    public class UserFireBaseTokenEntity: Entity<long>
    {
        public  string FireBaseToken { get; set; }

        public  Guid UserId { get; set; }

        [StringLength(255)]
        public  string DeviceName { get; set; }
    }
}
