import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Switch,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
  Tooltip,
} from "@unfoldresearch/ui";
import type { ReactNode } from "react";

import { KnobControls } from "../features/playground/knob-controls";

const variants = ["solid", "soft", "outline", "ghost"] as const;
const tones = ["accent", "neutral", "danger"] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium tracking-wide text-fg-subtle uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function PlaygroundPage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Playground
        </h1>
        <p className="text-fg-muted">
          Every @unfoldresearch/ui component, rendered with the current tokens.
        </p>
      </div>

      <KnobControls />

      <Section title="Buttons">
        <div className="flex flex-col gap-3">
          {tones.map((tone) => (
            <div key={tone} className="flex flex-wrap items-center gap-2">
              {variants.map((variant) => (
                <Button key={variant} variant={variant} tone={tone}>
                  {variant} {tone}
                </Button>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="you@example.com" required />
            <FieldDescription>We'll never share it.</FieldDescription>
            <FieldError />
          </Field>
          <Field invalid>
            <FieldLabel>Username</FieldLabel>
            <Input defaultValue="taken" />
            <FieldError match>That username is taken.</FieldError>
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <Switch defaultChecked /> Notifications
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Checkbox defaultChecked /> Accept terms
          </label>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="overview">
          <TabsList>
            <Tab value="overview">Overview</Tab>
            <Tab value="activity">Activity</Tab>
            <Tab value="settings">Settings</Tab>
          </TabsList>
          <TabsPanel value="overview" className="text-sm text-fg-muted">
            Overview content.
          </TabsPanel>
          <TabsPanel value="activity" className="text-sm text-fg-muted">
            Activity content.
          </TabsPanel>
          <TabsPanel value="settings" className="text-sm text-fg-muted">
            Settings content.
          </TabsPanel>
        </Tabs>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" tone="neutral" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete project?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" tone="neutral" />}>
                  Cancel
                </DialogClose>
                <DialogClose render={<Button tone="danger" />}>
                  Delete
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Menu>
            <MenuTrigger render={<Button variant="outline" tone="neutral" />}>
              Open menu
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>Project</MenuGroupLabel>
                <MenuItem>Rename</MenuItem>
                <MenuItem>Duplicate</MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem tone="danger">Delete</MenuItem>
            </MenuContent>
          </Menu>

          <Tooltip content="Tooltips use the neutral role">
            <Button variant="ghost" tone="neutral">
              Hover me
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Starter plan</CardTitle>
            <CardDescription>Everything you need to get going.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-fg-muted">
            Cards compose header, content and footer slots.
          </CardContent>
          <CardFooter>
            <Button size="sm">Choose</Button>
            <Button size="sm" variant="ghost" tone="neutral">
              Learn more
            </Button>
          </CardFooter>
        </Card>
      </Section>
    </div>
  );
}
