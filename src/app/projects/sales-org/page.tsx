"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Person {
  name: string;
  title: string;
  location?: string;
  bio: string;
  tag: string;
  isYou?: boolean;
}

interface Team {
  id: string;
  label: string;
  subtitle: string;
  leader: "amelia" | "andrew" | "shared";
  color: string;
  people: Person[];
}

// ---------------------------------------------------------------------------
// Leader data
// ---------------------------------------------------------------------------

const ameliaTapsall: Person = {
  name: "Emilia Tapsall",
  title: "Co-Head of Sales + Delivery",
  location: "Arizona",
  bio: "Leads the Zoom partnership — OE's highest growth area. Also owns Computershare, LSEG (a board member, $10M investor, and potential acquirer), delivery operations, and co-leads the institutional business. Sees the Zoom partnership growing from $6M to $20M in 3–5 years.",
  tag: "Zoom · LSEG · Institutional",
};

const andrew: Person = {
  name: "Andrew",
  title: "Co-Head of Sales",
  location: "New York",
  bio: "Runs the GCS team alongside Christian Bowens, the Broadridge partnership with Rob Garrigan, OE Stream through Jules, and co-leads institutional with Emilia. Spent his first months at OE the same way — getting to know people, understanding what makes them tick. His advice to new hires: take the long road.",
  tag: "GCS · Broadridge · Partnerships",
};

// ---------------------------------------------------------------------------
// Teams data
// ---------------------------------------------------------------------------

const initialTeams: Team[] = [
  {
    id: "zoom",
    label: "Zoom Partnership",
    subtitle:
      "The smallest team relative to the revenue it's expected to generate. Three people covering $6M in planned revenue with $20M potential.",
    leader: "amelia",
    color: "#1e40af",
    people: [
      {
        name: "Kara Dingenthal",
        title: "Zoom Sales Lead",
        location: "Denver",
        bio: "Came directly from Zoom when they disbanded their professional services organization in early 2025. Emilia called her the greatest hire of all time. Leads the Zoom sales motion and is the closest thing to a Zoom subject matter expert on the sales side.",
        tag: "Ex-Zoom · 'Greatest Hire of All Time'",
      },
      {
        name: "Kristen Conklin",
        title: "Zoom Sales",
        location: "New Hampshire",
        bio: "Has been at OE since right out of college and has had every job — operator, APM, PM, delivery manager, salesperson on both the institutional and corporate sides. Now permanently in Zoom sales. The Swiss army knife of the company.",
        tag: "OE Lifer · Every Role",
      },
      {
        name: "Peter",
        title: "Zoom Sales, EMEA",
        location: "London",
        bio: "Also came over from Zoom in a delivery role. Raised his hand for sales and transitioned on January 1. The only Zoom salesperson in all of EMEA. The team is looking to hire a BDR and another rep to support him.",
        tag: "Ex-Zoom · Only EMEA Zoom Rep",
      },
    ],
  },
  {
    id: "institutional",
    label: "Institutional",
    subtitle:
      "Where OE's roots and majority of revenue come from. Almost everyone on this team came from the client side — corporate access at banks.",
    leader: "amelia",
    color: "#92400e",
    people: [
      {
        name: "Gib Smith",
        title: "Head of Institutional, Global",
        location: "North Carolina",
        bio: "Previously ran Americas corporate access at Citi for years. Knows literally everyone in the industry. The deepest Rolodex at OE. Andrew's suggestion: get a coffee with Gib next time he's in New York.",
        tag: "Ex-Citi · Global Lead",
      },
      {
        name: "Naomi Romero",
        title: "International Institutional, EMEA + APAC",
        location: "London",
        bio: "Came from Corbax, a buy-side data company, and equity sales before that. Lived in the US for 11 years before moving to London. Runs the entire international institutional business across EMEA and APAC.",
        tag: "Ex-Corbax · EMEA/APAC",
      },
      {
        name: "Britt Marinucci",
        title: "Relationship Manager",
        location: "New Jersey · winters in Florida",
        bio: "Handles JP Morgan, Barclays, and other large accounts. Came from NYSE in 2021 where she was a client of OE's. Recently on-site at a conference — one of the few people Mithun hasn't met yet.",
        tag: "JP Morgan · Barclays · Ex-NYSE",
      },
      {
        name: "Candice Hunter",
        title: "Relationship Manager",
        location: "New Jersey",
        bio: "Just got promoted to RM. Her biggest account is UBS. Came from HSBC corporate access — another example of OE hiring from the client side to deepen relationships.",
        tag: "UBS · Ex-HSBC",
      },
      {
        name: "Candace",
        title: "APAC Institutional",
        location: "Hong Kong",
        bio: "The only salesperson in the entire APAC region. Runs all institutional business across Asia-Pacific solo.",
        tag: "Solo APAC Coverage",
      },
      {
        name: "Daisy Rogan",
        title: "Institutional Sales",
        location: "London",
        bio: "Moved from delivery and production into sales about a year ago. Before OE, she was a flight attendant for Emirates. One of the more unconventional career paths on the team.",
        tag: "Ex-Emirates · Delivery → Sales",
      },
      {
        name: "Diane Holland",
        title: "Australia / New Zealand",
        location: "New Zealand",
        bio: "Part-time contractor, 10–20 hours per week. Focused on Australia and New Zealand. Worked with Gib at Citi in London — they go back years.",
        tag: "Part-Time · Ex-Citi with Gib",
      },
    ],
  },
  {
    id: "gcs",
    label: "Global Corporate Services",
    subtitle:
      "Sells to large non-financial corporations. Christian runs it globally from London.",
    leader: "andrew",
    color: "#065f46",
    people: [
      {
        name: "Christian Bowens",
        title: "Head of GCS, Global",
        location: "London",
        bio: "Leads the entire GCS function globally. Works closely with Andrew on strategy and team management. The corporate side of OE's revenue engine.",
        tag: "Global Lead · London",
      },
      {
        name: "Jamie",
        title: "GCS Sales",
        location: "London",
        bio: "Part of the London-based GCS team under Christian.",
        tag: "London",
      },
      {
        name: "Kaylee",
        title: "GCS Sales",
        location: "Colorado",
        bio: "Covers GCS accounts from Colorado.",
        tag: "Colorado",
      },
      {
        name: "CJ",
        title: "GCS Sales",
        location: "Boston",
        bio: "East coast GCS coverage from Boston.",
        tag: "Boston",
      },
      {
        name: "Garrett",
        title: "GCS Sales",
        location: "North Carolina",
        bio: "Part of the North Carolina cluster — same area as Gib, Jacob, and the institutional team.",
        tag: "North Carolina",
      },
      {
        name: "Jacob",
        title: "GCS Sales",
        location: "North Carolina",
        bio: "Another North Carolina-based GCS rep.",
        tag: "North Carolina",
      },
      {
        name: "Jules",
        title: "GCS Sales + OE Stream",
        location: "New Jersey",
        bio: "Wears multiple hats. Bulk of his revenue is GCS, but he also runs the OE Stream business — the KnowledgeVision acquisition product with a ~$750K book and 30–40 active clients. Does some partnership work too.",
        tag: "OE Stream · ~$750K Book",
      },
    ],
  },
  {
    id: "partnerships",
    label: "Partnerships",
    subtitle:
      "Rob runs the partner channel the way Gib runs institutional — he knows everyone on the partnership side of the industry.",
    leader: "andrew",
    color: "#9d174d",
    people: [
      {
        name: "Rob Garrigan",
        title: "Partner Channel Lead",
        location: "Connecticut",
        bio: "Runs the Broadridge relationship and a portfolio of IR consulting, communications, and production company partnerships. Feeds qualified deals into the GCS team, who then take over the client relationship. Knows everyone on the partnership side of the industry.",
        tag: "Broadridge · IR Consulting · Channel",
      },
    ],
  },
  {
    id: "se",
    label: "Sales Engineering",
    subtitle: "Brand new function. Both SEs are defining the role from scratch.",
    leader: "shared",
    color: "#6d28d9",
    people: [
      {
        name: "Devin Liang",
        title: "Sales Engineer",
        location: "Washington, DC",
        bio: "Been in the SE role for about 6–7 weeks, also defining it from scratch. Background includes the Peace Corps and building out an APAC operation from Hawaii. Typically accompanied by account managers on demos. In-person meetup with Mithun planned for March 5 in midtown.",
        tag: "~7 Weeks In · Ex-Peace Corps",
      },
      {
        name: "Mithun Manjunatha",
        title: "Sales Engineer",
        location: "New York",
        bio: "Week 2. Building out the SE function alongside Devin. Already prototyping migration tooling, scoping operator dashboards, and sitting in on every call he can find.",
        tag: "Week 2 · That's You",
        isYou: true,
      },
    ],
  },
  {
    id: "bdrs",
    label: "Business Development",
    subtitle:
      "Mostly setting appointments for the GCS team, starting to work buy-side opportunities for institutional.",
    leader: "shared",
    color: "#374151",
    people: [
      {
        name: "Sean",
        title: "BDR",
        location: "Texas",
        bio: "Focused on setting GCS appointments and beginning to support institutional pipeline development.",
        tag: "GCS Focus",
      },
      {
        name: "Megan",
        title: "BDR",
        location: "Nashville",
        bio: "Recent college graduate, about 6 months into the role. Learning the industry and building pipeline.",
        tag: "~6 Months In",
      },
    ],
  },
  {
    id: "ops",
    label: "Sales Ops & Marketing",
    subtitle:
      "The infrastructure behind the sales teams — CRM, reporting, content, and branding.",
    leader: "shared",
    color: "#374151",
    people: [
      {
        name: "Ali Croswell",
        title: "Sales Operations",
        bio: "Former professional tap dancer. Hired during COVID, left to go on tour, came back full-time for stability. Now runs sales ops and knows OE inside and out. Baljeet reports to her.",
        tag: "Ex-Professional Tap Dancer",
      },
      {
        name: "Baljeet",
        title: "Sales Operations",
        bio: "Builds and maintains the Salesforce dashboards and reports. Reports to Ali Croswell.",
        tag: "Salesforce · Dashboards",
      },
      {
        name: "Michael Morales",
        title: "Marketing",
        location: "Los Angeles",
        bio: "Hired about 6 months ago. Does LinkedIn content, social media, deck design, and branding for the sales team.",
        tag: "LinkedIn · Decks · Branding",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PersonCard({
  person,
  accent,
  isSelected,
  onClick,
}: {
  person: Person;
  accent: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? accent : "#fff",
        border: `2px solid ${accent}`,
        borderRadius: 14,
        padding: "24px 28px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flex: "1 1 260px",
        maxWidth: 340,
        minWidth: 200,
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: isSelected ? `${accent}80` : accent,
          fontFamily: "system-ui, sans-serif",
          marginBottom: 10,
          opacity: isSelected ? 0.7 : 0.6,
        }}
      >
        Co-Head of Sales
      </div>
      <div
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 26,
          fontWeight: 700,
          color: isSelected ? "#fff" : "#111827",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          marginBottom: 6,
        }}
      >
        {person.name}
      </div>
      <div
        style={{
          fontSize: 13,
          color: isSelected ? "rgba(255,255,255,0.7)" : "#9ca3af",
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
        }}
      >
        {person.location}
      </div>
      {isSelected && (
        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'Georgia', serif",
          }}
        >
          {person.bio}
        </div>
      )}
    </div>
  );
}

function TeamCircle({
  team,
  isActive,
  onClick,
}: {
  team: Team;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: isActive ? team.color : "#f9fafb",
          border: `2px solid ${isActive ? team.color : "#e5e7eb"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 8px",
          transition: "all 0.2s ease",
          boxShadow: isActive ? `0 4px 16px ${team.color}30` : "none",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: isActive ? "#fff" : team.color,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {team.people.length}
        </span>
      </div>
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: isActive ? team.color : "#6b7280",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.3,
          maxWidth: 100,
          margin: "0 auto",
        }}
      >
        {team.label}
      </div>
    </div>
  );
}

function PersonRow({ person, color }: { person: Person; color: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid #f5f5f5",
        cursor: "pointer",
        transition: "background 0.1s",
        background: expanded ? "#fafbfc" : "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 16,
                fontWeight: 700,
                color: person.isYou ? "#6d28d9" : "#111827",
                letterSpacing: "-0.01em",
              }}
            >
              {person.name}
            </span>
            {person.isYou && (
              <span
                style={{
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6d28d9",
                  background: "#f5f3ff",
                  padding: "2px 7px",
                  borderRadius: 3,
                }}
              >
                you
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#9ca3af",
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              marginTop: 2,
            }}
          >
            {person.title}
            {person.location ? ` \u00b7 ${person.location}` : ""}
          </div>
        </div>
        <span
          style={{
            fontSize: 16,
            color: "#d1d5db",
            transform: expanded ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 0.15s ease",
            flexShrink: 0,
          }}
        >
          ›
        </span>
      </div>
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              color: "#374151",
              fontFamily: "'Georgia', serif",
              marginBottom: 10,
            }}
          >
            {person.bio}
          </div>
          <span
            style={{
              fontSize: 10,
              color: color,
              background: `${color}0a`,
              border: `1px solid ${color}18`,
              padding: "3px 10px",
              borderRadius: 20,
              fontWeight: 500,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {person.tag}
          </span>
        </div>
      )}
    </div>
  );
}

function TeamDetail({ team }: { team: Team }) {
  return (
    <div
      style={{
        border: `2px solid ${team.color}`,
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 24,
      }}
    >
      <div style={{ background: team.color, padding: "16px 20px" }}>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          {team.label}
        </div>
        {team.subtitle && (
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Georgia', serif",
              lineHeight: 1.6,
              marginTop: 6,
            }}
          >
            {team.subtitle}
          </div>
        )}
      </div>
      <div>
        {team.people.map((person, index) => (
          <PersonRow key={index} person={person} color={team.color} />
        ))}
      </div>
    </div>
  );
}

function ConnectorLine({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 2,
        height: 32,
        background: color,
        margin: "0 auto",
        opacity: 0.3,
      }}
    />
  );
}

function EditablePersonRow({
  person,
  onUpdate,
}: {
  person: Person;
  onUpdate: (field: string, value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ padding: "10px 12px", borderBottom: "1px solid #f5f5f5" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            fontFamily: "'Georgia', serif",
          }}
        >
          {person.name}
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#d1d5db",
            transform: expanded ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 0.15s",
          }}
        >
          ›
        </span>
      </div>
      {expanded && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {(["name", "title", "location", "tag"] as const).map((field) => (
            <div key={field}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {field}
              </label>
              <input
                value={String(person[field] || "")}
                onChange={(e) => onUpdate(field, e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  fontSize: 13,
                  border: "1px solid #e5e7eb",
                  borderRadius: 4,
                  background: "#fefce8",
                  fontFamily: "'Georgia', serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
          <div>
            <label
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              bio
            </label>
            <textarea
              value={person.bio}
              onChange={(e) => onUpdate("bio", e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "6px 8px",
                fontSize: 13,
                border: "1px solid #e5e7eb",
                borderRadius: 4,
                background: "#fefce8",
                fontFamily: "'Georgia', serif",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function SalesOrgPage() {
  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const ameliaTeams = teams.filter((t) => t.leader === "amelia");
  const andrewTeams = teams.filter((t) => t.leader === "andrew");
  const sharedTeams = teams.filter((t) => t.leader === "shared");

  const totalPeople =
    teams.reduce((sum, team) => sum + team.people.length, 0) + 2;

  const activeTeamData = activeTeam
    ? teams.find((t) => t.id === activeTeam)
    : null;

  const handlePersonUpdate = useCallback(
    (teamId: string, personIndex: number, field: string, value: string) => {
      setTeams((prev) =>
        prev.map((team) =>
          team.id !== teamId
            ? team
            : {
                ...team,
                people: team.people.map((person, idx) =>
                  idx === personIndex ? { ...person, [field]: value } : person
                ),
              }
        )
      );
    },
    []
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "48px 24px 96px",
        }}
      >
        {/* Top bar: back link + edit button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Link
            href="/projects"
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            ← Back to Projects
          </Link>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              color: editMode ? "#fff" : "#6b7280",
              background: editMode ? "#008285" : "#f9fafb",
              border: editMode
                ? "1px solid #008285"
                : "1px solid #e5e7eb",
              borderRadius: 6,
              padding: "6px 16px",
              cursor: "pointer",
            }}
          >
            {editMode ? "Done Editing" : "Edit"}
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c0c0c0",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 14,
            }}
          >
            Open Exchange · Sales Org
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 12px 0",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            The Revenue Team
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#9ca3af",
              margin: "0 auto",
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            {totalPeople} people across {teams.length + 1} teams. Click anyone
            to learn more.
          </p>
          <div
            style={{
              width: 40,
              height: 3,
              background: "#111827",
              borderRadius: 2,
              margin: "20px auto 0",
            }}
          />
        </div>

        {/* Leader cards */}
        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <PersonCard
            person={ameliaTapsall}
            accent="#7c3aed"
            isSelected={selectedLeader === "amelia"}
            onClick={() => {
              setSelectedLeader(
                selectedLeader === "amelia" ? null : "amelia"
              );
              setActiveTeam(null);
            }}
          />
          <PersonCard
            person={andrew}
            accent="#0369a1"
            isSelected={selectedLeader === "andrew"}
            onClick={() => {
              setSelectedLeader(
                selectedLeader === "andrew" ? null : "andrew"
              );
              setActiveTeam(null);
            }}
          />
        </div>

        {/* Connector lines */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 340,
              minWidth: 200,
            }}
          >
            <ConnectorLine color="#7c3aed" />
          </div>
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 340,
              minWidth: 200,
            }}
          >
            <ConnectorLine color="#0369a1" />
          </div>
        </div>

        {/* Team circles for Emilia and Andrew */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 340,
              minWidth: 200,
              display: "flex",
              justifyContent: "center",
              gap: 24,
              padding: "12px 0",
              borderTop: "2px solid #7c3aed20",
              borderRadius: 0,
            }}
          >
            {ameliaTeams.map((team) => (
              <TeamCircle
                key={team.id}
                team={team}
                isActive={activeTeam === team.id}
                onClick={() =>
                  setActiveTeam(activeTeam === team.id ? null : team.id)
                }
              />
            ))}
          </div>
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 340,
              minWidth: 200,
              display: "flex",
              justifyContent: "center",
              gap: 24,
              padding: "12px 0",
              borderTop: "2px solid #0369a120",
              borderRadius: 0,
            }}
          >
            {andrewTeams.map((team) => (
              <TeamCircle
                key={team.id}
                team={team}
                isActive={activeTeam === team.id}
                onClick={() =>
                  setActiveTeam(activeTeam === team.id ? null : team.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Cross-functional (shared) teams */}
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c0c0c0",
              fontFamily: "system-ui, sans-serif",
              marginBottom: 16,
            }}
          >
            Cross-Functional
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {sharedTeams.map((team) => (
              <TeamCircle
                key={team.id}
                team={team}
                isActive={activeTeam === team.id}
                onClick={() =>
                  setActiveTeam(activeTeam === team.id ? null : team.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Active team detail panel */}
        {activeTeamData && <TeamDetail team={activeTeamData} />}

        {/* Edit mode panel */}
        {editMode && (
          <div
            style={{
              marginTop: 40,
              border: "2px dashed #008285",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#008285",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Edit Mode — click any person below to modify their info
            </div>
            {teams.map((team) => (
              <div key={team.id} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: team.color,
                    fontFamily: "system-ui, sans-serif",
                    marginBottom: 8,
                    borderBottom: `1px solid ${team.color}20`,
                    paddingBottom: 6,
                  }}
                >
                  {team.label}
                </div>
                {team.people.map((person, personIndex) => (
                  <EditablePersonRow
                    key={personIndex}
                    person={person}
                    onUpdate={(field, value) =>
                      handlePersonUpdate(team.id, personIndex, field, value)
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: 20,
            marginTop: 56,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10.5,
            color: "#c0c0c0",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span>Open Exchange · Confidential</span>
          <span>Sales Org Teach-In · Feb 27, 2026</span>
        </div>
      </div>
    </div>
  );
}
