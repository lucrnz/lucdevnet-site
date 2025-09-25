/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
*/

using YamlDotNet.Core;
using YamlDotNet.Serialization;

namespace Lucdev.SiteServer.Entities;

public record VerifiedClaim(string Path, string Title, string Content, DateOnly ClaimedAt);

public class VerifiedClaimYamlContent
{
  [YamlMember(Alias = "title")]
  public required string Title { get; set; }

  [YamlMember(Alias = "path_guard")]
  public required string PathGuard { get; set; }

  [YamlMember(Alias = "content", ScalarStyle = ScalarStyle.Literal)]
  public required string Content { get; set; }

  [YamlMember(Alias = "claimed_at")]
  public required string ClaimedAt { get; set; }
}
