using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public class LeaveRequestService
    {
        private readonly ApplicationDbContext _context;

        public LeaveRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LeaveRequest>> GetAllLeaveRequests()
        {
            return await _context.LeaveRequests.Include(r => r.User).ToListAsync();
        }

        public async Task<LeaveRequest> GetLeaveRequestById(int leaveRequestId)
        {
            return await _context.LeaveRequests.FirstOrDefaultAsync(lr => lr.LeaveRequestId == leaveRequestId);
        }

        public async Task<bool> AddLeaveRequest(LeaveRequest leaveRequest)
        {
        

            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();
            return true;
        }


      public async Task<bool> UpdateLeaveRequest(int leaveRequestId, LeaveRequest leaveRequest)
{
    var existingLeaveRequest = await _context.LeaveRequests.FirstOrDefaultAsync(lr => lr.LeaveRequestId == leaveRequestId);

    if (existingLeaveRequest == null)
        return false;
    leaveRequest.LeaveRequestId = leaveRequestId;
    _context.Entry(existingLeaveRequest).CurrentValues.SetValues(leaveRequest);
    await _context.SaveChangesAsync();
    return true;
}


        public async Task<bool> DeleteLeaveRequest(int leaveRequestId)
        {
            var leaveRequest = await _context.LeaveRequests.FirstOrDefaultAsync(lr => lr.LeaveRequestId == leaveRequestId);
            if (leaveRequest == null)
                return false;

            _context.LeaveRequests.Remove(leaveRequest);
            await _context.SaveChangesAsync();
            return true;
        }

          public async Task<IEnumerable<LeaveRequest>> GetLeaveRequestsByUserId(int userId)
        {
            return await _context.LeaveRequests
                .Where(lr => lr.UserId == userId)
                .ToListAsync();
        }
    }
}
