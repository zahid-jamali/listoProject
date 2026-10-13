"use client";

import { useState } from "react";
import { Phone, Mail, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function PreConstructionAgentCard({
  pageData = {},
  project = {},
  inquiryMsg = "",
  setInquiryMsg,
}) {
  const agent = pageData?.contact?.agent || {};
  const agentName = agent.name || "Samantha Hamilton";
  const agentPhone = agent.phone || "+16475550199";
  const agentEmail = agent.email || "vip@listo.ca";
  const agentThumbnail = agent.thumbnail || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop";

  const [submitting, setSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !email) {
      toast.error("Please enter your name and email");
      return;
    }
    setSubmitting(true);
    try {
      const [first_name, ...rest] = name.split(" ");
      const res = await fetch("/api/project-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name: rest.join(" "),
          email,
          phone: fd.get("phone") || "",
          questions: inquiryMsg,
          development_id:
            project?.dv_id || project?.development_id || project?.id || "",
          project_id: project?.project_id || "",
          access_url: project?.access_url || "",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to send inquiry");
      }
      toast.success(
        data.message ||
          `Thank you! ${agentName} has received your inquiry and will reach out shortly.`,
      );
      e.target.reset();
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 md:p-8 border border-slate-100">
        
        {/* Left Card: Agent Profile */}
        <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#F58232] p-1 shadow-inner">
            <img
              src={agentThumbnail}
              alt={agentName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="mt-4">
            <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">
              {agentName}
            </h3>
            <span className="inline-block mt-1.5 px-3 py-0.5 text-[10px] font-bold text-[#F58232] bg-orange-50 rounded-full border border-orange-100 uppercase tracking-widest">
              Platinum Agent
            </span>
          </div>

          <div className="mt-6 w-full grid grid-cols-2 gap-2">
            <a
              href={`tel:${agentPhone}`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-3 border border-slate-200 transition focus:outline-none"
            >
              <Phone size={13} className="text-[#F58232]" />
              Call
            </a>
            <a
              href={`mailto:${agentEmail}`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-3 border border-slate-200 transition focus:outline-none"
            >
              <Mail size={13} className="text-[#F58232]" />
              Email
            </a>
          </div>
        </div>

        {/* Right Card: Full Inquiry form */}
        <div className="bg-[#00132D] text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F58232]/5 to-transparent" />
          <div className="relative space-y-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Need help exploring this home?
              </h2>
              <p className="text-xs text-white/50 mt-1 uppercase tracking-wider font-bold">
                Get floor plans, price lists &amp; VIP payment structures
              </p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F58232] transition"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F58232] transition"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F58232] transition"
                />
              </div>
              
              <textarea
                value={inquiryMsg}
                onChange={(e) => setInquiryMsg(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F58232] transition resize-none"
              />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-[10px] text-white/40 max-w-md">
                  By submitting this form, you consent to our terms of service and authorize our VIP desk to contact you regarding project updates.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#F58232] hover:bg-[#e67428] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 transition shadow-lg focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
