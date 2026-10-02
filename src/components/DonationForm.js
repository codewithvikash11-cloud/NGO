"use client";

import { useState } from "react";

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', 'pending'

  const presetAmounts = [300, 500, 1000, 2500];

  const handleDonate = async (e) => {
    e.preventDefault();
    const amountToDonate = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    
    if (!amountToDonate || amountToDonate <= 0) {
      alert("Please select or enter a valid amount.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // Create checkout session via our API route which communicates with IMB
      const res = await fetch("/api/imb/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountToDonate }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      // In a real integration, we'd redirect to IMB checkout URL:
      // window.location.href = data.checkoutUrl;
      
      // For this demo, we simulate a successful redirect and callback
      setTimeout(() => {
        setLoading(false);
        setStatus("success");
      }, 1500);

    } catch (err) {
      console.error(err);
      setStatus("error");
      setLoading(false);
    }
  };

  return (
    <div id="donate-section" className="bg-ngo-card border border-ngo-border rounded-xl shadow-sm p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">AMOUNT CHUNE AUR DONATE KAREIN</h3>
        <p className="text-sm text-ngo-secondary mt-1 font-medium tracking-wider">INSTANT CHECKOUT</p>
      </div>

      {status === 'success' ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you for your generous donation!</h4>
          <p className="text-ngo-secondary mb-6">Your payment has been successfully verified.</p>
          <button 
            onClick={() => setStatus(null)}
            className="text-ngo-primary font-medium hover:underline"
          >
            Make another donation
          </button>
        </div>
      ) : (
        <form onSubmit={handleDonate}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
                className={`py-3 rounded-lg border-2 font-bold transition-all ${
                  selectedAmount === amt && !customAmount
                    ? "border-ngo-primary bg-ngo-light text-ngo-primary"
                    : "border-gray-200 text-gray-600 hover:border-ngo-primary/50 hover:bg-gray-50"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold">₹</span>
            </div>
            <input
              type="number"
              min="1"
              placeholder="Enter Custom Amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-ngo-primary focus:ring-1 focus:ring-ngo-primary transition-colors text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ngo-primary hover:bg-ngo-dark text-white font-bold py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center group relative overflow-hidden"
          >
            <span className="relative z-10">{loading ? "Processing..." : "DONATE NOW"}</span>
            {!loading && (
              <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></div>
            )}
          </button>
          
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-3 text-center">Payment could not be processed. Please try again.</p>
          )}
        </form>
      )}

      {/* Trust Bar */}
      <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-ngo-light rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-ngo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xs text-ngo-secondary font-medium">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-ngo-light rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-ngo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xs text-ngo-secondary font-medium">Official Receipt</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-ngo-light rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-ngo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xs text-ngo-secondary font-medium">80G Tax Benefit</span>
        </div>
      </div>
    </div>
  );
}
