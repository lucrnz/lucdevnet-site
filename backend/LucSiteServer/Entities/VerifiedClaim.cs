/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
*/

namespace Lucdev.SiteServer.Entities;

public record VerifiedClaim(string Slug, string Title, string Content, DateOnly ClaimedAt);