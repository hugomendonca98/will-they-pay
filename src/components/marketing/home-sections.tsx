import { IconCheck, IconSetaDireita } from "@/components/icons";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { SiteCtaButton } from "@/components/marketing/site-cta";
import { LeadForm } from "@/components/lead-form";
import { PricingCards } from "@/components/pricing-cards";
import { getSiteIcon } from "@/content/icon-map";
import { site } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function HeroTitle() {
  const { title, titleHighlight } = site.hero;
  if (!title.endsWith(titleHighlight)) {
    return <>{title}</>;
  }
  const before = title.slice(0, title.length - titleHighlight.length);
  return (
    <>
      {before}
      <span className="text-primary">{titleHighlight}</span>
    </>
  );
}

export function HeroSection() {
  const hero = site.hero;

  return (
    <section
      className="relative border-b bg-[radial-gradient(ellipse_85%_60%_at_75%_0%,color-mix(in_oklch,var(--success),transparent_72%),transparent)] dark:bg-[radial-gradient(ellipse_85%_60%_at_75%_0%,color-mix(in_oklch,var(--success),transparent_88%),transparent)]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        <div className="space-y-6">
          <Badge variant="gold" className="h-7 px-3 py-1 text-xs font-semibold">
            {hero.badge}
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            <HeroTitle />
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg text-pretty">{hero.subtitle}</p>
          <p className="text-muted-foreground text-sm">{hero.editHint}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SiteCtaButton cta={hero.primaryCta} size="lg" className="h-11 px-5">
              <IconSetaDireita decorative className="size-4" data-icon="inline-end" />
            </SiteCtaButton>
            <SiteCtaButton
              cta={hero.secondaryCta}
              size="lg"
              variant="outline"
              className="h-11 px-5"
            />
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {hero.stackLabel}
            </p>
            <ul className="flex flex-wrap gap-2">
              {hero.stackChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold shadow-sm"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col gap-2 text-sm">
            {hero.highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
                  <IconCheck decorative className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const section = site.features;

  return (
    <section id={section.sectionId} className="border-t bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            {section.eyebrow}
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">{section.subtitle}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {section.items.map((feature) => {
            const Icon = getSiteIcon(feature.icon);
            return (
              <Card key={feature.title} className="h-full border bg-card shadow-sm">
                <CardHeader>
                  <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-success/80 text-success-foreground">
                    <Icon decorative className="size-5" />
                  </span>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const section = site.pricing;

  return (
    <section id={section.sectionId} className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            {section.eyebrow}
          </p>
          <Badge variant="secondary" className="mt-2">{section.demoBadge}</Badge>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">{section.subtitle}</p>
        </div>
        <PricingCards />
      </div>
    </section>
  );
}

export function ContactSection() {
  const section = site.contact;

  return (
    <section id={section.sectionId} className="border-t bg-muted/30 py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="space-y-6">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            {section.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground text-pretty">{section.subtitle}</p>
          <Button variant="link" className="h-auto p-0" render={<a href={site.issuesUrl} target="_blank" rel="noopener noreferrer" />}>
            {section.issuesLinkLabel}
          </Button>
          <ul className="space-y-4">
            {section.points.map((point) => {
              const Icon = getSiteIcon(point.icon);
              return (
                <li key={point.title} className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon decorative className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{point.title}</p>
                    <p className="text-muted-foreground text-sm">{point.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

export function FaqSection() {
  const section = site.faq;

  return (
    <section id={section.sectionId} className="py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 lg:px-8">
        <div className="text-center">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            FAQ
          </p>
          <h2 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-pretty">{section.subtitle}</p>
        </div>
        <Accordion defaultValue={["item-0"]} className="mt-10 w-full">
          {section.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
