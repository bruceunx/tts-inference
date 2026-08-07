import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Workspace } from "@/components/landing/workspace";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <Hero />
      <Workspace />
      <Footer />
    </main>
  );
}
