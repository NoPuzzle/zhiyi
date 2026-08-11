import classicalTextDataset from "./classical-text.json";
import type { IsoDate } from "./content-reviews";

export type ClassicalReviewStatus = "source-recorded";
export type ClassicalVerificationMethod = "fixed-revision-readback";

export type ClassicalLineText = {
  position: string;
  original: string;
};

export type SixClassicalLineTexts = [
  ClassicalLineText,
  ClassicalLineText,
  ClassicalLineText,
  ClassicalLineText,
  ClassicalLineText,
  ClassicalLineText,
];

export type ClassicalSource = {
  id: string;
  work: string;
  edition: string;
  transcriptionProvider: string;
  catalogUrl: string;
  bibliographicScanUrl: string;
  publicDomainStatement: string;
  licenseUrl: string;
  accessDate: IsoDate;
  textPolicy: string;
  verificationPolicy: string;
  structuralCrossCheck: {
    provider: string;
    repository: string;
    commit: string;
    purpose: string;
  };
  extractionCorrections: Array<{
    id: number;
    revisionId: number;
    field: string;
    reason: string;
  }>;
};

export type HexagramClassicalText = {
  id: number;
  name: string;
  pageTitle: string;
  revisionId: number;
  revisionUrl: string;
  review: {
    status: ClassicalReviewStatus;
    recordedOn: IsoDate;
    method: ClassicalVerificationMethod;
  };
  judgmentOriginal: string;
  imageText: string;
  lineTexts: SixClassicalLineTexts;
  specialUseText?: ClassicalLineText;
};

type ClassicalTextDataset = {
  schemaVersion: 1;
  generatedOn: IsoDate;
  source: ClassicalSource;
  records: HexagramClassicalText[];
};

const dataset = classicalTextDataset as unknown as ClassicalTextDataset;

export const classicalSource = dataset.source;
export const classicalTextRecords = dataset.records;
export const classicalTextById = new Map(
  classicalTextRecords.map((record) => [record.id, record]),
);

export function getClassicalText(id: number) {
  const classical = classicalTextById.get(id);

  if (!classical) {
    throw new Error(`Missing classical text for hexagram ${id}`);
  }

  return classical;
}
