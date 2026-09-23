const apps = [
  { label: "Book", href: "https://book.basalf.com" },
  { label: "Slot", href: "https://slot.basalf.com" },
  { label: "CMS", href: "https://cms.basalf.com" },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full bg-neutral-900 text-neutral-300">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-6 max-w-6xl mx-auto">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <a href="mailto:alfgoto@gmail.com" className="hover:text-white hover:underline">
            alfgoto@gmail.com
          </a>
        </p>
        <div className="flex items-center gap-4 text-sm">
          {apps.map((app) => (
            <a key={app.href} href={app.href} className="hover:text-white hover:underline">
              {app.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
