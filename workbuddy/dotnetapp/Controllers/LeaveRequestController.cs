using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [Route("api/leaverequest")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        private readonly LeaveRequestService _leaveRequestService;
        private readonly BlobService _blobService;

        public LeaveRequestController(LeaveRequestService leaveRequestService, BlobService blobService)
        {
            _leaveRequestService = leaveRequestService;
            _blobService = blobService;
        }

        // [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetAllLeaveRequests()
        {
            var leaveRequests = await _leaveRequestService.GetAllLeaveRequests();
            return Ok(leaveRequests);
        }

        // [Authorize(Roles = "Admin,User")]
        [HttpGet("{leaveRequestId}")]
        public async Task<ActionResult<LeaveRequest>> GetLeaveRequestById(int leaveRequestId)
        {
            var leaveRequest = await _leaveRequestService.GetLeaveRequestById(leaveRequestId);

            if (leaveRequest == null)
                return NotFound(new { message = "Cannot find any leave request" });

            return Ok(leaveRequest);
        }

        // // [Authorize(Roles = "User")]
        // [HttpPost]
        // public async Task<ActionResult> AddLeaveRequest([FromBody] LeaveRequest leaveRequest)
        // {
        //     try
        //     {
        //         var success = await _leaveRequestService.AddLeaveRequest(leaveRequest);
        //         if (success)
        //             return Ok(new { message = "Leave request added successfully" });
        //         else
        //             return StatusCode(500, new { message = "Failed to add leave request" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = ex.Message });
        //     }
        // }

        [HttpPost]
        public async Task<IActionResult> AddLeaveRequest([FromForm] LeaveRequestModel inputModel)
        {
            if (inputModel.Attachment == null || inputModel.Attachment.Length == 0)
                return BadRequest(new { message = "Attachment file is empty." });

            // Validate file type
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
            var fileExtension = Path.GetExtension(inputModel.Attachment.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new { message = "Invalid file type. Only PNG, JPG, and JPEG files are allowed." });
            }

            // Upload the file to blob storage and get the URL
            var blobResponse = await _blobService.UploadAsync1(inputModel.Attachment);

            // Create a new course object with the URL of the uploaded file
            var leaveRequest = new LeaveRequest
            {
                UserId = inputModel.UserId,
                StartDate = inputModel.StartDate,
                EndDate = inputModel.EndDate,
                Reason = inputModel.Reason,
                LeaveType = inputModel.LeaveType,
                Attachment = blobResponse.Uri,
                Status = inputModel.Status,
                CreatedOn = inputModel.CreatedOn
            };

            var success = await _leaveRequestService.AddLeaveRequest(leaveRequest);
            if (success)
                return Ok(new { message = "Leave Request added successfully" });
            else
                return StatusCode(500, new { message = "Failed to add LeaveRequest" });
        }

        // // [Authorize(Roles = "Admin")]
        // [HttpPut("{leaveRequestId}")]
        // public async Task<ActionResult> UpdateLeaveRequest(int leaveRequestId, [FromBody] LeaveRequest leaveRequest)
        // {
        //     try
        //     {
        //         var success = await _leaveRequestService.UpdateLeaveRequest(leaveRequestId, leaveRequest);

        //         if (success)
        //             return Ok(new { message = "Leave request updated successfully" });
        //         else
        //             return NotFound(new { message = "Cannot find any leave request" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = ex.Message });
        //     }
        // }

        [HttpPut("{leaveRequestId}")]
        public async Task<ActionResult> UpdateCourse(int leaveRequestId, [FromForm] LeaveRequestModel inputModel)
        {
            try
            {
                // Fetch the existing course to update
                var existingleaveRequest = await _leaveRequestService.GetLeaveRequestById(leaveRequestId);
                if (existingleaveRequest == null)
                {
                    return NotFound(new { message = "Cannot find any Leave Request" });
                }

                // Validate file type if a new cover image is provided
                if (inputModel.Attachment != null && inputModel.Attachment.Length > 0)
                {
                    var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" };
                    var fileExtension = Path.GetExtension(inputModel.Attachment.FileName).ToLowerInvariant();

                    if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest(new { message = "Invalid file type. Only PNG, JPG, and JPEG files are allowed." });
                    }

                    // Upload the new file to blob storage and get the URL
                    var blobResponse = await _blobService.UploadAsync1(inputModel.Attachment);
                    existingleaveRequest.Attachment = blobResponse.Uri;
                }

                // Update course properties
                existingleaveRequest.UserId = inputModel.UserId;
                existingleaveRequest.StartDate = inputModel.StartDate;
                existingleaveRequest.EndDate = inputModel.EndDate;
                existingleaveRequest.Reason = inputModel.Reason;
                existingleaveRequest.LeaveType = inputModel.LeaveType;
                existingleaveRequest.Status = inputModel.Status;
                existingleaveRequest.CreatedOn = inputModel.CreatedOn;

                var success = await _leaveRequestService.UpdateLeaveRequest(leaveRequestId, existingleaveRequest);

                if (success)
                    return Ok(new { message = "Leave Request updated successfully" });
                else
                    return NotFound(new { message = "Cannot find any Leave Request" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        // [Authorize(Roles = "Admin")]
        [HttpDelete("{leaveRequestId}")]
        public async Task<ActionResult> DeleteLeaveRequest(int leaveRequestId)
        {
            try
            {
                var success = await _leaveRequestService.DeleteLeaveRequest(leaveRequestId);

                if (success)
                    return Ok(new { message = "Leave request deleted successfully" });
                else
                    return NotFound(new { message = "Cannot find any leave request" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequestsByUserId(int userId)
        {
            var leaveRequests = await _leaveRequestService.GetLeaveRequestsByUserId(userId);
            return Ok(leaveRequests);
        }

      
    }
}
