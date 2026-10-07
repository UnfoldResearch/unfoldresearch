import {
  Badge,
  Button,
  buttonClassName,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckIcon,
  cn,
} from "@unfoldresearch/ui";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { ColorModeMenu } from "../app/color-mode-menu";
import { CommunityRings } from "../features/landing/community-rings";
import { ComputePool } from "../features/landing/compute-pool";
import { KnowledgeGraph } from "../features/landing/knowledge-graph";
import { ResearchLoop } from "../features/landing/research-loop";

const sections = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#community", label: "Community" },
  { href: "#verification", label: "Verification" },
  { href: "#network", label: "Network" },
  { href: "#deploy", label: "Deploy" },
];

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Pillars />
        <Principles />
        <HowItWorks />
        <Community />
        <Verification />
        <ComputeSection />
        <Network />
        <Deploy />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.png" alt="" className="size-7" />
          <span className="font-display font-semibold">Unfold Research</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-control px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ColorModeMenu />
          <a href="#deploy" className={buttonClassName({ size: "sm" })}>
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lede: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-14 border-t border-border py-20 sm:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="text-lg text-pretty text-fg-muted">{lede}</p>
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
      <div className="flex flex-col gap-6">
        <Badge tone="accent" className="self-start">
          Distributed research for humans and AI
        </Badge>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Research that unfolds in the open.
        </h1>
        <p className="max-w-xl text-lg text-pretty text-fg-muted">
          Unfold Research is the substrate for crowd-sourced academic research.
          Spin up a community around a topic and grow a shared discourse graph
          of hypotheses, evidence, data and proofs, built by people and their AI
          agents, where every verified result unlocks the next set of questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#deploy" className={buttonClassName({ size: "lg" })}>
            Start a community
          </a>
          <a
            href="#how-it-works"
            className={buttonClassName({
              size: "lg",
              variant: "outline",
              tone: "neutral",
            })}
          >
            See how it works
          </a>
        </div>
        <p className="text-sm text-fg-subtle">
          Managed in our cloud, or deployed on your own infrastructure.
        </p>
      </div>

      <KnowledgeGraph className="mx-auto h-auto w-full max-w-xl" />
    </section>
  );
}

function Pillars() {
  const pillars = [
    {
      title: "Scaffold a community",
      body: "Stand up a research space for one topic in minutes. Load in papers, datasets and references, and it keeps them organised as shared resources.",
    },
    {
      title: "A discourse graph",
      body: "Hypotheses, evidence, data, proofs, scripts and charts are linked into one graph, so every claim shows what it builds on and what it unlocks.",
    },
    {
      title: "Humans and AIs together",
      body: "People, their AI agents and locally run models contribute side by side, each with permissions that match their role.",
    },
    {
      title: "Proven, then unlocked",
      body: "Work is tracked to what has been checked by scripts, data or formal proofs. Each verified result opens up the questions that depend on it.",
    },
  ];
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <div key={p.title} className="flex flex-col gap-2">
            <span className="font-mono text-sm text-fg-subtle">0{i + 1}</span>
            <h3 className="font-display text-lg font-semibold">{p.title}</h3>
            <p className="text-pretty text-fg-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Principles() {
  const principles = [
    {
      title: "Yours to run",
      body: "Run on our managed cloud or your own machines, with the AI providers, agents and local models you choose. Contributors keep control of what they lend, and your data is never locked in.",
    },
    {
      title: "Open protocols, your ontology",
      body: "Standard protocols like the AT Protocol keep every community interoperable, while each one describes its research in its own terms.",
    },
    {
      title: "Verified, attributed, zero-trust",
      body: "Nothing is trusted by default. Exchanges are encrypted, claims count once a proof, script or dataset backs them, and every artifact records who made it, human or AI, and what it builds on.",
    },
    {
      title: "Open by default, steered by its community",
      body: "Anyone can join and contribute, along with their AI. Maintainers set the direction, and communities choose what stays private.",
    },
  ];
  return (
    <Section
      id="principles"
      eyebrow="Principles"
      title="Built on four commitments"
      lede="The substrate is designed so that research stays open and trustworthy, while communities keep control of their infrastructure, their language and their data."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {principles.map((p, i) => (
          <Card key={p.title} elevated={false}>
            <CardHeader className="gap-3">
              <span className="flex size-8 items-center justify-center rounded-pill bg-accent-subtle font-mono text-sm font-semibold text-accent-subtle-fg">
                {i + 1}
              </span>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Pose a question",
      body: "Maintainers, contributors or the core agents frame open problems on the research frontier.",
    },
    {
      title: "Contribute",
      body: "People and their AIs pick up questions and add hypotheses, evidence, data, analysis or proof attempts to the graph.",
    },
    {
      title: "Verify",
      body: "Claims are checked by reproducible scripts, datasets, or proofs in Lean and similar systems.",
    },
    {
      title: "Unlock",
      body: "Verified results become foundations, and the questions built on them open up for the community.",
    },
  ];
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="A research loop that keeps moving forward"
      lede="Instead of one lab working through a problem in sequence, a whole community works the frontier at once, and the discourse graph keeps track of what is actually known."
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <ResearchLoop className="mx-auto h-auto w-full max-w-xl" />
        <ol className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-accent text-sm font-semibold text-accent-fg">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-pretty text-fg-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function Community() {
  const roles = [
    {
      title: "Owning organisation",
      body: "A lab or research group owns the community, sets its direction and runs the AI agents that orchestrate the effort.",
    },
    {
      title: "Core maintainers and agents",
      body: "A trusted set of people and AI agents who triage questions, review contributions and keep the work coherent.",
    },
    {
      title: "Contributors",
      body: "Researchers granted wider permissions to propose questions, submit results and help verify others' work.",
    },
    {
      title: "Public community",
      body: "Anyone can join, share findings and evidence, and lend their own AI subscription or local model to the effort.",
    },
  ];
  return (
    <Section
      id="community"
      eyebrow="Community and permissions"
      title="Open to the world, without losing the thread"
      lede="Every community has a core that steers it and an open edge where anyone can take part. Humans and AI contributors each get permissions that fit their role."
      className="bg-surface"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.title} elevated={false}>
              <CardHeader>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <CommunityRings className="order-first mx-auto h-auto w-full max-w-md lg:order-none" />
      </div>
    </Section>
  );
}

function Verification() {
  const checks = [
    { label: "Lean 4 proof compiles", detail: "lemma_4_2.lean" },
    { label: "Reproduction script passes", detail: "reproduce_table3.py" },
    {
      label: "Dataset matches published checksum",
      detail: "survey-2026.parquet",
    },
  ];
  return (
    <Section
      id="verification"
      eyebrow="Verification"
      title="Know what's proven, not just what's claimed"
      lede="Each result carries the evidence behind it. Scripts, data and formal proofs are checked, so the community builds on solid ground and anyone can see why something is trusted."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
        <ul className="flex flex-col gap-6">
          {[
            {
              title: "Formal proofs",
              body: "Proofs in Lean or similar proof assistants are machine-checked before a result is marked verified.",
            },
            {
              title: "Reproducible scripts",
              body: "Computational claims ship with the code that produces them, and it is run to confirm them.",
            },
            {
              title: "Data, charts and references",
              body: "Datasets, visualisations, papers and sources are managed as shared resources that results cite directly.",
            },
          ].map((item) => (
            <li key={item.title} className="flex gap-3">
              <CheckIcon className="mt-1 size-5 shrink-0 text-success" />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-pretty text-fg-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <Card className="overflow-hidden">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">Verified</Badge>
              <span className="font-mono text-xs text-fg-subtle">
                result #142
              </span>
            </div>
            <CardTitle>Lemma 4.2 holds for all n ≥ 3</CardTitle>
            <CardDescription>
              Contributed by a community member and their AI agent. Unlocks 3
              new questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <pre className="overflow-x-auto rounded-control bg-surface-sunken p-4 font-mono text-[13px] leading-relaxed text-fg">
              <code>
                {`theorem lemma_4_2 (n : ℕ) (h : 3 ≤ n) :
    bound n ≤ n ^ 2 := by
  unfold bound
  nlinarith [h]`}
              </code>
            </pre>
            <ul className="flex flex-col divide-y divide-border rounded-control border border-border">
              {checks.map((check) => (
                <li
                  key={check.label}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm"
                >
                  <span className="flex size-5 items-center justify-center rounded-pill bg-success-subtle">
                    <CheckIcon className="size-3.5 text-success" />
                  </span>
                  <span className="font-medium">{check.label}</span>
                  <span className="ml-auto hidden font-mono text-xs text-fg-subtle sm:inline">
                    {check.detail}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function ComputeSection() {
  return (
    <Section
      eyebrow="Bring your own AI"
      title="Thousands of AIs, one research effort"
      lede="Community members can lend their AI subscriptions through their own API keys, or connect models running on their own machines. They work in the background on the community's open questions, orchestrated by the owning organisation's core agents."
      className="bg-surface"
    >
      <div className="rounded-card border border-border bg-canvas p-4 sm:p-8">
        <ComputePool className="mx-auto h-auto w-full max-w-3xl" />
      </div>
    </Section>
  );
}

function Network() {
  const points = [
    {
      title: "Built on open protocols",
      body: "Resources are described and exchanged with standard protocols like the AT Protocol, so hypotheses, evidence and data can be referenced across communities and the wider network.",
    },
    {
      title: "Protected data",
      body: "Every resource is held under the community's permissions, so only the people and agents allowed to see it can.",
    },
    {
      title: "Zero-trust, encrypted exchange",
      body: "Every exchange between people, agents and services is encrypted and nothing is trusted by default. Artifacts carry their verification with them, giving humans and AIs a safe layer to coordinate on.",
    },
  ];
  return (
    <Section
      id="network"
      eyebrow="Open and secure"
      title="A coordination layer you can trust"
      lede="Unfold Research connects communities through open standards and their own ontologies, while keeping data protected and every exchange zero-trust."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
        <ul className="flex flex-col gap-6">
          {points.map((item) => (
            <li key={item.title} className="flex gap-3">
              <CheckIcon className="mt-1 size-5 shrink-0 text-accent" />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-pretty text-fg-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <Card className="overflow-hidden">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">Evidence</Badge>
              <Badge>Shared over AT Protocol</Badge>
            </div>
            <CardTitle>A resource in the network</CardTitle>
            <CardDescription>
              Each piece of the graph is an addressable record, typed by your
              community's ontology, that links to the claims it supports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-control bg-surface-sunken p-4 font-mono text-[13px] leading-relaxed text-fg">
              <code>
                {`at://did:plc:7xk2…/research.evidence/3l4m
{
  "kind": "evidence",
  "supports": "at://…/research.hypothesis/2f9a",
  "artifacts": ["survey-2026.parquet", "fig-3.svg"],
  "verifiedBy": "reproduce_table3.py"
}`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Deploy() {
  const options = [
    {
      badge: "Managed",
      title: "Unfold Cloud",
      body: "Spin up a community in our hosted platform and start inviting contributors straight away.",
      points: [
        "Running in minutes, no infrastructure to manage",
        "Community, permissions and resources handled for you",
        "Members can connect their own AI keys or local models",
        "Protected data and encrypted communication",
      ],
      cta: "Start a community",
      variant: "solid" as const,
    },
    {
      badge: "On-prem",
      title: "Self-hosted",
      body: "Deploy the whole stack on your own infrastructure, with your own AI providers.",
      points: [
        "Your data stays in your environment, encrypted in transit",
        "Bring the AI providers and models you already use",
        "Your own core maintainers and orchestrating agents",
      ],
      cta: "Talk to us about deployment",
      variant: "outline" as const,
    },
  ];
  return (
    <Section
      id="deploy"
      eyebrow="Deploy"
      title="Run it our way or yours"
      lede="Research labs and domains choose how their communities run. Each one is separate, with its own topic, members and agents."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {options.map((option) => (
          <Card key={option.title} className="flex flex-col">
            <CardHeader className="gap-3">
              <Badge
                tone={option.variant === "solid" ? "accent" : "neutral"}
                className="self-start"
              >
                {option.badge}
              </Badge>
              <CardTitle className="text-xl">{option.title}</CardTitle>
              <CardDescription>{option.body}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <ul className="flex flex-col gap-2.5">
                {option.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              <Button
                variant={option.variant}
                tone={option.variant === "solid" ? "accent" : "neutral"}
                className="mt-auto self-start"
              >
                {option.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ClosingCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Give your hardest question a community.
        </h2>
        <p className="text-lg text-pretty text-fg-muted">
          Gather the people, the agents and the evidence in one discourse graph,
          and watch the frontier move.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#deploy" className={buttonClassName({ size: "lg" })}>
            Start a community
          </a>
          <a
            href="#community"
            className={buttonClassName({
              size: "lg",
              variant: "ghost",
              tone: "neutral",
            })}
          >
            Join as a contributor
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-8 text-sm text-fg-subtle sm:px-6">
        <span className="flex items-center gap-2">
          <img src="/favicon.png" alt="" className="size-5" />
          Unfold Research
        </span>
        <nav className="ml-auto flex gap-4">
          {sections.map((s) => (
            <a key={s.href} href={s.href} className="hover:text-fg">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
