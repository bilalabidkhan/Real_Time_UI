"use client";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";

const NotificationPanel =() => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handler = (data: any) => {
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("receive_notification", handler);

    return () => {
      socket.off("receive_notification", handler);
    };
  }, []);

  const sendNotification = () => {
    if (!message.trim() || !name.trim() || !email.trim()) return;

    socket.emit("send_notification", {
      title: "Notification",
      name,
      email,
      message,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">⚡Realtime Notifications</h1>
        <p className="text-gray-400">
          WebSocket powered live dashboard
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Input */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">

          <h2 className="text-xl font-semibold">Send Notification</h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
          />

          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message..."
            className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
            rows={4}
          />

          <button
            onClick={sendNotification}
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-xl font-medium"
          >
            Send 🚀
          </button>
        </div>

        {/* Right Notifications */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 h-[500px] overflow-y-auto">

          <h2 className="text-xl font-semibold mb-4">
            Notifications
          </h2>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              No notifications yet...
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl hover:scale-[1.02] transition"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      🔔 {n.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      ⏰ {n.time}
                    </span>
                  </div>

                  <p className="mt-2 text-zinc-300">
                    <b>{n.name}</b>: {n.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default NotificationPanel