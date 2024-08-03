using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class LeaveRequest
    {
        public int LeaveRequestId { get; set; }

        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Reason is required")]
        public string Reason { get; set; }

        [Required(ErrorMessage = "Leave type is required")]
        public string LeaveType { get; set; }
        
        
        [Required]

        public string Attachment { get; set; } 

        [Required]
        public string Status { get; set; } 

        [Required]
        public DateTime CreatedOn { get; set; } 
    }
}
