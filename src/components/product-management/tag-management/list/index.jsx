import { PropTypes } from "prop-types";
import { useTranslation } from "react-i18next";
import { useCommonApiMutation, useGetDataQuery } from "../../../../config/api";
import endpoints from "../../../../config/api/endpoints";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ResizableAntTable from "../../../common/resizable-ant-table";

const TagList = ({ setErrorStatus, setMsg, setUpdateData }) => {
    const { t } = useTranslation("form");
    const [commonApi] = useCommonApiMutation();
    const { data } = useGetDataQuery(endpoints.tagEndpoint);

    const editHandler = (data) => {
        setUpdateData(data);
    };

    const deleteHandler = async (data) => {
        const reqData = {
            endpoint: `${endpoints.tagEndpoint}/${data}`,
            method: "DELETE",
        };

        try {
            const response = await commonApi(reqData);
            const { message, isSuccess } = response.data;
            setMsg(message);
            setErrorStatus(!isSuccess);
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
            title: `${t("tag-name")}`,
            width: 1,
            dataIndex: "tagName",
            responsive: ["md"],
        },
        {
            title: `${t("actions")}`,
            align: "center",
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

    return (
        <>
            <ResizableAntTable
                bordered
                size="small"
                columns={columns}
                data={data?.data || []}
            />
        </>
    );
};

export default TagList;

TagList.propTypes = {
    setErrorStatus: PropTypes.func.isRequired,
    setMsg: PropTypes.func.isRequired,
    setUpdateData: PropTypes.func.isRequired,
};
