import { JsonLd } from "@/features/b2b/components/json-ld";
import { webSiteSchema } from "@/lib/seo";

export default function Home() {
  return (
    <main className="w-full min-w-0 max-w-[1024px] mx-auto">
      {/* Gives Google the site name shown above every result of the site. */}
      <JsonLd data={webSiteSchema()} />
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Book</h1>
        <p className="text-muted-foreground">
          Online appointment booking platform
        </p>
      </div>
    </main>
  );
}
