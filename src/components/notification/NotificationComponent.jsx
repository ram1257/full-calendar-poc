import { useState, useEffect } from "react";

function NotificationComponent({ props }) {
  const [notificationGranted, setNotificationGranted] = useState(false);

  useEffect(() => {
    // request permission for notifications
    if (Notification.permission === "granted") {
      setNotificationGranted(true);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationGranted(true);
        }
      });
    }

    const eventTimes = props;

    // check event times every minute
    const intervalId = setInterval(() => {
      const now = new Date();

      // check if current time is within 5 minutes of any event time
      eventTimes.forEach((eventTime) => {
        const eventStartTime = new Date(eventTime.start);
        const timeDiff = eventStartTime.getTime() - now.getTime();

        if (notificationGranted && timeDiff > 0 && timeDiff <= 300000) {
          // create a new notification
          const notification = new Notification(
            `${eventTime.title} event is starting soon!`,
            {

              body: eventStartTime,
              icon: "https://www.nicepng.com/png/detail/985-9858389_png-file-svg-calendar-vector-icon.png",
            }
          );
          notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open("https://www.javascripttutorial.net/web-apis/javascript-notification/", "_blank");
          }
          // close the notification after 5 seconds
          setTimeout(() => notification.close(), 50000);
        }
      });
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [props, notificationGranted]);

  return null;
}

export default NotificationComponent;
