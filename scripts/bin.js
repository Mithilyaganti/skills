#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

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

// Installation Targets
function installToAntigravity() {
  const homeDir = os.homedir();
  const pluginsDir = path.join(homeDir, '.gemini', 'config', 'plugins');
  const targetDir = path.join(pluginsDir, 'vector-cadence-skills');

  console.log('Installing to Antigravity (global)...');
  fs.mkdirSync(targetDir, { recursive: true });

  const itemsToCopy = [
    'skills', 'examples', 'references', 'scripts', 'templates',
    'skills.json', 'plugin.json', 'README.md', 'DOCUMENTATION.md',
    'CHANGELOG.md', 'CONTRIBUTING.md'
  ];

  for (const item of itemsToCopy) {
    const srcPath = path.join(packageRootDir, item);
    const destPath = path.join(targetDir, item);

    if (!fs.existsSync(srcPath)) continue;

    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`- Installed successfully to Antigravity global plugins: ${targetDir}`);
}

function installToCursor() {
  const destDir = path.join(process.cwd(), '.cursor', 'rules');
  console.log('Installing to Cursor (.cursor/rules/)...');
  fs.mkdirSync(destDir, { recursive: true });
  
  const skillsDir = path.join(packageRootDir, 'skills');
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  
  for (let entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('vc-')) {
      const srcFile = path.join(skillsDir, entry.name, 'SKILL.md');
      const destFile = path.join(destDir, `${entry.name}.md`);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`- Created Cursor rule: .cursor/rules/${entry.name}.md`);
      }
    }
  }
}

function installToClaude() {
  const destFile = path.join(process.cwd(), '.claudecoderules');
  console.log('Installing to Claude Code (.claudecoderules)...');
  let combinedContent = '# Vector Cadence Skills\n\n';
  
  const skillsDir = path.join(packageRootDir, 'skills');
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  
  for (let entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('vc-')) {
      const srcFile = path.join(skillsDir, entry.name, 'SKILL.md');
      if (fs.existsSync(srcFile)) {
        const fileContent = fs.readFileSync(srcFile, 'utf8');
        // Strip frontmatter metadata
        const cleanContent = fileContent.replace(/^---[\s\S]*?---/, '').trim();
        combinedContent += `## ${entry.name}\n\n${cleanContent}\n\n---\n\n`;
      }
    }
  }
  
  fs.writeFileSync(destFile, combinedContent, 'utf8');
  console.log('- Created .claudecoderules at project root.');
}

function installToPi() {
  const destDir = path.join(process.cwd(), '.pi', 'skills');
  console.log('Installing to Pi / Codex CLI (.pi/skills/)...');
  fs.mkdirSync(destDir, { recursive: true });
  
  const skillsDir = path.join(packageRootDir, 'skills');
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  
  for (let entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('vc-')) {
      copyDir(path.join(skillsDir, entry.name), path.join(destDir, entry.name));
      console.log(`- Created skill folder: .pi/skills/${entry.name}`);
    }
  }
}

function installToOmp() {
  const destDir = path.join(process.cwd(), '.omp', 'skills');
  console.log('Installing to Oh-My-Pi / OpenCode (.omp/skills/)...');
  fs.mkdirSync(destDir, { recursive: true });
  
  const skillsDir = path.join(packageRootDir, 'skills');
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  
  for (let entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('vc-')) {
      copyDir(path.join(skillsDir, entry.name), path.join(destDir, entry.name));
      console.log(`- Created skill folder: .omp/skills/${entry.name}`);
    }
  }
}

// CLI Execution Flow
const args = process.argv.slice(2);
const isAll = args.includes('--all');
const isCursor = args.includes('--cursor') || isAll;
const isClaude = args.includes('--claude') || isAll;
const isPi = args.includes('--pi') || args.includes('--codex') || isAll;
const isOmp = args.includes('--omp') || args.includes('--opencode') || isAll;
const isAntigravity = args.includes('--antigravity') || args.length === 0;

console.log('=== Vector Cadence Skills Installer ===\n');

try {
  let executed = false;

  if (isAntigravity) {
    installToAntigravity();
    executed = true;
  }
  if (isCursor) {
    installToCursor();
    executed = true;
  }
  if (isClaude) {
    installToClaude();
    executed = true;
  }
  if (isPi) {
    installToPi();
    executed = true;
  }
  if (isOmp) {
    installToOmp();
    executed = true;
  }

  if (executed) {
    console.log('\nInstallation completed successfully!');
  } else {
    console.log('No valid installation target specified.');
  }

  // Print helpful tip if default global run
  if (args.length === 0) {
    console.log('\n---');
    console.log('Tip: You can also deploy the skills locally to other agent tools in this project folder:');
    console.log('  npx vector-cadence-skills --cursor       (Cursor rules)');
    console.log('  npx vector-cadence-skills --claude       (Claude Code CLI rules)');
    console.log('  npx vector-cadence-skills --pi           (Pi / Codex CLI skills)');
    console.log('  npx vector-cadence-skills --omp          (Oh-My-Pi / OpenCode skills)');
    console.log('  npx vector-cadence-skills --all          (Install to all local project tools)');
  }
} catch (error) {
  console.error('\nInstallation failed:', error.message);
  process.exit(1);
}
