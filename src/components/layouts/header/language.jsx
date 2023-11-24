import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Flex, Typography } from "antd";
import { useDispatch } from "react-redux";
import { setLocale } from "../../../features/localeSlice";
import i18n from "../../../../i18n";
import enFlag from "/images/flags/en.png";
import mmFlag from "/images/flags/mm.png";
import cnFlag from "/images/flags/cn.png";

const iconStyle = {
    width: "16px",
    height: "16px",
};

const items = [
    {
        label: "English",
        key: "en",
        icon: <img src={enFlag} style={iconStyle} alt="english" />,
    },
    {
        label: "Burmese",
        key: "mm",
        icon: <img src={mmFlag} style={iconStyle} alt="myanmar" />,
    },
    {
        label: "Chinese",
        key: "zh",
        icon: <img src={cnFlag} style={iconStyle} alt="chinese" />,
    },
];

const Language = () => {
    const dispatch = useDispatch();
    const icon_label = [enFlag, mmFlag, cnFlag];
    const [labelPointer, setLabelPointer] = useState(0);

    useEffect(() => {
        const localePack = JSON.parse(localStorage.getItem("reduxState"));

        if (localePack && localePack.locale) {
            localePack.locale === "en"
                ? setLabelPointer(0)
                : localePack.locale === "mm"
                ? setLabelPointer(1)
                : setLabelPointer(2);

            i18n.changeLanguage(localePack.locale || "en");
        } else {
            setLabelPointer(0);
        }
    }, []);

    const clickhandler = ({ key }) => {
        // for UI
        key === "en"
            ? setLabelPointer(0)
            : key === "mm"
            ? setLabelPointer(1)
            : setLabelPointer(2);

        i18n.changeLanguage(key);
        dispatch(setLocale(key));
    };

    return (
        <Dropdown
            trigger={["click"]}
            overlayClassName="custom-dropdown"
            menu={{
                items,
                onClick: clickhandler,
                style: { width: 130 },
            }}
            placement="bottomRight"
        >
            <Typography.Link>
                <Flex justify="center" align="center" gap={"8px"}>
                    <img
                        src={icon_label[labelPointer]}
                        style={{
                            width: "18px",
                        }}
                    />
                    {/* <Text className='mobile-screen' type='secondary'>
						{items[labelPointer]?.label}
					</Text> */}
                    <DownOutlined type="secondary" />
                </Flex>
            </Typography.Link>
        </Dropdown>
    );
};

export default Language;
