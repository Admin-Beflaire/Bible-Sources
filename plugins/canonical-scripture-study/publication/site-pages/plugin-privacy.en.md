---
title: "Canonical Scripture Study \u2014 Privacy"
subtitle: "Data practices for the public Bible-study plugin"
url: "/canonical-scripture-study/privacy/"
date: 2026-10-12
draft: false
build:
  list: never
  render: always
---

**Last updated: 12 October 2026.** This notice describes the public Canonical Scripture Study MCP service operated by **Mark Gatzen**. It is separate from the policies governing your ChatGPT account and GitHub support messages.

## What the service receives and why

When ChatGPT calls a study tool, OpenAI sends the selected tool name and arguments to the service. Arguments can include Bible references, study questions, language preferences, continuation state or a structured evidence packet. The service processes them to retrieve public source evidence, plan the requested study or validate a packet. Tool arguments may contain personal information if you or the host include it; avoid sending information that is unnecessary for the study.

Cloudflare hosts the service and processes network requests. The Worker reads Cloudflare's edge-provided source IP to check that a request comes from OpenAI's connector network. It uses hashed connector-network identifiers and a shared service identifier for rate limiting. These are not ChatGPT user IDs and do not identify which individual is using a shared connector address.

## Storage and monitoring

The service creates no user account, conversation database or personal study history. Request arguments and continuation state are processed for the current call; the application does not persist them. The chat host retains the conversation and passes continuation state back when needed.

Cloudflare Worker monitoring records operational information such as request time, method, route, status, runtime and deployment. The application's custom events include tool name, version, timing, success or error code, response size and source-cache metrics. They omit prompts, tool arguments, source text, identities and tokens. URL query strings are redacted in invocation logging.

Under the currently used Cloudflare Workers Free plan, stored Worker logs have a three-day retention period. No separate application log archive is configured. Cloudflare also processes infrastructure and security metadata under its own policies. The maintainer can inspect operational logs to diagnose problems and abuse.

Caches contain verified public Bible-source bytes. The KV namespace contains only OpenAI's published connector IP ranges and the time they were downloaded. Neither stores conversations or profiles. The service has no advertising, behavioral analytics integration or model-training pipeline.

## Providers and disclosure

OpenAI operates ChatGPT and sends tool requests; Cloudflare runs the MCP service. The service returns source evidence and tool results to OpenAI for the conversation. It makes no model API calls of its own. It does not transmit tool arguments to source publishers or arbitrary external websites; source assets are prepared from the pinned public repository. The separate scheduled network-policy refresh downloads OpenAI's public connector list without user study data.

Provider processing may occur outside the European Union. Each provider's terms and privacy practices apply to its own service. Intended EU directory availability is not a promise of EU-only hosting or data residency.

## Support and the website

[GitHub issues](https://github.com/Admin-Beflaire/Bible-Sources/issues) are the public support channel. Anything posted there may be visible to others and remains subject to GitHub's retention and deletion controls. Do not include sensitive information in an issue.

These information pages use the Canonical Theology site's existing hosting and design. Theme and reader preferences can be stored in your browser. The site has no application analytics or tracking cookies; its design may load fonts from Google's font service, which receives the requests needed to serve those fonts. Cloudflare handles website delivery and security metadata.

## Questions and rights

For a privacy question concerning this service, use the [support page](../support/) without posting personal data. A private contact route should be agreed before exchanging identifying information. Where applicable, data-protection law may give you rights to access, correction, deletion, restriction, objection or complaint to a supervisory authority. The service does not keep a per-user record that can be retrieved using a ChatGPT account name. Requests about ChatGPT conversation data should be directed to OpenAI; requests about GitHub issue data should also use GitHub's controls.

[About the plugin](../) · [Support](../support/) · [Terms](../terms/)
