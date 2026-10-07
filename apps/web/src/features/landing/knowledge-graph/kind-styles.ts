// Each kind gets its own tone so classes read apart at a glance. `shape` is
// the pill or circle; `text` is its label.
export const kindStyles = {
  claim: {
    label: "Claim",
    shape: "fill-success-subtle stroke-success",
    text: "fill-success-subtle-fg",
  },
  hypothesis: {
    label: "Hypothesis",
    shape: "fill-warning-subtle stroke-warning",
    text: "fill-warning-subtle-fg",
  },
  data: {
    label: "Data",
    shape: "fill-neutral-subtle stroke-fg-subtle",
    text: "fill-fg-muted",
  },
  evidence: {
    label: "Evidence",
    shape: "fill-danger-subtle stroke-danger",
    text: "fill-danger-subtle-fg",
  },
  proof: {
    label: "Proof",
    shape: "fill-accent-subtle stroke-accent",
    text: "fill-accent-subtle-fg",
  },
};
