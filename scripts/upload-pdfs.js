#!/usr/bin/env node

/**
 * One-time PDF Upload Script
 * 
 * Uploads D&D reference PDFs to Google's Gemini File API.
 * The returned file URIs are saved to .env for the app to reference.
 * 
 * Usage:
 *   node scripts/upload-pdfs.js
 * 
 * Prerequisites:
 *   - GEMINI_API_KEY must be set in .env
 *   - PDF files must exist in reference-docs/
 * 
 * After running, the script appends VITE_GEMINI_FILE_URI_* vars to .env.
 * These URIs point to files stored on Google's servers — the PDFs themselves
 * are NOT needed in the deployed app or git repo.
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REFERENCE_DIR = path.join(ROOT, 'reference-docs');
const ENV_FILE = path.join(ROOT, '.env');

// Map of PDF filenames to env var suffixes
const PDF_MAP = {
  'PHB': {
    pattern: /player.*handbook/i,
    envKey: 'VITE_GEMINI_FILE_URI_PHB',
  },
  'DMG': {
    pattern: /dungeon.*master.*guide/i,
    envKey: 'VITE_GEMINI_FILE_URI_DMG',
  },
  'MM': {
    pattern: /monster.*manual/i,
    envKey: 'VITE_GEMINI_FILE_URI_MM',
  },
  'BASIC': {
    pattern: /basic.*rules/i,
    envKey: 'VITE_GEMINI_FILE_URI_BASIC',
  },
};

async function loadApiKey() {
  const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
  const match = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
  if (!match) {
    throw new Error('GEMINI_API_KEY not found in .env');
  }
  return match[1].trim();
}

function findPdfFiles() {
  if (!fs.existsSync(REFERENCE_DIR)) {
    throw new Error(`reference-docs/ directory not found at ${REFERENCE_DIR}`);
  }

  const files = fs.readdirSync(REFERENCE_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  if (files.length === 0) {
    throw new Error('No PDF files found in reference-docs/');
  }

  console.log(`\nFound ${files.length} PDF file(s):`);
  files.forEach(f => {
    const size = (fs.statSync(path.join(REFERENCE_DIR, f)).size / (1024 * 1024)).toFixed(1);
    console.log(`  - ${f} (${size} MB)`);
  });

  return files;
}

function matchPdfToKey(filename) {
  for (const [label, config] of Object.entries(PDF_MAP)) {
    if (config.pattern.test(filename)) {
      return { label, ...config };
    }
  }
  return null;
}

async function checkExistingFiles(ai) {
  console.log('\nChecking for previously uploaded files...');
  const existing = new Map();

  try {
    const fileList = await ai.files.list();
    for await (const file of fileList) {
      if (file.state === 'ACTIVE' && file.mimeType === 'application/pdf') {
        existing.set(file.displayName, file);
      }
    }
  } catch (e) {
    console.log('  Could not list existing files (this is OK for first run).');
  }

  return existing;
}

async function uploadFile(ai, filePath, displayName) {
  console.log(`  Uploading ${displayName}...`);
  const startTime = Date.now();

  const file = await ai.files.upload({
    file: filePath,
    config: {
      displayName: displayName,
      mimeType: 'application/pdf',
    },
  });

  // Wait for processing to complete
  let result = file;
  while (result.state === 'PROCESSING') {
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 5000));
    result = await ai.files.get({ name: result.name });
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  if (result.state === 'ACTIVE') {
    console.log(`\n  ✓ Uploaded successfully in ${elapsed}s`);
    console.log(`    Name: ${result.name}`);
    console.log(`    URI:  ${result.uri}`);
    return result;
  } else {
    throw new Error(`Upload failed — state: ${result.state}`);
  }
}

function updateEnvFile(envVars) {
  let envContent = fs.readFileSync(ENV_FILE, 'utf-8');

  for (const [key, value] of Object.entries(envVars)) {
    // Remove existing line if present
    const regex = new RegExp(`^${key}=.*$`, 'm');
    envContent = envContent.replace(regex, '').trim();
    // Append new value
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(ENV_FILE, envContent.trim() + '\n');
  console.log('\n✓ .env file updated with file URIs');
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  D&D Reference PDF Uploader');
  console.log('  Gemini File API');
  console.log('═══════════════════════════════════════');

  const apiKey = await loadApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const pdfFiles = findPdfFiles();
  const existingFiles = await checkExistingFiles(ai);

  const envVars = {};
  let uploadCount = 0;
  let skipCount = 0;

  for (const filename of pdfFiles) {
    const match = matchPdfToKey(filename);
    if (!match) {
      console.log(`\n⚠ Skipping "${filename}" — no matching category found`);
      continue;
    }

    console.log(`\n[${match.label}] ${filename}`);

    // Check if already uploaded
    const displayName = `dnd5e-${match.label.toLowerCase()}`;
    const existing = existingFiles.get(displayName);

    if (existing) {
      console.log(`  Already uploaded: ${existing.uri}`);
      envVars[match.envKey] = existing.uri;
      skipCount++;
      continue;
    }

    // Upload
    const filePath = path.join(REFERENCE_DIR, filename);
    const result = await uploadFile(ai, filePath, displayName);
    envVars[match.envKey] = result.uri;
    uploadCount++;
  }

  // Write URIs to .env
  if (Object.keys(envVars).length > 0) {
    updateEnvFile(envVars);
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`  Done! ${uploadCount} uploaded, ${skipCount} already existed`);
  console.log('  File URIs saved to .env');
  console.log('  You can now run: npm run dev');
  console.log('═══════════════════════════════════════\n');
}

main().catch(err => {
  console.error('\n✗ Error:', err.message);
  process.exit(1);
});
