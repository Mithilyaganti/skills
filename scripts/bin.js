#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Target directory in .gemini config plugins
const homeDir = os.homedir();
const pluginsDir = path.join(homeDir, '.gemini', 'config', 'plugins');
const targetDir = path.join(pluginsDir, 'vector-cadence-skills');

// Source directory (root of the package)
const packageRootDir = path.resolve(__dirname, '..');

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Installing Vector Cadence Skills to Antigravity...');

try {
  // Ensure target plugins directory exists
  fs.mkdirSync(targetDir, { recursive: true });

  // List of files and folders to copy
  const itemsToCopy = [
    'skills',
    'examples',
    'references',
    'scripts',
    'templates',
    'skills.json',
    'plugin.json',
    'README.md',
    'DOCUMENTATION.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md'
  ];

  for (const item of itemsToCopy) {
    const srcPath = path.join(packageRootDir, item);
    const destPath = path.join(targetDir, item);

    if (!fs.existsSync(srcPath)) continue;

    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      // Don't recursively copy the scripts/bin.js to scripts/ again if we are running it,
      // but copying the folder is fine.
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(`\nSuccess! Vector Cadence Skills installed successfully.`);
  console.log(`Target location: ${targetDir}`);
  console.log('Restart Antigravity to load the new skills.');
} catch (error) {
  console.error('\nInstallation failed:', error.message);
  process.exit(1);
}
