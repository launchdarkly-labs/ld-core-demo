import React, { useState, useEffect, useRef } from "react";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { Bell, X, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { recordErrorToLD } from "@/utils/observability/client";

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
  const isMobile = useIsMobile();
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
      
      // function to throw error with metadata
      const throwError = () => {
        const error = new Error("Event listener recursion in NotificationCenter - continuous notification generation detected");
        error.name = "Notification Spam Error";
        // Add recordErrorToLD for this error for observability
        recordErrorToLD(
          error,
          "Notification spam error in NotificationCenter - continuous notification generation detected",
          {
            component: "NotificationCenter",
            errorType: "notification-spam",
            severity: "high",
            userAction: "flag-enabled",
            affectedFeature: "enhanced-notification-center",
            flagKey: "enhancedNotificationCenter",
            suggestedFix: "Add loading state or debounce to prevent duplicate notification generation",
            sourceFile: "components/ui/bankcomponents/NotificationCenter.tsx",
            sourceFunction: "useEffect (notification spam generator)",
            codeLocation: "Lines 30-85 (spam generation loop)",
            timestamp: new Date().toISOString(),
          }
        );
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
      };

      // throw first error immediately (at 0s)
      queueMicrotask(() => {
        throwError();
      });

      // throw one more error at 20 seconds (2 total errors: 0s and 20s)
      const errorTimeout = setTimeout(() => {
        if (spamActiveRef.current) {
          queueMicrotask(() => {
            throwError();
          });
        }
      }, 20000); // 20 seconds = 20000ms

      // start continuous spam 
      const spamInterval = () => {
        if (!spamActiveRef.current) return; // stop if flag is disabled
        
        setNotifications((prev) => {
          const newBatch: Notification[] = [];
          const currentCount = prev.length;
          
          // reduced batch size: always 1 notification (half of previous 1-2)
          const randomBatchSize = 1;
          
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
        
        // schedule next batch with longer random timing (4-12 seconds, half the frequency)
        if (spamActiveRef.current) {
          const nextDelay = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;
          setTimeout(spamInterval, nextDelay);
        }
      };
      
      // start the spam loop
      const initialDelay = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
      setTimeout(spamInterval, initialDelay);

      // stop notification generation after 30 seconds
      const stopNotificationTimeout = setTimeout(() => {
        spamActiveRef.current = false;
      }, 30000); // 30 seconds = 30000ms

      return () => {
        spamActiveRef.current = false;
        errorThrownRef.current = false;
        clearTimeout(errorTimeout); // clear the error timeout
        clearTimeout(stopNotificationTimeout); // clear the stop notification timeout
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
        className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className={`h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 ${isOpen ? 'text-[#405BFF]' : notifications.length > 10 ? 'text-red-600' : 'text-[#58595B]'}`} />
        {unreadCount > 0 && (
          <Badge className={`absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-white text-[10px] sm:text-xs font-sohne ${notifications.length > 10 ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed sm:absolute top-20 sm:top-auto right-4 sm:right-0 left-4 sm:left-auto mt-0 sm:mt-2 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-zinc-200 z-50 overflow-hidden w-auto sm:w-[min(90vw,360px)] md:w-96 lg:w-[28rem] max-w-[calc(100vw-2rem)] sm:max-w-none max-h-[calc(100vh-5rem)] sm:max-h-none flex flex-col"
            >
            {/* header */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-zinc-200 bg-white">
              <h3 className="text-sm sm:text-base md:text-lg font-sohne font-semibold text-[#58595B]">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[10px] sm:text-xs font-sohne text-[#405BFF] hover:opacity-80 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* API communication error banner - shown when flag is enabled */}
            {enhancedNotificationCenter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 md:p-5 bg-red-50 border-b border-red-200"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-sohne font-semibold text-red-900">
                      API Communication Error
                    </p>
                    <p className="text-[11px] sm:text-xs font-sohnelight text-red-700 mt-1 leading-relaxed">
                      The notifications API is unable to communicate properly. Please try again later or contact support if the issue persists.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* spam warning - error state */}
            {notifications.length > 10 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 md:p-5 bg-red-50 border-b border-red-200"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-sohne font-semibold text-red-900">
                      System Alert
                    </p>
                    <p className="text-[11px] sm:text-xs font-sohnelight text-red-700 mt-1 leading-relaxed">
                      We're experiencing an issue loading your notifications. Our team has been notified and is working on a fix. Please refresh or try again later.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* notification list */}
            <div className="overflow-y-auto flex-1 min-h-0 max-h-[calc(100vh-16rem)] sm:max-h-[60vh] md:max-h-96 lg:max-h-[28rem]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 text-center">
                  <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-300 mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm font-sohnelight text-[#58595B]">
                    No new notifications
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 sm:p-4 md:p-5 border-b border-zinc-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0 ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs sm:text-sm font-sohne font-semibold text-[#58595B] flex-1 break-words">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#405BFF] rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs font-sohnelight text-[#58595B] mt-1 leading-relaxed break-words">
                          {notification.message}
                        </p>
                        <p className="text-[10px] sm:text-xs font-sohnelight text-gray-400 mt-1.5 sm:mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
          </>
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

