using System;

namespace newPMS.QuanTriHeThong.Dtos
{
    public class UserAbpDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public bool LockoutEnabled { get; set; }
        public DateTime? LockoutEnd { get; set; }
    }
}
