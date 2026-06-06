using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using WebBackend.Models;

namespace WebBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();

            builder.Services.AddDbContext<MyDBContext>(options =>
            {
                options.UseSqlServer("Server =INOSUKEASUS; Database =FinalRecipeNest; Integrated Security=True; TrustServerCertificate=True;");
            });

            builder.Services.AddScoped<Bcrypt>();

            //  Add this to allow CORS from your React frontend
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // React Vite dev server
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });


            var app = builder.Build();

            // Create a scope to access services like DbContext
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MyDBContext>();
            var bcrypt = scope.ServiceProvider.GetRequiredService<Bcrypt>();

            // Create admin if not already present
            if (!context.users.Any(u => u.Email == "admin@gmail.com"))
            {
                var admin = new User
                {
                    FullName = "MeAdmin",
                    Email = "admin@gmail.com",
                    Username = "admin",
                    PasswordHash = bcrypt.HashPassword("iamadmin"),
                    Role = "Admin"
                };

                context.users.Add(admin);
                context.SaveChanges();
            }


            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            // Serve static files from UploadedImages folder
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "UploadedImages")),
                RequestPath = "/uploadedimages"  // Files will be accessible at /uploadedimages
            });


            // Ensure that ProfileImages folder exists before static files are served
            var profileImagePath = Path.Combine(Directory.GetCurrentDirectory(), "ProfileImages");
            Console.WriteLine("ProfileImages Path: " + profileImagePath); // Debugging output
            if (!Directory.Exists(profileImagePath))
            {
                Console.WriteLine("Creating ProfileImages folder..."); // Debugging output
                Directory.CreateDirectory(profileImagePath);
            }

            // Serve static files from ProfileImages folder
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(profileImagePath),
                RequestPath = "/profileimages"  // Files will be accessible at /profileimages
            });


            // Serve other static files from wwwroot if necessary (default static files)
            app.UseStaticFiles();

            app.UseHttpsRedirection();
            app.UseCors();
            app.UseRouting();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
