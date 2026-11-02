/**
 * Glam Blocks: The Gulab Mahal Salon
 * DPDP Act 2023 & GDPR Compliant Email Exporter
 * Exports ONLY users who explicitly gave consent (marketingConsent === true)
 * 
 * Usage:
 *   node scripts/export_consenting_emails.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportConsentingEmails() {
  console.log('🌹 Gulab Mahal Salon - Consenting Audience Exporter');
  console.log('Compliance: DPDP Act 2023 & GDPR (marketingConsent === true ONLY)\n');

  // Sample production dataset representation (can connect to Firestore Admin in production)
  const consentingUsers = [
    {
      email: 'priya.sharma@example.com',
      country: 'IN',
      marketingConsent: true,
      consentTimestamp: Date.now() - 86400000 * 3,
    },
    {
      email: 'aanya.beauty@example.com',
      country: 'IN',
      marketingConsent: true,
      consentTimestamp: Date.now() - 86400000 * 7,
    },
    {
      email: 'claire.glam@example.com',
      country: 'US',
      marketingConsent: true,
      consentTimestamp: Date.now() - 86400000 * 1,
    },
  ];

  // Strictly filter only consented users
  const filtered = consentingUsers.filter((u) => u.marketingConsent === true);

  let csvContent = 'email,country,consent_date\n';
  filtered.forEach((row) => {
    const isoDate = new Date(row.consentTimestamp).toISOString();
    csvContent += `"${row.email}","${row.country}","${isoDate}"\n`;
  });

  const outputDir = path.join(__dirname, '../exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `consenting_emails_${Date.now()}.csv`);
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  console.log(`✅ Success: Exported ${filtered.length} consenting user records.`);
  console.log(`📁 File written to: ${outputPath}\n`);
}

exportConsentingEmails().catch(console.error);
