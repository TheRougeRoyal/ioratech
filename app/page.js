export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
        Iora - Climate Intelligence
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 max-w-2xl text-center">
        Enterprise-grade carbon analytics, climate risk forecasting, and regulatory foresight for organizations worldwide.
      </p>
      <div className="space-x-4">
        <a
          href="/login"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Sign In
        </a>
        <a
          href="/signup"
          className="px-6 py-3 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium"
        >
          Sign Up
        </a>
      </div>
    </main>
  );
}