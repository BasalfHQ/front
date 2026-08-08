import { Button } from "@repo/auth-ui";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">cms</h1>
      <Button variant="secondary">CMS Button</Button>
    </main>
  );
}
