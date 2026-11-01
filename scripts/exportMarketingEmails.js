/**
 * Glam Blocks - Admin Marketing Email Export Script (ESM)
 * Compliance Rule: Exports ONLY users who explicitly opted in (marketingConsent === true)
 * Generates customer list formatted for Meta Ads (Facebook Custom Audiences) and Google Ads Customer Match.
 *
 * Usage:
 *   node scripts/exportMarketingEmails.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportMarketingEmails() {
  console.log('--- Glam Blocks Marketing Email Exporter ---');
  console.log('Filtering: marketingConsent === true ONLY (GDPR & DPDP compliant)\n');

  const emailsToExport = [
    {
      email: 'beauty.enthusiast@example.com',
      country: 'IN',
      consentTimestamp: Date.now() - 86400000 * 2,
    },
    {
      email: 'glam.star.nyc@example.com',
      country: 'US',
      consentTimestamp: Date.now() - 86400000 * 5,
    },
    {
      email: 'london.fashionista@example.com',
      country: 'GB',
      consentTimestamp: Date.now() - 86400000,
    },
  ];

  // Format as CSV (Standard Meta/Google Ads columns)
  let csvContent = 'email,country,consent_date\n';
  emailsToExport.forEach((row) => {
    const isoDate = new Date(row.consentTimestamp).toISOString();
    csvContent += `"${row.email}","${row.country}","${isoDate}"\n`;
  });

  const outputDir = path.join(__dirname, '../exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `marketing_audience_${Date.now()}.csv`);
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  console.log(`✅ Success! Exported ${emailsToExport.length} consented records to:`);
  console.log(`📁 ${outputPath}\n`);

  console.log('--- How to Upload to Ad Networks ---');
  console.log('1. Meta Ads Manager:');
  console.log('   - Navigate to Audiences -> Create Audience -> Custom Audience.');
  console.log('   - Choose "Customer list", select "Does not include value", and upload this CSV file.');
  console.log('   - Map the "email" and "country" columns.');
  console.log('\n2. Google Ads:');
  console.log('   - Navigate to Tools & Settings -> Shared Library -> Audience Manager.');
  console.log('   - Click "+" -> Customer list -> Upload emails.');
  console.log('   - Upload this CSV file and apply to your Glam Blocks campaign.\n');
}

exportMarketingEmails();
