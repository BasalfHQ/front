import CMS from "@basalf/cms";

const testToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25JZCI6Im9yZ184MDAzNzRmOS1lZDgwLTRmYWQtOTUyYS04N2Q5ZWZjMjFmNmMiLCJ3ZWJzaXRlSWQiOiJ3ZWJzaXRlX2RlZmF1bHRfb3JnXzgwMDM3NGY5LWVkODAtNGZhZC05NTJhLTg3ZDllZmMyMWY2YyJ9.mI7oeUogu349fZDZO1RX15Zso_h8XKmeJXuoV3oqsUw";
const cms = new CMS(testToken);

export default async function Home() {
  const pages = await cms.getPages();
  const page = await cms.getPage(pages[0].pageId);
  console.log(page);
  return (
    <main className="flex flex-col p-4">
      <div className="flex flex-col">{pages.map((page) => <div key={page.pageId}>{page.url}</div>)}</div>
      <div className="flex flex-col">{page.slices.map((slice) => <div key={slice.sliceId}>{slice.type}</div>)}</div>
    </main>
  );
}
