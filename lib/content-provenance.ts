import type { AuthoredContentReview } from "../data/content-reviews";
import type { HexagramClassicalText } from "../data/classical-text";

export function authoredReviewLabel(review: AuthoredContentReview) {
  return review.status === "first-pass-reviewed" ? "首轮审校完成" : "详细草稿";
}

export function classicalReviewLabel(classical: HexagramClassicalText) {
  return classical.review.status === "source-recorded"
    ? "固定版本已回读"
    : "来源核验中";
}

export function classicalRevisionLabel(classical: HexagramClassicalText) {
  return `${classical.pageTitle} · oldid ${classical.revisionId}`;
}
