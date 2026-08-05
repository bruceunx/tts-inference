import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Hello World
      </h1>
    </main>
  );
}
