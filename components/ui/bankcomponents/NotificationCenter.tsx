import React, { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Account Update",
      message: "Your account settings have been updated successfully",
      timestamp: new Date(),
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

  return (
    <div>
      {/* bell icon button */}
      <button onClick={toggleDropdown}>
        Notifications {unreadCount > 0 && `(${unreadCount})`}
      </button>

      {/* dropdown panel */}
      {isOpen && (
        <div>
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} onClick={() => markAsRead(notification.id)}>
                <p>{notification.title}</p>
                <p>{notification.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

