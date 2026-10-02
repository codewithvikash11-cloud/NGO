import HeroCarousel from "../components/HeroCarousel";
import DonationForm from "../components/DonationForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Logo placeholder */}
            <div className="w-10 h-10 bg-ngo-primary rounded-full flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">Helping People Foundation</h1>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="bg-green-100 text-green-800 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold border border-green-200 shadow-sm">
                  80G Tax Exempted
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">Verified NGO</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <a href="#donate-section" className="bg-white border-2 border-ngo-primary text-ngo-primary font-bold px-6 py-2 rounded-full hover:bg-ngo-primary hover:text-white transition-colors">
              URGENT APPEAL
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column: Story & Carousel */}
            <div className="lg:col-span-7 space-y-8">
              <HeroCarousel />
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center md:text-left text-ngo-primary">
                  We Need Your Help
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  <p>
                    Every day, thousands struggle to find their next meal. The Helping People Foundation is on a mission to eradicate hunger and provide essential support to the most vulnerable members of our society.
                  </p>
                  <p>
                    Your contribution directly impacts lives, providing nutritious meals, clean water, and emergency relief to families in crisis. Together, we can build a world where no one goes to bed hungry.
                  </p>
                  <div className="pt-4 border-t border-gray-100 mt-6">
                    <p className="font-semibold text-gray-800 italic border-l-4 border-ngo-primary pl-4 py-1">
                      "A small contribution from you can mean the world to someone in need. Join our mission today."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Donation Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <DonationForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
            <div className="text-center md:text-left max-w-sm">
              <h3 className="text-white text-lg font-bold mb-2">Helping People Foundation</h3>
              <p className="text-sm text-gray-400">
                A registered non-governmental organization dedicated to bringing positive change and hope to underprivileged communities.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <p className="text-sm font-semibold text-white">Contact Us</p>
              <a href="mailto:support@helpingpeople.org" className="text-sm text-ngo-accent hover:text-white transition-colors">support@helpingpeople.org</a>
              <p className="text-sm text-gray-400">+91 98765 43210</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Helping People Foundation. All rights reserved.
            </p>
            <div className="flex space-x-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
