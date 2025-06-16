import { PricingTable } from "@clerk/nextjs";

function Billing() {
  return (
    <div>
      <h2 className="font-bold text-3xl text-center text-customTeal">
        Choose Your Plan
      </h2>
      <p className="text-lg text-center">
        Select a subscription bundle to get all AI Tools access.
      </p>
      <div className="mt-6">
        <PricingTable
          appearance={{
            variables: {
              colorPrimary: "#0e545b",
              colorText: "#1c1c1c",
              colorBackground: "#f0f7f7",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Billing;
