# ChatGPT public submission preparation

Publisher: Mark Gatzen (individual; verification complete as confirmed by the
publisher on 12 October 2026). Initial availability: the 27 European Union
member countries. Free, with no purchases or paid plugin features. Support:
public GitHub issues. The publisher approved the brighter 256 × 256 icon. Its indexed PNG is 6,618 bytes, below the requested 10 KB limit.

`plugin.public.json` is a separate upload manifest. The source's private/local
manifest and existing app connections are preserved. `../mcp.public.json`
supplies the actual remote no-auth endpoint. The public copy includes eight
skills, a listing, five positive and three negative cases, commerce declaration,
release notes and country targeting. No review-result assertions are embedded
in the manifest.

The four `site-pages/` files are the publisher-page source for the existing
Canonical Theology website. The `verification.json` record must distinguish
draft content from deployed pages and a planned walkthrough from a recording.

`demo-walkthrough.md` gives the development connection, real prompts, visible
results, recording and hosting steps. A real reviewer-accessible recording is
still required. Case routing and generated answers must be tested against the
exact saved submission version; local regression tests do not replace that.

Build an explicitly incomplete working archive:

```bash
python3 publication/build-package.py --output /absolute/path/public-draft.zip --allow-incomplete
```

After verifying all listing URLs and a real demo recording:

```bash
python3 publication/build-package.py --output /absolute/path/public-submission.zip
```

The builder reads back and validates the ZIP inventory and metadata. It refuses
to call an archive ready while the recording or listing URL verification is
missing. The Developer Portal still needs connection/testing, scans and the
publisher's legal/policy attestations. Submission and publication after approval
are separate actions. No public submission or approval is claimed by these files.
