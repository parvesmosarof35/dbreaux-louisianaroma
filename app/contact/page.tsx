import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="bg-[#121414] min-h-screen text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/contactuspagehro.png"
              alt="Contact Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18, 20, 20, 0) 0%, rgba(18, 20, 20, 0.6) 50%, #121414 100%)" }}></div>
          </div>
          
          <div className="relative z-10 text-center max-w-5xl px-4 flex flex-col items-center">
            <h1 className="drop-shadow-2xl mb-8 tracking-tight">
              Contact Us
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto">
              Our curators are available to assist with your private inquiries.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            
            {/* Left side: Information */}
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-[#F2CA50] text-4xl md:text-5xl font-serif">Private Concierge</h2>
                <p className="text-white/40 text-lg font-light leading-relaxed tracking-wide max-w-lg">
                  For bespoke consultations, order inquiries, or heritage discovery, our global concierge team remains at your disposal to ensure a seamless experience within the world of L'Essence Noire.
                </p>
              </div>

              <div className="space-y-10">
                {/* Contact Items */}
                {[
                  { 
                    label: "Email", 
                    value: "concierge@lessence-noire.com",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    )
                  },
                  { 
                    label: "Telephone", 
                    value: "+1 (800) 555-0199",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    )
                  },
                  { 
                    label: "The Atelier", 
                    value: "12 Place Vendôme, Paris, France",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#F2CA50] group-hover:bg-[#F2CA50]/10 transition-colors duration-500">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">{item.label}</div>
                      <div className="text-white/80 text-lg font-light tracking-wide">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-10 border-t border-white/5 space-y-4">
                 <div className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">Follow Our Journey</div>
                 <div className="flex gap-8">
                    {["Instagram", "LinkedIn", "Pinterest"].map((social) => (
                      <button key={social} className="text-white/40 text-[11px] font-bold tracking-[2px] uppercase hover:text-[#F2CA50] transition-colors">
                        {social}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right side: Form Card */}
            <div className="bg-[#1A1C1C] border border-white/5 rounded-3xl p-12 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2CA50]/5 blur-3xl rounded-full"></div>
              
              <form className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-6 py-4 rounded-xl focus:border-[#F2CA50]/50 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-6 py-4 rounded-xl focus:border-[#F2CA50]/50 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase ml-1">Inquiry Type</label>
                  <div className="relative">
                    <select className="w-full bg-white/5 border border-white/10 text-white text-sm px-6 py-4 rounded-xl focus:border-[#F2CA50]/50 outline-none transition-all appearance-none cursor-pointer">
                      <option className="bg-[#1A1C1C]">General Inquiry</option>
                      <option className="bg-[#1A1C1C]">Bespoke Commission</option>
                      <option className="bg-[#1A1C1C]">Order Status</option>
                      <option className="bg-[#1A1C1C]">Heritage Discovery</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#F2CA50] text-[10px] font-bold tracking-[2px] uppercase ml-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="How may we assist you?" 
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-6 py-4 rounded-xl focus:border-[#F2CA50]/50 outline-none transition-all placeholder:text-white/10 resize-none"
                  ></textarea>
                </div>

                <button className="w-full bg-[#F2CA50] text-black text-xs font-bold tracking-[4px] uppercase py-6 rounded-xl hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(242,202,80,0.15)]">
                  Send Inquiry
                </button>
              </form>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
