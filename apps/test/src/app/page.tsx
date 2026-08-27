import CMS from "@basalf/cms";
import SLOT from "@basalf/slot";
import { addMonths } from "date-fns";

// const CMStestToken = "°°°°°°°°°°°°";
// const cms = new CMS(CMStestToken);

const SLOTtestToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb25JZCI6Im9yZ185MThiZjMyZS0wMzY1LTQwYjktOTNmYi03YzA4MTRkYWU4ZGQiLCJ3ZWJzaXRlSWQiOiJzZXJ2aWNlX2RlZmF1bHRfb3JnXzkxOGJmMzJlLTAzNjUtNDBiOS05M2ZiLTdjMDgxNGRhZThkZCIsImFwaUlkIjoiOW9pYXA2OGduayJ9.un1Fh5Amt3josJn_be2WlGUgZWAgePhrAUOUubtFt54";
const slot = new SLOT(SLOTtestToken);

export default async function Home() {
  const services = await slot.getServices();
  console.log(services);

  const startDate = new Date();
  const endDate = addMonths(new Date(), 1);
  const slots = await slot.getSlots(
    startDate.toISOString(),
    endDate.toISOString(),
  );
  console.log(slots);
  return (
    <main className="flex flex-col p-4">
      <div className="flex flex-col">
        {services.map((service) => (
          <div key={service.serviceId}>{service.name}</div>
        ))}
      </div>
    </main>
  );
}
