import React, { useState, useEffect, useRef } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { Bell, X, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationCenter() {
  const { notificationCenterGuardedRelease } = useFlags();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Security Alert",
      message: "New device login detected from Chrome on MacOS",
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Transaction Completed",
      message: "Your transfer of $500 has been processed successfully",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  //close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  //don't render if flag is off
  if (!notificationCenterGuardedRelease) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* bell icon button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className={`h-6 w-6 ${isOpen ? 'text-blue-600' : 'text-gray-700'}`} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            {unreadCount}
          </Badge>
        )}
      </button>

      {/* dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold font-sohne text-gray-900">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* notification list */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 font-sohnelight">
                    No new notifications
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold font-sohne text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-sohnelight mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// helper function to format timestamp
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

