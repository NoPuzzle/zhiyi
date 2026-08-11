export type IsoDate = `${number}-${number}-${number}`;

export type AuthoredContentReview =
  | {
      status: "draft";
      recordedOn: IsoDate;
      note: string;
    }
  | {
      status: "first-pass-reviewed";
      reviewedOn: IsoDate;
      method: "codex-assisted-editorial-pass";
      scope: "product-authored";
    };

function reviewedRange(
  start: number,
  end: number,
  reviewedOn: IsoDate,
): Array<[number, AuthoredContentReview]> {
  return Array.from({ length: end - start + 1 }, (_, index) => [
    start + index,
    {
      status: "first-pass-reviewed",
      reviewedOn,
      method: "codex-assisted-editorial-pass",
      scope: "product-authored",
    },
  ]);
}

export const authoredContentReviews = new Map<number, AuthoredContentReview>([
  ...reviewedRange(1, 3, "2026-08-09"),
  ...reviewedRange(4, 10, "2026-07-31"),
  ...reviewedRange(11, 64, "2026-08-08"),
]);

export function getAuthoredContentReview(id: number) {
  const review = authoredContentReviews.get(id);

  if (!review) {
    throw new Error(`Missing authored content review for hexagram ${id}`);
  }

  return review;
}
