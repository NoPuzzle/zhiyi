export type HexagramLineContent = {
  position?: string;
  plain: string;
  reflection: string;
};

export type HexagramContentPatch = {
  imageObservation: string;
  application: string;
  judgmentPlain?: string;
  coreMeaning?: string;
  reflectionQuestions?: [string, string, string];
  smallAction?: string;
  lineTexts: HexagramLineContent[];
};
