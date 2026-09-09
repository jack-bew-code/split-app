const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

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

try {
  const commitMsg = readCommitMessage();

  let bumpType = null;
  if (/\brelease\b|\bmajor\b/i.test(commitMsg)) bumpType = 'major';
  else if (/\bfeat\b|\bfeature\b/i.test(commitMsg)) bumpType = 'minor';
  else if (/\bfix\b/i.test(commitMsg)) bumpType = 'patch';

  if (bumpType) {
    execSync(`npm --prefix "${projectRoot}" version ${bumpType} --no-git-tag-version`, { stdio: 'inherit' });
    console.log(`Incremented ${bumpType} version`);
  } else {
    console.log('No version keyword found in commit message. Keeping current version.');
  }
} catch (error) {
  console.warn('Could not bump version:', error.message);
  process.exitCode = 1;
}