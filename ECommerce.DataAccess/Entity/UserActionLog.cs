namespace ECommerce.DataAccess.Entity
{
    public class UserActionLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? ActionType { get; set; }
        public string? Message { get; set; }
        public DateTime TimeStamp { get; set; }

    }
}
