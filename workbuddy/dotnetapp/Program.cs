using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var keyVaultUrl = builder.Configuration["KeyVaultConfiguration:URL"];
var secretkey = builder.Configuration["KeyVaultConfiguration:ConnectionStringSecretName"];
Console.WriteLine(keyVaultUrl);
if (keyVaultUrl != null)
{
    var builtConfig = new ConfigurationBuilder()
        .AddConfiguration(builder.Configuration)
        .Build();

    // builder.Configuration.AddAzureKeyVault(keyVaultUrl);
}

var keyVaultConfig = builder.Configuration.GetSection("KeyVaultConfiguration").Get<KeyVaultConfiguration>();

var secretClient = new SecretClient(new Uri(keyVaultConfig.URL), new DefaultAzureCredential());

var connectionStringSecret = secretClient.GetSecret(keyVaultConfig.ConnectionStringSecretName).Value;
var connectionString = connectionStringSecret.Value;
// Console.WriteLine(connectionString);
var BlobSecret = secretClient.GetSecret(keyVaultConfig.BlobSecret).Value;
var BlobString = BlobSecret.Value;
Console.WriteLine(BlobString);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, 
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure()));

builder.Services.AddSingleton(new BlobService(BlobString, builder.Configuration["BlobContainerName"]));


builder.Services.AddControllers()
    .AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.PropertyNamingPolicy = null; // Use original property names

});

// builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("conn")));

// For Identity  
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
// Adding Authentication  
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<LeaveRequestService>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
                };
                //options.Events = new JwtBearerEvents
                //{
                //    OnTokenValidated = context =>
                //    {
                //        var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
                //        var user = userManager.GetUserAsync(context.Principal).Result;
                //        var roles = userManager.GetRolesAsync(user).Result;

                //        // Add role claims to the token
                //        var roleClaims = roles.Select(role => new Claim(ClaimTypes.Role, role));
                //        var appIdentity = new ClaimsIdentity(roleClaims);
                //        context.Principal.AddIdentity(appIdentity);

                //        return Task.CompletedTask;
                //    }
                //};
            });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();
