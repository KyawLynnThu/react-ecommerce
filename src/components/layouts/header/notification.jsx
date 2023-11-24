import { PropTypes } from "prop-types";
import { Button, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Notification = ({ darkMode }) => {
    const notificationCount = 5;

    const handleNotificationClick = () => {
        // Handle click action for the notification button
        // For instance, opening a notification panel
        console.log("Notification button clicked");
    };

    return (
        <Button type="text" shape="circle" onClick={handleNotificationClick}>
            <Badge count={notificationCount}>
                <FontAwesomeIcon
                    icon={faBell}
                    style={{
                        fontSize: "21px",
                        color: darkMode ? "white" : "black",
                    }}
                />
                {/* <BellOutlined style={{ fontSize: "21px" }} /> */}
            </Badge>
        </Button>
    );
};

export default Notification;

Notification.propTypes = {
    darkMode: PropTypes.bool.isRequired,
};
