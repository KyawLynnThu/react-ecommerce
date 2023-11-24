import { PropTypes } from "prop-types";
import { useTranslation } from "react-i18next";
import { useCommonApiMutation, useGetDataQuery } from "../../../config/api";
import endpoints from "../../../config/api/endpoints";
import ResizableAntTable from "../../common/resizable-ant-table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Typography, Tooltip, Image } from "antd";
import { scrollAction, setLocalStorage } from "../../../utils/helper";
// import { useEffect } from "react";

const List = ({ setMsg, setErrorStatus, setUpdateData }) => {
    const { t } = useTranslation("form");
    const { data } = useGetDataQuery(endpoints.brandEndpoint);

    console.log(t("brand-image"));

    const [commonApi] = useCommonApiMutation();

    const editHandler = (data) => {
        setUpdateData(data);
        scrollAction();
        setLocalStorage("brand_img", data?.brandImageUrl);
    };

    const deleteHandler = async (data) => {
        const reqData = {
            endpoint: `${endpoints.brandEndpoint}/${data}`,
            method: "DELETE",
        };
        try {
            const response = await commonApi(reqData);
            setMsg(response?.data?.message);
            setErrorStatus(!response?.data?.isSuccess);
        } catch (error) {
            setErrorStatus(true);
            setMsg(error.message || "An Error Occurred");
        }
    };

    const columns = [
        {
            title: `${t("no")}`,
            align: "center",
            width: 1,
            responsive: ["md"],
            render: (_, record, index) => index + 1,
        },
        {
            title: `${t("brand-image")}`,
            width: 1,
            dataIndex: "brandImageUrl",
            responsive: ["md"],
            render: (text) => {
                return (
                    <Image
                        width={80}
                        src={
                            text ||
                            "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                        }
                    />
                );
            },
        },
        {
            title: `${t("brand-name")}`,
            width: 1,
            dataIndex: "brandName",
            responsive: ["md"],
        },

        {
            title: `${t("actions")}`,
            align: "center",
            key: "actions",
            render: (_, record) => (
                <Space size={"middle"}>
                    <Popconfirm
                        title={t("edit-confirmation")}
                        okText={t("ok")}
                        cancelText={t("cancel")}
                        onConfirm={() => editHandler(record)}
                    >
                        <>
                            <Tooltip placement="topRight" title={t("edit")}>
                                <Button
                                    type="text"
                                    icon={
                                        <EditOutlined
                                            style={{
                                                fontSize: "21px",
                                                color: "blue",
                                            }}
                                        />
                                    }
                                />
                            </Tooltip>
                        </>
                    </Popconfirm>
                    <Popconfirm
                        title={t("delete-confirmation")}
                        okText={t("ok")}
                        cancelText={t("cancel")}
                        onConfirm={() => deleteHandler(record?.key)}
                    >
                        <>
                            <Tooltip placement="topRight" title={t("delete")}>
                                <Button
                                    type="text"
                                    icon={
                                        <DeleteOutlined
                                            style={{
                                                fontSize: "21px",
                                                color: "red",
                                            }}
                                        />
                                    }
                                />
                            </Tooltip>
                        </>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    console.log(columns);

    return (
        <>
            <Typography.Title level={2}>{t("brand-list")}</Typography.Title>
            <ResizableAntTable
                data={data?.data || []}
                size="small"
                bordered
                columns={columns}
            />
        </>
    );
};

export default List;

List.propTypes = {
    setErrorStatus: PropTypes.func.isRequired,
    setMsg: PropTypes.func.isRequired,
    setUpdateData: PropTypes.func.isRequired,
};
