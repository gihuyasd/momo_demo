using System.ComponentModel.DataAnnotations;

namespace api.Domain.Models
{
    public class Payment
    {
        [Key]
        public string PaymentID { get; set; } = string.Empty;
        [Required]
        public int amount { get; set; }
        public string content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
