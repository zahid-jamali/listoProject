"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Full project registration form — legacy POST /api/project_register.
 */
export default function ProjectRegisterCard({ project = {} }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    realtor: "No",
    questions: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.email) {
      toast.error("Please enter your name and email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/project-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          development_id:
            project?.dv_id || project?.development_id || project?.id || "",
          project_id: project?.project_id || "",
          access_url: project?.access_url || "",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Registration failed");
      }
      toast.success(
        data.message ||
          "Registration received. Our team will reach out shortly.",
      );
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        realtor: "No",
        questions: "",
      });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F36B22] focus:ring-1 focus:ring-[#F36B22]/30";

  if (project?.status === "S") return null;

  return (
    <section
      id="project-register"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-xl font-bold text-[#0B132B] sm:text-2xl">
        Register for {project?.title || "this project"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Get VIP pricing, floor plans, and unit availability from our team.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            placeholder="First name"
            className={fieldClass}
          />
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last name"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className={fieldClass}
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone"
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Are you a realtor?
          </label>
          <select
            name="realtor"
            value={form.realtor}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <textarea
          name="questions"
          value={form.questions}
          onChange={handleChange}
          rows={3}
          placeholder="Questions or preferred unit type…"
          className={`${fieldClass} resize-none`}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#F36B22] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#e67428] disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {submitting ? "Submitting…" : "Register"}
        </button>
      </form>
    </section>
  );
}
