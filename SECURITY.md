# Security Policy

This is the security policy for the ZeroPerl TypeScript bridge and
`@webdyne/webdyne-zeroperl-ts` npm package.

This policy was updated on 2026-09-26.

## Reporting a Security Vulnerability

Please report security vulnerabilities via GitHub private vulnerability
reporting for this repository:

https://github.com/aspeer/zeroperl-ts/security/advisories/new

GitHub private vulnerability reporting is enabled for this repository and is
the preferred reporting point.

If you cannot use GitHub, report the issue privately by email to the current
project maintainer:

Andrew Speer <andrew.speer@isolutions.com.au>

Please do not report security vulnerabilities through public GitHub issues,
public pull requests, mailing lists, social media, chat channels, or other
public forums.

Please include enough detail to reproduce and assess the issue, including:

- the affected bridge, runtime, and npm package versions
- the affected JavaScript runtime, operating system, or Worker, if relevant
- a proof of concept, test case, or reproduction steps
- relevant logs, code snippets, configuration, or request/response examples
- whether the issue is known to be actively exploited
- whether you want public credit when the issue is disclosed

Do not include passwords, tokens, private keys, personal data, or other
sensitive information in the report unless it is strictly necessary and safe
to share with the maintainer.

## Supported Versions

Security fixes are normally made against the latest ZeroPerl TypeScript bridge
release. Older releases are not routinely supported unless the maintainer
decides a backport is practical and necessary.

If this policy or the latest release is more than two years old, check for a
newer release on npm or in the main GitHub repository before relying on the
contact and support information here.

## Handling and Disclosure

The maintainer will aim to acknowledge security reports as soon as practical,
investigate the report, and coordinate a fix and public disclosure where
appropriate. The bridge is maintained by a volunteer maintainer, so exact
response times cannot be guaranteed.

Please do not publicly disclose the vulnerability, exploit details, patches,
or mitigation advice until a coordinated disclosure date has passed or the
issue has been made public by the maintainer.

## Scope

This policy applies to vulnerabilities in this ZeroPerl TypeScript bridge, its
packaging, and the published `@webdyne/webdyne-zeroperl-ts` package.
Vulnerabilities in Perl, the ZeroPerl runtime, WebDyne, Cloudflare, or other
dependencies should be reported to their respective maintainers. Build
problems, general bugs, feature requests, and documentation issues should use
the normal public GitHub issue tracker.
