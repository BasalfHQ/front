export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-w-0 max-w-[1024px] mx-auto">{children}</main>
  );
}
