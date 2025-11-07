import React, { useState, useEffect, useRef } from "react";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { Bell, X, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: "info" | "alert" | "success" | "warning";
}

export default function NotificationCenter() {
  const ldClient = useLDClient();
  const flags = useFlags();
  const enhancedNotificationCenter = flags.enhancedNotificationCenter;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const errorThrownRef = useRef(false);
  const spamActiveRef = useRef(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // continuous notification spam when flag is enabled
  useEffect(() => {
    if (enhancedNotificationCenter) {
      spamActiveRef.current = true;
      
      // throw error once when flag is first detected
      if (!errorThrownRef.current) {
        errorThrownRef.current = true;
        
        // throw error immediately using queueMicrotask
        queueMicrotask(() => {
          const error = new Error("Event listener recursion in NotificationCenter - continuous notification generation detected");
          error.name = "Notification Spam Error";
          
          // add metadata for better error context and Vega analysis
          (error as any).component = "NotificationCenter";
          (error as any).errorType = "notification-spam";
          (error as any).severity = "high";
          (error as any).userAction = "flag-enabled";
          (error as any).affectedFeature = "enhanced-notification-center";
          (error as any).flagKey = "enhancedNotificationCenter";
          (error as any).suggestedFix = "Add loading state or debounce to prevent duplicate notification generation";
          (error as any).sourceFile = "components/ui/bankcomponents/NotificationCenter.tsx";
          (error as any).sourceFunction = "useEffect (notification spam generator)";
          (error as any).codeLocation = "Lines 30-85 (spam generation loop)";
          (error as any).timestamp = new Date().toISOString();
          
          console.error("🔴 Notification Spam Error:", error);
          
          // throw the error to trigger global error handlers
          throw error;
        });
      }

      // start continuous spam 
      const spamInterval = () => {
        if (!spamActiveRef.current) return; // stop if flag is disabled
        
        setNotifications((prev) => {
          const newBatch: Notification[] = [];
          const currentCount = prev.length;
          
          // random batch size: grows over time
          const randomBatchSize = Math.floor(Math.random() * (25 - 3 + 1)) + 3 + Math.floor(currentCount / 50);
          
          for (let i = 0; i < randomBatchSize; i++) {
            newBatch.push({
              id: `spam-${currentCount + i}-${Date.now()}-${Math.random()}`,
              title: i % 3 === 0 ? "Security Alert!" : i % 3 === 1 ? "Urgent Action Required!" : "Account Notice",
              message: i % 3 === 0 
                ? "Unauthorized access attempt detected. Verify your identity immediately!" 
                : i % 3 === 1 
                ? "Your account has been compromised. Click here now!"
                : "Unusual activity detected on your account!",
              timestamp: new Date(),
              read: false,
              type: i % 2 === 0 ? "alert" : "warning",
            });
          }
          
          return [...prev, ...newBatch];
        });
        
        // schedule next batch with random timing
        if (spamActiveRef.current) {
          const nextDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
          setTimeout(spamInterval, nextDelay);
        }
      };
      
      // start the spam loop
      const initialDelay = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
      setTimeout(spamInterval, initialDelay);

      return () => {
        spamActiveRef.current = false;
        errorThrownRef.current = false;
      };
    } else {
      // reset when flag is disabled
      spamActiveRef.current = false;
      errorThrownRef.current = false;
      setNotifications([]); // clear spam notifications
    }
  }, [enhancedNotificationCenter]);

  const toggleDropdown = () => {
    if (!isOpen && !enhancedNotificationCenter) {
      // normal behavior: load a few standard notifications (only when flag is OFF)
      const normalNotifications: Notification[] = [
        {
          id: "notif-1",
          title: "Payment Received",
          message: "You received a payment of $150.00 from John Doe",
          timestamp: new Date(Date.now() - 3600000),
          read: false,
          type: "success",
        },
        {
          id: "notif-2",
          title: "Account Statement",
          message: "Your monthly statement is now available",
          timestamp: new Date(Date.now() - 86400000),
          read: false,
          type: "info",
        },
        {
          id: "notif-3",
          title: "Security Update",
          message: "We've updated our security settings",
          timestamp: new Date(Date.now() - 172800000),
          read: true,
          type: "info",
        },
      ];
      setNotifications(normalNotifications);
    }
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* bell icon button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className={`h-6 w-6 ${isOpen ? 'text-blue-600' : notifications.length > 10 ? 'text-red-600' : 'text-gray-700'}`} />
        {unreadCount > 0 && (
          <Badge className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-white text-xs ${notifications.length > 10 ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
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

            {/* spam warning - error state */}
            {notifications.length > 10 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-b-2 border-red-300"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-900 font-sohne">
                      ⚠️ System Alert
                    </p>
                    <p className="text-xs text-red-700 font-sohnelight mt-1">
                      We're experiencing an issue loading your notifications. Our team has been notified and is working on a fix. Please refresh or try again later.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

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

