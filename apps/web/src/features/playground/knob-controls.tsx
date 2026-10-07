import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
} from "@unfoldresearch/ui";
import { useEffect, useState } from "react";

/**
 * Live-edit the design knobs from @unfoldresearch/tokens (knobs.css) to try out a look.
 * Changes are applied to <html> inline and are not persisted; copy the output into knobs.css.
 */
const knobs = [
  {
    name: "--knob-accent-hue",
    label: "Accent hue",
    min: 0,
    max: 360,
    step: 1,
    unit: "",
  },
  {
    name: "--knob-accent-chroma",
    label: "Accent chroma",
    min: 0,
    max: 0.37,
    step: 0.01,
    unit: "",
  },
  {
    name: "--knob-neutral-hue",
    label: "Neutral hue",
    min: 0,
    max: 360,
    step: 1,
    unit: "",
  },
  {
    name: "--knob-neutral-chroma",
    label: "Neutral chroma",
    min: 0,
    max: 0.06,
    step: 0.002,
    unit: "",
  },
  {
    name: "--knob-radius",
    label: "Radius",
    min: 0,
    max: 1.5,
    step: 0.05,
    unit: "rem",
  },
  {
    name: "--knob-density",
    label: "Density",
    min: 0.75,
    max: 1.25,
    step: 0.025,
    unit: "",
  },
] as const;

type KnobName = (typeof knobs)[number]["name"];

function readKnob(name: KnobName) {
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  );
}

export function KnobControls() {
  const [values, setValues] = useState(
    () =>
      Object.fromEntries(
        knobs.map((k) => [k.name, readKnob(k.name)]),
      ) as Record<KnobName, number>,
  );

  useEffect(() => {
    const style = document.documentElement.style;
    for (const knob of knobs)
      style.setProperty(knob.name, `${values[knob.name]}${knob.unit}`);
    return () => {
      for (const knob of knobs) style.removeProperty(knob.name);
    };
  }, [values]);

  const css = knobs
    .map((k) => `  ${k.name}: ${values[k.name]}${k.unit};`)
    .join("\n");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design knobs</CardTitle>
        <CardDescription>
          Preview changes live, then paste the result into{" "}
          <code>packages/tokens/src/knobs.css</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {knobs.map((knob) => (
            <Field key={knob.name}>
              <FieldLabel className="flex justify-between">
                {knob.label}
                <span className="font-mono text-fg-subtle">
                  {values[knob.name]}
                  {knob.unit}
                </span>
              </FieldLabel>
              <Input
                type="range"
                min={knob.min}
                max={knob.max}
                step={knob.step}
                value={values[knob.name]}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, [knob.name]: Number(value) }))
                }
                className="h-auto border-0 px-0 accent-accent hover:border-0"
              />
            </Field>
          ))}
        </div>
        <pre className="overflow-auto rounded-control bg-surface-sunken p-4 font-mono text-xs text-fg-muted">
          {`:root {\n${css}\n}`}
        </pre>
      </CardContent>
    </Card>
  );
}
