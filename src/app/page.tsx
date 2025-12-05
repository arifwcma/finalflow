import RiverMap from "@/components/RiverMap";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-100 py-6 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            River Flows Map
          </h1>
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">&gt;</span>
            <span>Advice and services</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-800">River flows map</span>
          </nav>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#697e8d] text-white p-6 rounded-lg mb-6">
          <p className="mb-4">
            The map below displays current flows at gauges we monitor across our region,
            but you can also sign up to our SMS alert service, which sends text messages
            concerning when and where environmental flows are occurring, what they aim to
            achieve, and flow rates.
          </p>
          <p className="font-semibold italic mb-4">
            To sign up, send a sms with the word &apos;register&apos; and full name and locality
            to 0427 871 565 or email{" "}
            <a
              href="mailto:wcma@wcma.vic.gov.au?subject=Website:%20EWR%20SMS%20alerts"
              className="underline hover:text-blue-200"
            >
              Wimmera CMA
            </a>
            .
          </p>
          <p>
            Text messages will provide information specifically about environmental flows
            released from storages. Natural flows along creeks and rivers will not be part
            of this service.
          </p>
        </div>

        {/* Flow Update Box */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-4">
            <h4 className="font-bold text-lg mb-3">December/ Early January Flow Update</h4>
            <blockquote className="text-gray-700 text-sm leading-relaxed">
              <p className="mb-3">
                Flows have stopped in the Wimmera River, from Taylors Lake and will
                recommence to maintain habitat and water quality on 9-17 December and from
                the 6 -13 January 2026.
              </p>
              <p className="mb-3">
                A short flow in the Upper MacKenzie River and Burnt Creek from Wartook
                Reservoir will occur from 9-15 December and will replenish drought refuges
                in the lower Burnt Creek section. Another short flow will recommence on
                the 6-8 January 2026 to maintain drought refuges in the Upper Burnt Creek.
              </p>
              <p>
                Watering at seven wetlands from the Wimmera Mallee pipeline is occurring
                until mid-December 2025 to top water levels to minimise loss over summer.
              </p>
            </blockquote>
          </div>
          <div className="border rounded-lg p-4">
            {/* Placeholder for second announcement box if needed */}
          </div>
        </div>
      </div>

      {/* River Map */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <RiverMap />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="mb-2">
            We acknowledge the Traditional Owners and other Aboriginal and Torres Strait
            Islander Peoples across the region and pay respect to Elders past, present
            and emerging.
          </p>
          <p className="text-gray-400 text-xs">
            Data sourced from{" "}
            <a
              href="https://data.water.vic.gov.au/WMIS/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Victorian Water Measurement Information System (WMIS)
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

