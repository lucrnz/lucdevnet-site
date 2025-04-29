/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
*/

using Microsoft.Extensions.FileProviders;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
});

var app = builder.Build();
var assembly = Assembly.GetExecutingAssembly();
var embeddedFileProvider = new EmbeddedFileProvider(assembly, $"{assembly.GetName().Name!}.dist");

embeddedFileProvider.GetDirectoryContents(string.Empty).ToList().ForEach(file =>
{
    Console.WriteLine($"Embedded file: {file.Name}");
});

// Redirect configuration
var redirectConfig = new Dictionary<string, string>
{
    { "/favicon.ico", "/favicon.svg"},
    { "/about", "/" },
    { "/copyright-policy", "/licensing-terms" },
    { "/blog/tagged", "/blog" },
    { "/blog/goodbye-dotnet", "/blog/web-first" }
};

// Handle redirects using MapWhen to ensure proper precedence
foreach (var kv in redirectConfig)
{
    app.MapWhen(
        context => context.Request.Path.Equals(kv.Key) || context.Request.Path.Equals($"{kv.Key}/"),
        builder => builder.Run(async context =>
        {
            context.Response.Redirect(kv.Value, false);
            await Task.CompletedTask;
        })
    );
}

// Matrix void request
app.MapGet("/.well-known/matrix/client", (string path) =>
{
    Console.WriteLine($"Matrix request: {path}");
    return Results.Ok();
});

// Serve static files from the embedded file provider
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = embeddedFileProvider,
});

// Fallback for redirects and serving HTML files
app.MapFallback(async context =>
{
    Console.WriteLine($"[fallback handler] Request path: {context.Request.Path}");
    string path = context.Request.Path.Value?.TrimStart('/') ?? "";
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
