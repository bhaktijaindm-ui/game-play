/**
 * ============================================================================
 * Glam Blocks - Marketing Opt-in Email Exporter
 * ============================================================================
 * 
 * DESCRIPTION:
 * This script connects to Firebase Firestore via the Firebase Admin SDK,
 * queries all registered users who have explicitly given marketing consent
 * (`marketingConsent == true`), and exports their details into a clean, RFC-4180
 * compliant CSV file.
 *
 * PREREQUISITES:
 * 1. Ensure service account credentials are available. Set the environment variable:
 *    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
 *    (On Windows PowerShell: $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json")
 * 2. Or ensure you are authenticated using gcloud auth application-default login.
 *
 * USAGE:
 *    # Using npx tsx (recommended):
 *    npx tsx scripts/exportMarketingEmails.ts [optional-output-file.csv]
 *
 *    # Or using ts-node:
 *    npx ts-node scripts/exportMarketingEmails.ts marketing_export.csv
 *
 * OUTPUT COLUMNS:
 * - email: User's registered email address
 * - displayName: In-game or account display name
 * - country: User's country or region code (e.g. "US", "IN", "GB")
 * - consentTimestamp: ISO-8601 formatted timestamp of when consent was provided
 *
 * ============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface MarketingUserData {
  email?: string;
  displayName?: string;
  country?: string;
  consentTimestamp?: admin.firestore.Timestamp | string | number | null;
  createdAt?: admin.firestore.Timestamp | string | number | null;
}

/**
 * Escapes field values for standard RFC-4180 CSV compliance.
 */
function escapeCsvValue(val: string | null | undefined): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const stringVal = String(val);
  // If value contains double quotes, commas, or newlines, enclose in quotes and double internal quotes
  if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

/**
 * Normalizes timestamp to ISO string.
 */
function formatTimestamp(rawTimestamp: unknown): string {
  if (!rawTimestamp) {
    return '';
  }
  if (typeof (rawTimestamp as { toDate?: () => Date }).toDate === 'function') {
    return (rawTimestamp as { toDate: () => Date }).toDate().toISOString();
  }
  if (rawTimestamp instanceof Date) {
    return rawTimestamp.toISOString();
  }
  if (typeof rawTimestamp === 'number') {
    return new Date(rawTimestamp).toISOString();
  }
  if (typeof rawTimestamp === 'string') {
    return rawTimestamp;
  }
  return '';
}

/**
 * Main export routine.
 */
export async function exportMarketingEmails(outputPath?: string): Promise<string> {
  const destinationPath = outputPath || path.join(process.cwd(), 'marketing_opt_ins.csv');
  console.log('Querying users with marketing consent...');

  const snapshot = await db
    .collection('users')
    .where('marketingConsent', '==', true)
    .get();

  if (snapshot.empty) {
    console.log('No users found with marketing consent.');
    const headerOnly = 'email,displayName,country,consentTimestamp\n';
    fs.writeFileSync(destinationPath, headerOnly, 'utf8');
    return destinationPath;
  }

  const rows: string[] = ['email,displayName,country,consentTimestamp'];
  let validEmailsCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() as MarketingUserData;
    const email = data.email?.trim() || '';

    // Skip users without a valid email address
    if (!email) {
      continue;
    }

    const displayName = data.displayName?.trim() || 'Glam Artist';
    const country = data.country?.trim() || 'Unknown';
    const consentTime = formatTimestamp(data.consentTimestamp || data.createdAt);

    const row = [
      escapeCsvValue(email),
      escapeCsvValue(displayName),
      escapeCsvValue(country),
      escapeCsvValue(consentTime),
    ].join(',');

    rows.push(row);
    validEmailsCount++;
  }

  fs.writeFileSync(destinationPath, rows.join('\n') + '\n', 'utf8');

  console.log(`Successfully exported ${validEmailsCount} marketing email(s) to: ${destinationPath}`);
  return destinationPath;
}

// Execute script if run directly
if (require.main === module) {
  const customOutputPath = process.argv[2];
  exportMarketingEmails(customOutputPath)
    .then((filePath) => {
      console.log(`Export process finished: ${filePath}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error exporting marketing emails:', err);
      process.exit(1);
    });
}
