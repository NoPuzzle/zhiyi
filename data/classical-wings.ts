import classicalWingsDataset from "./classical-wings.json";
import type { IsoDate } from "./content-reviews";

export const classicalTreatiseSlugs = [
  "xici-shang",
  "xici-xia",
  "shuogua",
  "xugua",
  "zagua",
] as const;

export type ClassicalTreatiseSlug = (typeof classicalTreatiseSlugs)[number];

export type ClassicalWingReview = {
  status: "source-recorded";
  recordedOn: IsoDate;
  method: "fixed-revision-readback";
};

export type ClassicalWingLineText = {
  position: string;
  original: string;
};

export type SixSmallImageTexts = [
  ClassicalWingLineText,
  ClassicalWingLineText,
  ClassicalWingLineText,
  ClassicalWingLineText,
  ClassicalWingLineText,
  ClassicalWingLineText,
];

export type ClassicalWingsSource = {
  id: string;
  work: string;
  edition: string;
  transcriptionProvider: string;
  catalogUrl: string;
  treatiseCatalogUrl: string;
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
    id: number | string;
    revisionId: number;
    field: string;
    reason: string;
  }>;
};

export type HexagramWingRecord = {
  id: number;
  name: string;
  pageTitle: string;
  revisionId: number;
  revisionUrl: string;
  review: ClassicalWingReview;
  tuanParagraphs: string[];
  smallImageTexts: SixSmallImageTexts;
  specialUseImageText?: ClassicalWingLineText;
  wenyanParagraphs?: string[];
};

export type ClassicalTreatisePage = {
  id: string;
  label: string;
  pageTitle: string;
  revisionId: number;
  revisionUrl: string;
  review: ClassicalWingReview;
  paragraphs: string[];
};

export type ClassicalTreatise = {
  slug: ClassicalTreatiseSlug;
  title: string;
  shortTitle: string;
  description: string;
  pages: ClassicalTreatisePage[];
};

type ClassicalWingsDataset = {
  schemaVersion: 1;
  generatedOn: IsoDate;
  source: ClassicalWingsSource;
  hexagrams: HexagramWingRecord[];
  treatises: ClassicalTreatise[];
};

const dataset = classicalWingsDataset as unknown as ClassicalWingsDataset;

export const classicalWingsGeneratedOn = dataset.generatedOn;
export const classicalWingsSource = dataset.source;
export const hexagramWings = dataset.hexagrams;
export const hexagramWingRecords = hexagramWings;
export const classicalTreatises = dataset.treatises;

export const hexagramWingsById = new Map(
  hexagramWings.map((record) => [record.id, record]),
);

export const classicalTreatisesBySlug = new Map(
  classicalTreatises.map((treatise) => [treatise.slug, treatise]),
);

export function isClassicalTreatiseSlug(
  value: string,
): value is ClassicalTreatiseSlug {
  return classicalTreatiseSlugs.some((slug) => slug === value);
}

export function getHexagramWings(id: number) {
  const record = hexagramWingsById.get(id);

  if (!record) {
    throw new Error(`Missing classical wings for hexagram ${id}`);
  }

  return record;
}

export function getClassicalTreatise(slug: ClassicalTreatiseSlug) {
  const treatise = classicalTreatisesBySlug.get(slug);

  if (!treatise) {
    throw new Error(`Missing classical treatise ${slug}`);
  }

  return treatise;
}
