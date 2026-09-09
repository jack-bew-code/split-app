import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(projectRoot, 'package.json');

function readCommitMessage() {
  const arg = process.argv[2];
  if (arg && fs.existsSync(arg)) {
    return fs.readFileSync(arg, 'utf8').toLowerCase();
  }

  try {
    return execSync('git log -1 --pretty=%B', { cwd: projectRoot }).toString().toLowerCase();
  } catch (err) {
    return '';
  }
}

function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  if (type === 'major') return `${parts[0] + 1}.0.0`;
  if (type === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
  if (type === 'patch') return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;

  return null;
}

try {
  const commitMsg = readCommitMessage();

  let bumpType = null;
  if (/\brelease\b|\bmajor\b/i.test(commitMsg)) bumpType = 'major';
  else if (/\bfeat\b|\bfeature\b/i.test(commitMsg)) bumpType = 'minor';
  else if (/\bfix\b/i.test(commitMsg)) bumpType = 'patch';

  if (!bumpType) {
    console.log('No version keyword found in commit message. Keeping current version.');
    process.exit(0);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const oldVersion = pkg.version;
  const newVersion = bumpVersion(oldVersion, bumpType);

  if (!newVersion) {
    console.warn('Could not parse current version:', oldVersion);
    process.exit(1);
  }

  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  console.log(`Bumped version ${oldVersion} -> ${newVersion}`);
  process.exit(0);
} catch (error) {
  console.warn('Could not bump version:', error.message);
  process.exit(1);
}