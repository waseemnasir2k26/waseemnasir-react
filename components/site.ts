export const BOOKING = "/book";
export const EMAIL = "waseem@skynetjoe.com";
export const GITHUB = "https://github.com/waseemnasir2k26";
export const AGENCY = "https://skynetjoe.com";

/** Single source of truth for real proof numbers — used in Hero + FinalCTA */
export const PROOF = [
  { value: 180, suffix: "+", label: "workflows built" },
  { value: 40, suffix: "+", label: "sites shipped" },
  { value: 9, suffix: "", label: "countries served" },
  { value: 2019, suffix: "", label: "in practice since", roll: false },
] as const;

/** Fiverr gig URL for the mentorship offer (one gig, three packages: $199 / $800 / $2,000).
 *  Paste the gig URL here once it exists. While empty, the mentorship tier buttons
 *  fall back to the free fit call at /book. */
export const MENTORSHIP_FIVERR_URL = "";
