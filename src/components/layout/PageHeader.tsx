/**
 * Inner-page header block — the h1 and its standfirst.
 *
 * Inner pages have no video band, so they need top padding that clears the
 * fixed header. --hero-content-gap reuses the homepage's measured rhythm
 * rather than inventing a second spacing value.
 */
export function PageHeader({
  title,
  standfirst,
}: {
  title: string;
  standfirst?: string;
}) {
  return (
    <header className="pt-(--hero-content-gap)">
      <h1 className="type-h2 text-ink">{title}</h1>
      {standfirst ? (
        <p className="type-body mt-(--spacing-6) max-w-[55ch] text-ink-muted">
          {standfirst}
        </p>
      ) : null}
    </header>
  );
}
