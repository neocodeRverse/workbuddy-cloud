using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using dotnetapp.Services;
using System;
using System.IO;
using System.Threading.Tasks;

public class BlobService : IAzureStorage
{
    private readonly string _connectionString;
    private readonly string _containerName;

    public BlobService(string connectionString, string containerName)
    {
        _connectionString = connectionString;
        _containerName = containerName;
    }

    public async Task<BlobResponseDto> UploadAsync1(IFormFile file)
    {
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);
        var blobClient = containerClient.GetBlobClient($"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}");

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return new BlobResponseDto
        {
            Uri = blobClient.Uri.ToString(),
            Name = blobClient.Name
        };
    }

    // Implement other methods if needed
    // public Task<BlobResponseDto> UploadAsync(List<IFormFile> files) => throw new NotImplementedException();
    // public Task<List<BlobDto>> ListAsync() => throw new NotImplementedException();
    // public Task<BlobDto> GetBlobAsync(string fileName) => throw new NotImplementedException();
}

public class BlobResponseDto
{
    public string Uri { get; set; }
    public string Name { get; set; }
}
