#!/usr/bin/env python3
"""Build and inspect a separate public upload; preserve the private package."""
import argparse
import json
import re
import struct
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / 'publication'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--allow-incomplete', action='store_true')
args = parser.parse_args()
manifest = json.loads((PUB / 'plugin.public.json').read_text())
mcp = json.loads((ROOT / 'mcp.public.json').read_text())
assert manifest['version'] == json.loads((ROOT / 'plugin.json').read_text())['version'], 'Public submission snapshot must be updated and verified for the current source version before rebuilding'
extension = manifest['extensions']['com.openai']
interface = extension['interface']
assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', manifest['name'])
assert re.fullmatch(r'\d+\.\d+\.\d+', manifest['version'])
assert len(interface['displayName']) <= 30 and len(interface['shortDescription']) <= 30
assert len(interface['longDescription']) <= 4000
assert not manifest.get('apps') and not extension.get('apps')
assert len(mcp['mcpServers']) == 1
server = next(iter(mcp['mcpServers'].values()))
assert server['type'] == 'streamable-http'
assert server['url'] == 'https://mcp.canonical-theology.com/mcp'
assert server['extensions']['com.openai']['auth']['type'] == 'none'
cases = extension['review']['test_cases']
assert len(cases['positive']) == 5 and len(cases['negative']) == 3
for kind, records in cases.items():
    for case in records:
        keys = ['description', 'prompt'] + (['tools_triggered', 'expected_behavior'] if kind == 'positive' else [])
        assert all(isinstance(case[k], str) and case[k].strip() for k in keys)
assert extension['review']['commerce'] is False
assert len(extension['publication']['countries']) == 27
assert len(set(extension['publication']['countries'])) == 27
prompts = interface['defaultPrompt']
assert 1 <= len(prompts) <= 3
assert len(set(' '.join(p.split()) for p in prompts)) == len(prompts)
assert all(p.strip() and len(p) <= 128 and '\n' not in p and '@' not in p for p in prompts)

files = {'plugin.json': json.dumps(manifest, ensure_ascii=False, indent=2).encode() + b'\n', 'mcp.json': (ROOT / 'mcp.public.json').read_bytes()}
for directory in ['assets', 'skills', 'references', 'schemas', 'bible_study']:
    for file in (ROOT / directory).rglob('*'):
        if file.is_symlink():
            raise ValueError(f'Symlink is not allowed: {file}')
        if file.is_file() and '__pycache__' not in file.parts and file.suffix != '.pyc':
            files[file.relative_to(ROOT).as_posix()] = file.read_bytes()
for name in ['LICENSE', 'pyproject.toml', 'scripts/bible.py']:
    files[name] = (ROOT / name).read_bytes()
files['ATTRIBUTION.md'] = (ROOT.parents[1] / 'ATTRIBUTION.md').read_bytes()
files['README.md'] = (PUB / 'package-README.md').read_bytes()
skills = [name for name in files if re.fullmatch(r'skills/[^/]+/SKILL.md', name)]
assert len(skills) == 8
for name in skills:
    body = files[name].decode()
    assert body.startswith('---\n') and '\ndescription:' in body.split('---', 2)[1]
    assert re.search(r'^name:\s*' + re.escape(name.split('/')[1]) + r'\s*$', body, re.M)
for field in ['logo', 'composerIcon']:
    path = interface[field].removeprefix('./')
    assert not path.startswith('/') and '..' not in Path(path).parts
    blob = files[path]
    assert blob[:8] == b'\x89PNG\r\n\x1a\n' and len(blob) < 10000
    width, height = struct.unpack('>II', blob[16:24])
    assert width == height == 256
assert not any('.app.json' in name or '.codex-plugin' in name for name in files)
for name in files:
    assert not any(part in {'.venv', 'node_modules', '__pycache__', '.git'} for part in Path(name).parts)

verification_path = PUB / 'verification.json'
verification = json.loads(verification_path.read_text()) if verification_path.exists() else {}
gaps = []
for field in ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']:
    assert interface[field].startswith('https://') and len(interface[field]) <= 1024
    proof = verification.get('listing_urls', {}).get(field, {})
    if proof.get('url') != interface[field] or proof.get('status') != 'Verified':
        gaps.append(f'Content/access verification required: {field}')
demo = extension['review'].get('demo_recording_url')
if not demo or verification.get('demo', {}).get('url') != demo or verification.get('demo', {}).get('status') != 'Verified':
    gaps.append('A real reviewer-accessible demo recording must be verified and added')
if gaps and not args.allow_incomplete:
    raise SystemExit('\n'.join(gaps))
args.output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(args.output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for name, blob in sorted(files.items()):
        entry = zipfile.ZipInfo(manifest['name'] + '/' + name, (2026, 10, 12, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        archive.writestr(entry, blob)
with zipfile.ZipFile(args.output) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(files)
    saved = json.loads(archive.read(manifest['name'] + '/plugin.json'))
    assert saved == manifest
    assert archive.read(manifest['name'] + '/mcp.json') == files['mcp.json']
print(json.dumps({'archive': str(args.output.resolve()), 'files': len(files), 'skills': len(skills), 'version': manifest['version'], 'package_ready': not gaps, 'gaps': gaps, 'dashboard_steps': ['Connect and run review cases on the saved version', 'Developer completes legal/policy attestations', 'Resolve scans, submit for review, then publish after approval']}, indent=2))
