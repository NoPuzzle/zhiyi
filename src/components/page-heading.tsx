export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 pb-8 pt-6 sm:px-8">
      <p className="ui-copy text-xs font-medium uppercase tracking-[0.22em] text-vermilion">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-normal text-ink">
        {title}
      </h1>
      <div className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        {children}
      </div>
    </section>
  );
}
