"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./messages.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: "buyer" | "seller";
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  sellerName: string;
  sellerInitials: string;
  propertyTitle: string;
  lastMessage: string;
  lastTime: string;
  status: "waiting" | "replied";
  messages: Message[];
}

// ─── Hardcoded data ───────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    sellerName: "Ahmed Raza",
    sellerInitials: "AR",
    propertyTitle: "Modern Villa – Gulberg III",
    lastMessage: "Sure, you can visit on Saturday at 11am.",
    lastTime: "10:42 AM",
    status: "replied",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "Hi! I am interested in your Modern Villa listing in Gulberg III. Is it still available?",
        time: "Yesterday, 9:15 AM",
      },
      {
        id: 2,
        from: "seller",
        text: "Yes, it is still available! It is a 5-bedroom villa with a pool and a large garden. Would you like to schedule a visit?",
        time: "Yesterday, 9:30 AM",
      },
      {
        id: 3,
        from: "buyer",
        text: "That sounds great! Can I visit this weekend?",
        time: "Yesterday, 9:45 AM",
      },
      {
        id: 4,
        from: "seller",
        text: "Sure, you can visit on Saturday at 11am.",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    sellerName: "Sara Khan",
    sellerInitials: "SK",
    propertyTitle: "Luxury Apartment – DHA Phase 6",
    lastMessage: "Hello! I would love to know more about the amenities.",
    lastTime: "9:05 AM",
    status: "waiting",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "Hello! I would love to know more about the amenities included in the DHA Phase 6 apartment.",
        time: "9:05 AM",
      },
    ],
  },
  {
    id: 3,
    sellerName: "Usman Tariq",
    sellerInitials: "UT",
    propertyTitle: "Studio Flat – Bahria Town",
    lastMessage: "The monthly rent is PKR 45,000, utilities not included.",
    lastTime: "Yesterday",
    status: "replied",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "What is the monthly rent for the studio flat in Bahria Town?",
        time: "Yesterday, 2:00 PM",
      },
      {
        id: 2,
        from: "seller",
        text: "The monthly rent is PKR 45,000, utilities not included.",
        time: "Yesterday, 4:15 PM",
      },
    ],
  },
  {
    id: 4,
    sellerName: "Fatima Malik",
    sellerInitials: "FM",
    propertyTitle: "Commercial Plot – Model Town",
    lastMessage: "Is the price negotiable for the commercial plot?",
    lastTime: "Mon",
    status: "waiting",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "Is the price negotiable for the commercial plot in Model Town?",
        time: "Mon, 11:00 AM",
      },
    ],
  },
];

type TabFilter = "all" | "waiting" | "replied";

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyMessagesPage() {
  const router = useRouter();
  const [conversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync localMessages when conversation changes
  useEffect(() => {
    if (selected) setLocalMessages(selected.messages);
  }, [selected]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const filtered = conversations.filter((c) => {
    const matchTab = activeTab === "all" || c.status === activeTab;
    const matchSearch =
      c.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalConversations = conversations.length;
  const waitingCount = conversations.filter(
    (c) => c.status === "waiting",
  ).length;

  const handleSend = () => {
    if (!draft.trim() || !selected) return;
    const newMsg: Message = {
      id: localMessages.length + 1,
      from: "buyer",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={Styles["root"]}>
      {/* ── Top Bar ── */}
      <header className={Styles["topbar"]}>
        <button className={Styles["back-btn"]} onClick={() => router.back()}>
          ← Back
        </button>

        <div className={Styles["topbar-title"]}>
          <span className={Styles["topbar-icon"]}>💬</span>
          <div>
            <div className={`${Styles["topbar-name"]} ${Styles["buyer"]}`}>
              My Messages
            </div>
            <div className={Styles["topbar-sub"]}>
              Your conversations with property sellers
            </div>
          </div>
        </div>

        <div className={Styles["stats"]}>
          <div className={`${Styles["stat"]} ${Styles["stat-pink"]}`}>
            <span className={`${Styles["stat-num"]} ${Styles["buyer"]}`}>
              {totalConversations}
            </span>
            <span className={Styles["stat-label"]}>Conversations</span>
          </div>
          <div className={`${Styles["stat"]} ${Styles["stat-orange"]}`}>
            <span className={`${Styles["stat-num"]} ${Styles["orange"]}`}>
              {waitingCount}
            </span>
            <span className={Styles["stat-label"]}>Waiting</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className={Styles["main"]}>
        {/* LEFT sidebar */}
        <aside className={Styles["sidebar"]}>
          {/* Search */}
          <div className={Styles["search-wrap"]}>
            <input
              className={Styles["search-input"]}
              placeholder="🔍 Search sellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter tabs */}
          <div className={Styles["tabs"]}>
            {(["all", "waiting", "replied"] as TabFilter[]).map((tab) => (
              <button
                key={tab}
                className={`${Styles["tab"]} ${activeTab === tab ? Styles["tab-active-buyer"] : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all"
                  ? "All"
                  : tab === "waiting"
                    ? "Waiting"
                    : "Replied"}
              </button>
            ))}
          </div>
          <hr className={Styles["sep"]} />

          {/* Conversation list */}
          <div className={Styles["conv-list"]}>
            {filtered.length === 0 && (
              <div className={Styles["empty-list"]}>
                No conversations found.
              </div>
            )}
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`${Styles["conv-item"]} ${selected?.id === c.id ? Styles["conv-item-active"] : ""}`}
                onClick={() => setSelected(c)}
              >
                <div
                  className={`${Styles["avatar"]} ${Styles["avatar-buyer"]}`}
                >
                  {c.sellerInitials}
                </div>
                <div className={Styles["conv-info"]}>
                  <div className={Styles["conv-top"]}>
                    <span className={Styles["conv-name"]}>{c.sellerName}</span>
                    <span className={Styles["conv-time"]}>{c.lastTime}</span>
                  </div>
                  <div className={Styles["conv-prop"]}>{c.propertyTitle}</div>
                  <div className={Styles["conv-last"]}>{c.lastMessage}</div>
                </div>
                <span
                  className={`${Styles["badge"]} ${c.status === "waiting" ? Styles["badge-waiting"] : Styles["badge-replied"]}`}
                >
                  {c.status === "waiting" ? "Waiting" : "Replied"}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT chat pane */}
        <div className={Styles["chat-pane"]}>
          {!selected ? (
            <div className={Styles["empty-state"]}>
              <span className={Styles["empty-icon"]}>💬</span>
              <p className={Styles["empty-title"]}>Select a conversation</p>
              <p className={Styles["empty-sub"]}>
                Choose a seller from the list to view messages
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className={Styles["chat-header"]}>
                <div
                  className={`${Styles["avatar"]} ${Styles["avatar-buyer"]}`}
                >
                  {selected.sellerInitials}
                </div>
                <div className={Styles["chat-header-info"]}>
                  <div className={Styles["chat-header-name"]}>
                    {selected.sellerName}
                  </div>
                  <div className={Styles["chat-header-sub"]}>
                    {selected.propertyTitle}
                  </div>
                </div>
                <button
                  className={`${Styles["view-profile-btn"]} ${Styles["buyer-profile"]}`}
                >
                  View Profile
                </button>
              </div>

              {/* Messages */}
              <div className={Styles["messages-area"]}>
                {localMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${Styles["msg-row"]} ${msg.from === "buyer" ? Styles["msg-row-right"] : Styles["msg-row-left"]}`}
                  >
                    {msg.from === "seller" && (
                      <div
                        className={`${Styles["avatar"]} ${Styles["avatar-buyer"]} ${Styles["avatar-sm"]}`}
                      >
                        {selected.sellerInitials}
                      </div>
                    )}
                    <div
                      className={`${Styles["bubble"]} ${msg.from === "buyer" ? Styles["bubble-buyer"] : Styles["bubble-other"]}`}
                    >
                      <p className={Styles["bubble-text"]}>{msg.text}</p>
                      <span className={Styles["bubble-time"]}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input box */}
              <div className={Styles["input-box"]}>
                <textarea
                  className={Styles["msg-input"]}
                  placeholder="Type your inquiry here..."
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className={Styles["input-actions"]}>
                  <button
                    className={`${Styles["send-btn"]} ${Styles["send-btn-buyer"]}`}
                    onClick={handleSend}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
