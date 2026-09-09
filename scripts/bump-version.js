const { execSync } = require('child_process');

try {
  // Read the latest Git commit message
  const commitMsg = execSync('git log -1 --pretty=%B').toString().toLowerCase();

  if (commitMsg.includes('release') || commitMsg.includes('release')) {
    execSync('npm version major --no-git-tag-version');
    console.log('Incremented Major version (Reset minor & patch)');
  } else if (commitMsg.includes('Feature') || commitMsg.includes('feature') || commitMsg.includes('feat')) {
    execSync('npm version minor --no-git-tag-version');
    console.log('Incremented Minor version (Reset patch)');
  } else if (commitMsg.includes('fix') || commitMsg.includes('Fix')) {
    execSync('npm version patch --no-git-tag-version');
    console.log('Incremented Patch version');
  } else {
    console.log('No version keyword found in commit message. Keeping current version.');
  }
} catch (error) {
  console.warn('Could not read Git log to bump version:', error.message);
}