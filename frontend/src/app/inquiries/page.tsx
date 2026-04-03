"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./inquiries.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: "buyer" | "seller";
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  buyerName: string;
  buyerInitials: string;
  buyerEmail: string;
  buyerPhone: string;
  propertyTitle: string;
  lastMessage: string;
  lastTime: string;
  status: "pending" | "answered";
  messages: Message[];
}

// ─── Hardcoded data ───────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    buyerName: "Ali Hassan",
    buyerInitials: "AH",
    buyerEmail: "ali.hassan@gmail.com",
    buyerPhone: "+92 300 1234567",
    propertyTitle: "Modern Villa – Gulberg III",
    lastMessage: "Is the price negotiable? I am very interested.",
    lastTime: "11:20 AM",
    status: "pending",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "Hello! I came across your Modern Villa listing in Gulberg III. I am very interested in it.",
        time: "Yesterday, 3:00 PM",
      },
      {
        id: 2,
        from: "seller",
        text: "Thank you for reaching out! Yes, the villa is still available. It has 5 bedrooms, a pool, and a large garden.",
        time: "Yesterday, 3:45 PM",
      },
      {
        id: 3,
        from: "buyer",
        text: "That sounds amazing. What is the asking price?",
        time: "Yesterday, 4:00 PM",
      },
      {
        id: 4,
        from: "seller",
        text: "The asking price is PKR 4.5 Crore. We can also discuss payment plans.",
        time: "Yesterday, 4:30 PM",
      },
      {
        id: 5,
        from: "buyer",
        text: "Is the price negotiable? I am very interested.",
        time: "11:20 AM",
      },
    ],
  },
  {
    id: 2,
    buyerName: "Maria Siddiqui",
    buyerInitials: "MS",
    buyerEmail: "maria.s@outlook.com",
    buyerPhone: "+92 321 9876543",
    propertyTitle: "Luxury Apartment – DHA Phase 6",
    lastMessage: "We would like to schedule a viewing this Friday.",
    lastTime: "10:05 AM",
    status: "answered",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "Hi, my husband and I are interested in the DHA Phase 6 apartment. Can we visit?",
        time: "Mon, 9:00 AM",
      },
      {
        id: 2,
        from: "seller",
        text: "Of course! The apartment is on the 8th floor with a great view. When would you like to visit?",
        time: "Mon, 10:00 AM",
      },
      {
        id: 3,
        from: "buyer",
        text: "We would like to schedule a viewing this Friday.",
        time: "10:05 AM",
      },
      {
        id: 4,
        from: "seller",
        text: "Friday works perfectly. I will confirm the time shortly.",
        time: "10:30 AM",
      },
    ],
  },
  {
    id: 3,
    buyerName: "Zain Ul Abideen",
    buyerInitials: "ZA",
    buyerEmail: "zain.abideen@gmail.com",
    buyerPhone: "+92 333 4567890",
    propertyTitle: "Studio Flat – Bahria Town",
    lastMessage: "Can parking be included in the rent?",
    lastTime: "Yesterday",
    status: "pending",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "I am looking for a studio flat to rent in Bahria Town. I noticed your listing. Is it furnished?",
        time: "Yesterday, 1:00 PM",
      },
      {
        id: 2,
        from: "seller",
        text: "Yes, it is semi-furnished — includes a bed, sofa, and kitchen appliances.",
        time: "Yesterday, 2:30 PM",
      },
      {
        id: 3,
        from: "buyer",
        text: "Can parking be included in the rent?",
        time: "Yesterday, 3:00 PM",
      },
    ],
  },
  {
    id: 4,
    buyerName: "Nadia Farooq",
    buyerInitials: "NF",
    buyerEmail: "nadia.f@yahoo.com",
    buyerPhone: "+92 345 6789012",
    propertyTitle: "Commercial Plot – Model Town",
    lastMessage:
      "We are planning to open a restaurant. Any zoning restrictions?",
    lastTime: "Mon",
    status: "pending",
    messages: [
      {
        id: 1,
        from: "buyer",
        text: "We are planning to open a restaurant on the Model Town commercial plot. Are there any zoning restrictions we should know about?",
        time: "Mon, 10:00 AM",
      },
    ],
  },
];

type TabFilter = "all" | "pending" | "answered";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ViewInquiriesPage() {
  const router = useRouter();
  const [conversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setLocalMessages(selected.messages);
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const filtered = conversations.filter((c) => {
    const matchTab = activeTab === "all" || c.status === activeTab;
    const matchSearch =
      c.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalConversations = conversations.length;
  const pendingCount = conversations.filter(
    (c) => c.status === "pending",
  ).length;

  const handleSend = () => {
    if (!draft.trim() || !selected) return;
    const newMsg: Message = {
      id: localMessages.length + 1,
      from: "seller",
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
            <div className={`${Styles["topbar-name"]} ${Styles["seller"]}`}>
              Messages
            </div>
            <div className={Styles["topbar-sub"]}>
              Chat with your potential buyers
            </div>
          </div>
        </div>

        <div className={Styles["stats"]}>
          <div className={`${Styles["stat"]} ${Styles["stat-green"]}`}>
            <span className={`${Styles["stat-num"]} ${Styles["seller"]}`}>
              {totalConversations}
            </span>
            <span className={Styles["stat-label"]}>Conversations</span>
          </div>
          <div className={`${Styles["stat"]} ${Styles["stat-orange"]}`}>
            <span className={`${Styles["stat-num"]} ${Styles["orange"]}`}>
              {pendingCount}
            </span>
            <span className={Styles["stat-label"]}>Pending</span>
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
              placeholder="🔍 Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter tabs */}
          <div className={Styles["tabs"]}>
            {(["all", "pending", "answered"] as TabFilter[]).map((tab) => (
              <button
                key={tab}
                className={`${Styles["tab"]} ${activeTab === tab ? Styles["tab-active-seller"] : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                className={`${Styles["conv-item"]} ${selected?.id === c.id ? Styles["conv-item-active-seller"] : ""}`}
                onClick={() => setSelected(c)}
              >
                <div
                  className={`${Styles["avatar"]} ${Styles["avatar-seller"]}`}
                >
                  {c.buyerInitials}
                </div>
                <div className={Styles["conv-info"]}>
                  <div className={Styles["conv-top"]}>
                    <span className={Styles["conv-name"]}>{c.buyerName}</span>
                    <span className={Styles["conv-time"]}>{c.lastTime}</span>
                  </div>
                  <div className={Styles["conv-prop"]}>{c.propertyTitle}</div>
                  <div className={Styles["conv-last"]}>{c.lastMessage}</div>
                </div>
                <span
                  className={`${Styles["badge"]} ${c.status === "pending" ? Styles["badge-pending"] : Styles["badge-answered"]}`}
                >
                  {c.status === "pending" ? "Pending" : "Answered"}
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
                Choose a buyer from the list to view messages
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className={Styles["chat-header"]}>
                <div
                  className={`${Styles["avatar"]} ${Styles["avatar-seller"]}`}
                >
                  {selected.buyerInitials}
                </div>
                <div className={Styles["chat-header-info"]}>
                  <div className={Styles["chat-header-name"]}>
                    {selected.buyerName}
                  </div>
                  <div className={Styles["chat-header-sub"]}>
                    📧 {selected.buyerEmail} &nbsp;|&nbsp; 📱{" "}
                    {selected.buyerPhone}
                  </div>
                </div>
                <button
                  className={`${Styles["view-profile-btn"]} ${Styles["seller-profile"]}`}
                >
                  View Profile
                </button>
              </div>

              {/* Messages */}
              <div className={Styles["messages-area"]}>
                {localMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${Styles["msg-row"]} ${msg.from === "seller" ? Styles["msg-row-right"] : Styles["msg-row-left"]}`}
                  >
                    {msg.from === "buyer" && (
                      <div
                        className={`${Styles["avatar"]} ${Styles["avatar-seller"]} ${Styles["avatar-sm"]}`}
                      >
                        {selected.buyerInitials}
                      </div>
                    )}
                    <div
                      className={`${Styles["bubble"]} ${msg.from === "seller" ? Styles["bubble-seller-reply"] : Styles["bubble-other"]}`}
                    >
                      <p className={Styles["bubble-text"]}>{msg.text}</p>
                      <span className={Styles["bubble-time"]}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div className={Styles["input-box"]}>
                <textarea
                  className={Styles["msg-input"]}
                  placeholder="Type your reply here..."
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className={Styles["input-actions"]}>
                  <button
                    className={`${Styles["send-btn"]} ${Styles["send-btn-seller"]}`}
                    onClick={handleSend}
                  >
                    Send Reply
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
