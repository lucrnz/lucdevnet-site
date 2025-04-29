using Microsoft.Extensions.FileProviders;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});

var app = builder.Build();
var assembly = Assembly.GetExecutingAssembly();
var embeddedFileProvider = new EmbeddedFileProvider(assembly, $"{assembly.GetName().Name!}.wwwroot");

embeddedFileProvider.GetDirectoryContents(string.Empty).ToList().ForEach(file =>
{
    Console.WriteLine($"Embedded file: {file.Name}");
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = embeddedFileProvider,
});

app.MapFallback(async context =>
{
    Console.WriteLine($"[fallback handler] Request path: {context.Request.Path}");
    string path = context.Request.Path.Value?.TrimStart('/') ?? "";

    if (path.Contains(".well-known/matrix"))
    {
        // For now disable any matrix request
        // If I want to get back to matrix, I can comment this code again.
        context.Response.StatusCode = StatusCodes.Status200OK;
        return;
    }

    string fileToServe;

    // If path is empty, serve the index.html file
    if (string.IsNullOrEmpty(path))
    {
        fileToServe = "index.html";
    }
    else
    {
        // If the path doesn't end with .html, try to find an index.html in that directory
        if (!path.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
        {
            fileToServe = path.TrimEnd('/') + "/index.html";
        }
        else
        {
            fileToServe = path;
        }
    }

    var fileInfo = embeddedFileProvider.GetFileInfo(fileToServe);

    if (fileInfo.Exists)
    {
        Console.WriteLine($"Serving file: {fileToServe}");
        context.Response.StatusCode = StatusCodes.Status200OK;
    }
    else
    {
        Console.WriteLine($"File not found: {fileToServe}");
        // If file doesn't exist, serve 404.html
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        fileInfo = embeddedFileProvider.GetFileInfo("404.html");
    }

    context.Response.ContentType = "text/html";

    using var stream = fileInfo.CreateReadStream();
    await stream.CopyToAsync(context.Response.Body);
});

app.Run();
