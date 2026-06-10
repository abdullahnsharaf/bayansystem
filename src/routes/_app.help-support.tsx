import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageCircle, Mail } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { helpFaqs } from "@/lib/bayan-data";

export const Route = createFileRoute("/_app/help-support")({
  component: HelpSupportPage,
});

function HelpSupportPage() {
  return (
    <PageTransition>
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-lg bg-bayan-amber/10 p-3 text-bayan-amber">
          <LifeBuoy className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">We're here to help</p>
          <h1 className="display-heading text-3xl text-bayan-green-deep">Help & support</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="display-heading text-xl text-bayan-green-deep">Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {helpFaqs.map((question, index) => (
                <AccordionItem key={question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">{question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    BAYAN provides clear, explainable answers powered by the platform's cognitive engines. Reach out to support for a tailored walkthrough.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="card-flat rounded-xl border-border shadow-none">
          <CardHeader>
            <CardTitle className="display-heading text-xl text-bayan-green-deep">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
              <MessageCircle className="size-4 text-bayan-green-deep" />
              <div>
                <p className="font-medium">Chat with us</p>
                <p className="text-xs text-muted-foreground">Mon–Fri · 9:00–18:00 MYT</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
              <Mail className="size-4 text-bayan-green-deep" />
              <div>
                <p className="font-medium">support@bayan.my</p>
                <p className="text-xs text-muted-foreground">Response within 1 business day</p>
              </div>
            </div>
            <Button className="w-full bg-bayan-green-deep text-primary-foreground hover:bg-bayan-green-deep/90">
              Submit a ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
