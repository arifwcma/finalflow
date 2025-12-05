export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar - matching original site */}
      <div className="bg-[#1d384c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="https://wcma.vic.gov.au" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://wcma.vic.gov.au/wp-content/themes/wimmera/static/logo-wimmera-white.png" 
              alt="Wimmera CMA" 
              className="h-12"
            />
          </a>
          <nav className="hidden md:flex space-x-6 text-sm">
            <a href="https://wcma.vic.gov.au/" className="hover:text-gray-300">Home</a>
            <a href="https://wcma.vic.gov.au/wimmera-region/" className="hover:text-gray-300">Wimmera region</a>
            <a href="https://wcma.vic.gov.au/advice-and-services/" className="hover:text-gray-300">Advice & services</a>
            <a href="https://wcma.vic.gov.au/get-involved/" className="hover:text-gray-300">Get involved</a>
            <a href="https://wcma.vic.gov.au/category/news/" className="hover:text-gray-300">News & resources</a>
            <a href="https://wcma.vic.gov.au/about-us/" className="hover:text-gray-300">About us</a>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gray-100 py-6 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            River flows map
          </h1>
          <nav className="text-sm text-gray-600">
            <a href="https://wcma.vic.gov.au/" className="hover:underline">Home</a>
            <span className="mx-2">&gt;</span>
            <a href="https://wcma.vic.gov.au/advice-and-services/" className="hover:underline">Advice and services</a>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-800">River flows map</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Info Banner */}
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

        {/* Flow Update Boxes */}
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
            {/* Placeholder for second announcement if needed */}
          </div>
        </div>

        {/* River Map - embedded via iframe */}
        <iframe
          src="/iframe"
          width="100%"
          height="1700"
          style={{ border: "none" }}
          title="River Flows Map"
        />
      </div>

      {/* Acknowledgment */}
      <div className="bg-[#fcf9f4] py-6 px-4 text-center text-sm text-gray-700">
        <p className="mb-2">
          We acknowledge the Traditional Owners and other Aboriginal and Torres Strait
          Islander Peoples across the region and pay respect to Elders past, present
          and emerging.
        </p>
        <p className="text-xs text-gray-500">
          Aboriginal and Torres Strait Islander viewers are advised that this website may
          contain images of people who have died.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-[#1d384c] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">Wimmera CMA</h3>
              <p className="text-sm text-gray-300">
                Darlot Street, Horsham, VIC 3400<br />
                (entrance on Gleed Street)
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Office Hours: Monday – Friday 8:30am – 4:30pm
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Phone: 5382 1544<br />
                Email: wcma@wcma.vic.gov.au
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://wcma.vic.gov.au/wp-content/themes/wimmera/static/logo-wimmera-white.png" 
                alt="Wimmera CMA" 
                className="h-16 mx-auto mb-4"
              />
              <h3 className="font-bold mb-3">Connect with us</h3>
              <div className="flex justify-center space-x-4">
                <a href="https://www.facebook.com/WimmeraCMA" className="hover:text-gray-300">Facebook</a>
                <a href="https://www.instagram.com/wimmeracma/" className="hover:text-gray-300">Instagram</a>
                <a href="https://twitter.com/wimmeracma" className="hover:text-gray-300">Twitter</a>
              </div>
            </div>
            <div className="text-right">
              <img 
                src="https://wcma.vic.gov.au/wp-content/themes/wimmera/static/vic-state-logo.png" 
                alt="Victoria State Government" 
                className="h-12 ml-auto mb-2"
              />
              <img 
                src="https://wcma.vic.gov.au/wp-content/themes/wimmera/static/Aus-gov-logo.png" 
                alt="Australian Government" 
                className="h-10 ml-auto"
              />
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 mt-8 pt-4 border-t border-gray-600">
            © 2025 Wimmera CMA All Rights Reserved. | 
            <a href="https://wcma.vic.gov.au/disclaimer" className="hover:underline ml-2">Disclaimer</a> | 
            <a href="https://wcma.vic.gov.au/privacy-statement" className="hover:underline ml-2">Privacy Statement</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
