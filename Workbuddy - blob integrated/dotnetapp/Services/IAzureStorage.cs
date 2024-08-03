using dotnetapp.Models;

namespace dotnetapp.Services
{

    public interface IAzureStorage
    {
        
        // Task<BlobResponseDto> UploadAsync(List<IFormFile> files);
        Task<BlobResponseDto> UploadAsync1(IFormFile file);

    }
    
}
