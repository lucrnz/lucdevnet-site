/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
*/

using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using Lucdev.SiteServer.Entities;
using System.Text;

namespace Lucdev.SiteServer.Claims;

public static class ClaimsHelper
{
  public static IReadOnlyList<VerifiedClaim> LoadClaims()
  {
    string? claimsDir = Environment.GetEnvironmentVariable("CLAIMS_DIR");
    if (string.IsNullOrWhiteSpace(claimsDir) || !Directory.Exists(claimsDir))
    {
      throw new Exception("CLAIMS_DIR is not set or does not exist.");
    }

    var deserializer = new DeserializerBuilder()
            .WithNamingConvention(UnderscoredNamingConvention.Instance)
            .Build();

    var result = new List<VerifiedClaim>();

    var allFiles = Directory.EnumerateFiles(claimsDir, "*.yaml").Concat(Directory.EnumerateFiles(claimsDir, "*.yml"));

    foreach (var fileName in allFiles)
    {
      if (string.IsNullOrEmpty(fileName)) continue;

      // remove file extension correctly here and use it as slug
      var slug = Path.GetFileNameWithoutExtension(fileName).ToLowerInvariant();

      string fileTextContent = File.ReadAllText(fileName, Encoding.UTF8);
      var claimYml = deserializer.Deserialize<VerifiedClaimYamlContent>(fileTextContent);

      if (claimYml is null)
      {
        Console.WriteLine($"Warning: Skipping null claim: {fileName}");
        continue;
      }

      if (!DateOnly.TryParseExact(claimYml.ClaimedAt, "yyyyMMdd", out var claimedAt))
      {
        Console.WriteLine($"Invalid date format in file: {fileName}");
        continue;
      }

      var claim = new VerifiedClaim(slug, claimYml.Title, claimYml.Content, claimedAt);
      result.Add(claim);
    }

    Console.WriteLine($"Loaded: {result.Count} claims");

    return result.AsReadOnly();
  }
}