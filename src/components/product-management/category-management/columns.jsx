import { Image, Popconfirm, Space, Button, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { categoryEn, categoryMm, categoryZh, imageUrl } from "./fields-name";
import { DEFAULT_IMAGE_URL } from "../../../config/constant";

const CategoryTableColumns = ({ handleEdit, handleDelete, activeKey }) => {
    const { t } = useTranslation("form");

    // Common styles for category name columns
    const categoryNameColumnStyle = {
        wordWrap: "break-word",
        wordBreak: "break-word",
    };

    // Reusable function to render text in category name columns
    const renderText = (text) => (
        <div style={categoryNameColumnStyle}>{text}</div>
    );

    // Reusable function to render text in category image columns
    const renderImage = (text, record) => {
        return (
            <Image
                src={text || DEFAULT_IMAGE_URL}
                alt={`Category Image - ${record[imageUrl[activeKey - 1]]}`}
            />
        );
    };

    // Column definitions
    const columns = [
        {
            title: t("image"),
            dataIndex: imageUrl[activeKey - 1],
            width: 1,
            render: renderImage,
        },
        {
            title: t("category-name-en"),
            dataIndex: categoryEn[activeKey - 1],
            width: 1,
            render: renderText,
        },
        {
            title: t("category-name-mm"),
            dataIndex: categoryMm[activeKey - 1],
            width: 1,
            render: renderText,
        },
        {
            title: t("category-name-zh"),
            dataIndex: categoryZh[activeKey - 1],
            width: 1,
            render: renderText,
        },
        {
            title: t("status"),
            dataIndex: "status",
            width: 1,
            align: "center",
            render: (text) => (
                <Tag color={text ? "green" : "red"}>
                    {text ? t("Enabled") : t("Disabled")}
                </Tag>
            ),
        },
        {
            title: t("actions"),
            dataIndex: "action",
            width: 1,
            responsive: ["md"],
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    {renderEditButton(record)}
                    {renderDeleteButton(record)}
                </Space>
            ),
        },
    ];

    // Render Edit button with Popconfirm and Tooltip
    function renderEditButton(record) {
        return (
            <Popconfirm
                title={t("edit-confirmation")}
                okText={t("ok")}
                cancelText={t("cancel")}
                onConfirm={() => handleEdit(record)}
            >
                <div>
                    <Tooltip title={t("edit")}>
                        <Button
                            type="text"
                            icon={
                                <EditOutlined
                                    style={{ fontSize: "21px", color: "blue" }}
                                />
                            }
                        />
                    </Tooltip>
                </div>
            </Popconfirm>
        );
    }

    // Render Delete button with Popconfirm and Tooltip
    function renderDeleteButton(record) {
        return (
            <Popconfirm
                title={t("delete-confirmation")}
                onConfirm={() => handleDelete(record)}
                okText={t("ok")}
                cancelText={t("cancel")}
            >
                <div>
                    <Tooltip title={t("delete")}>
                        <Button
                            type="text"
                            icon={
                                <DeleteOutlined
                                    style={{ fontSize: "21px", color: "red" }}
                                />
                            }
                        />
                    </Tooltip>
                </div>
            </Popconfirm>
        );
    }

    return columns;
};

export default CategoryTableColumns;
