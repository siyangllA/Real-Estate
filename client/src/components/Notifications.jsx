import React, { useEffect, useState } from 'react';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    const res = await fetch(`http://localhost:5000/api/notifications/${userId}`);
    const data = await res.json();
    setNotifications(data);
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}`, {
      method: 'PUT',
    });
    fetchNotifications(); // refresh
  };

  // Delete notification
  const deleteNotification = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}`, {
      method: 'DELETE',
    });
    fetchNotifications(); // refresh
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h3>🔔 Notifications</h3>
      {notifications.length === 0 && <p>No notifications</p>}
      <ul>
        {notifications.map((n) => (
          <li key={n._id} style={{ marginBottom: '10px' }}>
            <strong>{n.message}</strong>
            {!n.isRead && (
              <button onClick={() => markAsRead(n._id)}>Mark as Read</button>
            )}
            <button onClick={() => deleteNotification(n._id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
