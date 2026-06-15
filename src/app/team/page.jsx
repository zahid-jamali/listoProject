"use client";

import { useState } from "react";
import { Phone, Mail, Languages, MapPin } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Aravinth Ratnasingam",
    role: "Broker of Record, Founding CEO",
    phone: "416-668-1234",
    email: "aravinth@listo.ca",
    languages: "English, Tamil",
    area: "Greater Toronto Area",
    image: "/assets/team/aravinth.png",
    category: "Realtor",
    bio: `With over 16 years of experience as a leading advisor in land acquisition,
    commercial development, and property investment, I have a proven track record
    of delivering successful projects by optimizing timelines and ensuring profitable outcomes.`,
  },
  {
    id: 2,
    name: "Ajan Kanagalingam",
    role: "Sales Representative",
    image: "/assets/team/ajan.png",
    category: "Realtor",
  },
  {
    id: 3,
    name: "Banuka Kanagalingam",
    role: "Sales Representative",
    image: "/assets/team/banuka.png",
    category: "Realtor",
  },
  {
    id: 4,
    name: "Anu Gobinathan",
    role: "Sales Representative",
    image: "/assets/team/anu.png",
    category: "Management",
  },
  {
    id: 5,
    name: "Tharani Nagenthran",
    role: "Broker",
    image: "/assets/team/tharani.png",
    category: "Advisory",
  },
];

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);

  const [activeTab, setActiveTab] = useState("Realtor");

  const filteredMembers = teamMembers.filter(
    (member) => activeTab === "All" || member.category === activeTab,
  );

  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <TeamHero activeTab={activeTab} setActiveTab={setActiveTab} />

      <TeamSlider
        members={filteredMembers}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
      />

      <AgentDetails member={selectedMember} />

      <WhyChooseAgents />
    </main>
  );
}

function TeamHero({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: "Realtor",
      label: "Listo Realtors",
    },
    {
      id: "Management",
      label: "Management",
    },
    {
      id: "Advisory",
      label: "Advisory Board",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8F9FB] to-[#F3F4F6] pt-20 pb-14">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#F58233]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="rounded-full border border-[#F58233]/30 bg-[#F58233]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58233]">
            Meet Our Experts
          </span>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-[52px] font-black tracking-[-2px] text-[#02132D] md:text-[64px]">
            The Team Behind
            <span className="block text-[#F58233]">LISTO</span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-8 text-[#64748B]">
            A diverse team of real estate professionals, advisors, and industry
            experts committed to helping buyers, sellers, and investors achieve
            exceptional results across Ontario.
          </p>
        </div>

        {/* Stats */}

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white bg-white/80 p-5 text-center shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur">
            <div className="text-3xl font-black text-[#02132D]">25+</div>
            <div className="mt-1 text-sm text-gray-500">Team Members</div>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 p-5 text-center shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur">
            <div className="text-3xl font-black text-[#02132D]">$2B+</div>
            <div className="mt-1 text-sm text-gray-500">Transactions</div>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 p-5 text-center shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur">
            <div className="text-3xl font-black text-[#02132D]">15+</div>
            <div className="mt-1 text-sm text-gray-500">Years Experience</div>
          </div>
        </div>

        {/* Tabs */}

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#F58233] text-white shadow-lg shadow-[#F58233]/30"
                  : "border border-[#D8DDE5] bg-white text-[#02132D] hover:border-[#F58233] hover:text-[#F58233]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSlider({ members, selectedMember, setSelectedMember }) {
  return (
    <section className="pb-14">
      <div className="overflow-x-auto">
        <div className="mx-auto flex w-max gap-5 px-6">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`relative h-[300px] w-[260px] overflow-hidden rounded-[22px] transition ${
                selectedMember.id === member.id ? "ring-4 ring-[#F58233]" : ""
              }`}
            >
              <div className="absolute inset-0 bg-[#F58233]" />

              <img
                src={member.image}
                alt={member.name}
                className="absolute bottom-0 left-1/2 h-[270px] -translate-x-1/2 object-contain"
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[#6D4026]/90 p-3 text-left text-white">
                <h3 className="font-semibold">{member.name}</h3>

                <p className="text-xs">{member.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentDetails({ member }) {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-[24px] border border-gray-200 bg-white p-8 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[140px_1fr_320px]">
            <div>
              <div className="h-[120px] w-[120px] overflow-hidden rounded-full bg-[#F58233]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-[#02132D]">
                {member.name}
              </h2>

              <p className="mt-2 text-gray-600">{member.role}</p>

              <div className="mt-8 grid gap-5 md:grid-cols-4">
                <Info
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={member.phone}
                />

                <Info
                  icon={<Mail size={16} />}
                  label="Email"
                  value={member.email}
                />

                <Info
                  icon={<Languages size={16} />}
                  label="Languages"
                  value={member.languages}
                />

                <Info
                  icon={<MapPin size={16} />}
                  label="Area"
                  value={member.area}
                />
              </div>

              <h3 className="mt-10 text-2xl font-bold">
                About {member.name.split(" ")[0]}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">{member.bio}</p>
            </div>

            <div>
              <div className="rounded-2xl bg-[#02132D] p-6 text-white">
                <h3 className="font-bold">Office Details</h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <div className="text-orange-400">Address</div>

                    <div>7 Eastvale Dr, Unit 2 Markham, ON</div>
                  </div>

                  <div>
                    <div className="text-orange-400">Phone</div>

                    <div>(905) 757-1234</div>
                  </div>

                  <div>
                    <div className="text-orange-400">Email</div>

                    <div>info@listo.ca</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseAgents() {
  const items = [
    {
      title: "They know the market like the back of their hand",
      text: "Deep local knowledge backed by exclusive market data.",
    },
    {
      title: "They focus on you, not finding leads",
      text: "Agents dedicate their full attention to helping clients.",
    },
    {
      title: "Happy clients, every time",
      text: "Our agents consistently deliver top-notch service.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-[42px] font-black text-[#02132D]">
          What makes Listo agents awesome?
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] bg-[#02132D] p-8 text-white"
            >
              <h3 className="text-xl font-bold">{item.title}</h3>

              <p className="mt-4 text-gray-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value, icon }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
        {icon}
        {label}
      </div>

      <div className="text-sm font-medium text-[#02132D]">{value}</div>
    </div>
  );
}
