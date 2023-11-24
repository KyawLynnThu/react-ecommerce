const primaryColor = "#764ABC";
// const textColor = "#FFFFFF";

const defaultTheme = {
    token: {
        colorPrimary: primaryColor,
        // colorBgContainer: 'yellow',
        // colorText: 'blue', // All text color except button
        // colorTextLightSolid: 'black', // Button text color
        // colorBgLayout: 'red',
    },
    components: {
        Layout: {
            bodyBg: "#fdf7ff",
            // algorithm: true
        },
        Sider: {
            width: "240px",
            algorithm: true,
        },
        Table: {
            headerBg: "#F6EDFC",
            borderColor: "#F6EDFC",
            // headerColor: "#533185",
            // headerBorderRadius: 0
        },
        Menu: {
            // colorText: 'black',
            // algorithm: true
        },
        Button: {
            // colorPrimary: 'red',
            // colorHover: 'red',
            // colorSelected: 'red',
            // algorithm: true
        },
        // Input: {
        // 	colorPrimary: 'red',
        // 	colorHover: 'red',
        // 	colorSelected: 'red',
        // },
        // Select: {
        // 	colorPrimary: 'purple',
        // },
        // Radio: {
        // 	colorPrimary: 'orange',
        // },
        // Checkbox: {
        // 	colorPrimary: 'teal',
        // },
    },
};

export default defaultTheme;
