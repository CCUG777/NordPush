import canonicalInventoryJson from "../../artifacts/latest/canonical_url_inventory.json";
import { normalizePath } from "@/lib/url-normalization";

type CanonicalRecord = {
  recordId: string;
  sourceUrl: string;
  sourcePath: string;
  canonicalUrl: string;
  canonicalPath: string;
  pageType: string;
  source: string;
  needsRedirect: boolean;
  trailingSlashExpected: boolean;
  notes: string[];
};

type CanonicalInventory = {
  generatedAt: string;
  records: CanonicalRecord[];
};

const canonicalInventory = canonicalInventoryJson as CanonicalInventory;

const canonicalByPath = new Map<string, CanonicalRecord>(
  canonicalInventory.records.map((record) => [normalizePath(record.canonicalPath), record]),
);

export function getCanonicalRecord(path: string): CanonicalRecord | undefined {
  return canonicalByPath.get(normalizePath(path));
}

export function listCanonicalRecords(): CanonicalRecord[] {
  return canonicalInventory.records;
}

export function getCanonicalInventoryGeneratedAt(): Date {
  return new Date(canonicalInventory.generatedAt);
}
