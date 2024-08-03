using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class LeaveRequestTests
    {

        [Test, Order(1)]
        public async Task Backend_Test_Method_GetAllLeaveRequests_In_LeaveRequestService_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.LeaveRequestService";

            Type serviceType = assembly.GetType(serviceName);

            // Get the GetAllLeaveRequests method
            MethodInfo method = serviceType.GetMethod("GetAllLeaveRequests");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(2)]
        public async Task Backend_Test_Method_GetLeaveRequestById_In_LeaveRequestService_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.LeaveRequestService";

            Type serviceType = assembly.GetType(serviceName);

            // Get the GetLeaveRequestById method
            MethodInfo method = serviceType.GetMethod("GetLeaveRequestById");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(3)]
        public async Task Backend_Test_Method_AddLeaveRequest_In_LeaveRequestService_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.LeaveRequestService";

            Type serviceType = assembly.GetType(serviceName);

            // Get the AddLeaveRequest method
            MethodInfo method = serviceType.GetMethod("AddLeaveRequest");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(4)]
        public async Task Backend_Test_Method_UpdateLeaveRequest_In_LeaveRequestService_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.LeaveRequestService";

            Type serviceType = assembly.GetType(serviceName);

            // Get the UpdateLeaveRequest method
            MethodInfo method = serviceType.GetMethod("UpdateLeaveRequest");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(5)]
        public async Task Backend_Test_Method_DeleteLeaveRequest_In_LeaveRequestService_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.LeaveRequestService";

            Type serviceType = assembly.GetType(serviceName);

            // Get the DeleteLeaveRequest method
            MethodInfo method = serviceType.GetMethod("DeleteLeaveRequest");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(6)]
        public async Task Backend_Test_Method_GetLeaveRequestsByUserId_In_LeaveRequestService_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.LeaveRequestService";

            Type serviceType = assembly.GetType(serviceName);

            // Get the GetLeaveRequestsByUserId method
            MethodInfo method = serviceType.GetMethod("GetLeaveRequestsByUserId");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(7)]
        public async Task Backend_Test_Method_GetAllLeaveRequests_In_LeaveRequestController_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string controllerName = "dotnetapp.Controllers.LeaveRequestController";

            Type controllerType = assembly.GetType(controllerName);

            // Get the GetAllLeaveRequests method
            MethodInfo method = controllerType.GetMethod("GetAllLeaveRequests");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(8)]
        public async Task Backend_Test_Method_GetLeaveRequestById_In_LeaveRequestController_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string controllerName = "dotnetapp.Controllers.LeaveRequestController";

            Type controllerType = assembly.GetType(controllerName);

            // Get the GetLeaveRequestById method
            MethodInfo method = controllerType.GetMethod("GetLeaveRequestById");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(9)]
        public async Task Backend_Test_Method_AddLeaveRequest_In_LeaveRequestController_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string controllerName = "dotnetapp.Controllers.LeaveRequestController";

            Type controllerType = assembly.GetType(controllerName);

            // Get the AddLeaveRequest method
            MethodInfo method = controllerType.GetMethod("AddLeaveRequest");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(10)]
        public async Task Backend_Test_Method_UpdateLeaveRequest_In_LeaveRequestController_Exists()
        {
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string controllerName = "dotnetapp.Controllers.LeaveRequestController";

            Type controllerType = assembly.GetType(controllerName);

            // Get the UpdateLeaveRequest method
            MethodInfo method = controllerType.GetMethod("UpdateLeaveRequest");

            if (method != null)
            {
                Assert.Pass();
            }
            else
            {
                Assert.Fail();
            }
        }


   
 [Test, Order(11)]
public async Task Backend_Test_Method_Login_In_AuthenticationController_Exists()
{
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Controllers.AuthenticationController";

            Type serviceType = assembly.GetType(serviceName);

            // Get the GetCourseById method
            MethodInfo Method = serviceType.GetMethod("Login");

            if (Method != null)
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
}
    

 [Test, Order(12)]
public async Task Backend_Test_Method_Register_In_AuthenticationController_Exists()
{
            // Load assembly and types
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Controllers.AuthenticationController";

            Type serviceType = assembly.GetType(serviceName);

            // Get the GetCourseById method
            MethodInfo Method = serviceType.GetMethod("Register");

            if (Method != null)
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
}
    
    }
}
