namespace newPMS.Account.Dtos
{
    public class LoginResultDto
    {
        public bool IsSuccessful { get; set; } = false;
        public string ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public AuthJwtDto AuthJwtDto { get; set; }
    }
}
