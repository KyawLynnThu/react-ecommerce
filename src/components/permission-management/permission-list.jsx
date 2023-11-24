import PropTypes from "prop-types"; // Import PropTypes
import { Popconfirm, Space, Typography, Button, Tooltip } from "antd";
import { useGetDataQuery } from "../../config/api";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import endpoints from "../../config/api/endpoints";
import { useCommonApiMutation } from "../../config/api";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { useDebounce } from "use-debounce";
import ResizableAntTable from "../common/resizable-ant-table";

const PermissionList = ({ translate }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [commonApi] = useCommonApiMutation();
    const { t } = useTranslation("form");
    const endpoint = endpoints.permissionEndpoint;
    const [searchPermission, setSearchPermission] = useState("");
    const [debounceSearch] = useDebounce(searchPermission, 500);
    const { data } = useGetDataQuery(
        endpoint + `?search=${debounceSearch}&page=${page}&limit=${limit}`,
    );

    let counter = page == 1 ? 1 : (page - 1) * limit + 1;
    // let formattedData = [];

    // reset page and limit when type on search
    useEffect(() => {
        setPage(1);
        setLimit(10);
    }, [searchPermission]);

    const formattedData = data?.data?.data.map((permit, index) => ({
        no: counter++,
        key: index,
        group: permit.group,
        permission_ids: permit.data.map((item) => {
            return item.id;
        }),
    }));

    const deleteHandler = async (data) => {
        // For Parallel Api Call
        try {
            const deletePromises = data.permission_ids.map(
                async (permissionId) => {
                    const reqData = {
                        endpoint: `${endpoint}/${permissionId}`,
                        method: "DELETE",
                    };
                    return commonApi(reqData);
                },
            );

            await Promise.all(deletePromises);
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: `${t("no")}`,
            dataIndex: "no",
            key: "id",
            align: "center",
            width: 1,
            responsive: ["md"],
        },
        {
            title: `${t("group")}`,
            dataIndex: "group",
            key: "group",
            width: 1,
            responsive: ["md"],
        },
        {
            title: `${t("actions")}`,
            dataIndex: "action",
            key: "actions",
            width: 1,
            responsive: ["md"],
            align: "center",
            render: (_, record) => (
                <Space size={"middle"}>
                    <Tooltip placement="topRight" title={t("delete")}>
                        <>
                            <Popconfirm
                                title="Are you sure to delete this permission?"
                                onConfirm={() => deleteHandler(record)}
                                okText="Delete"
                                cancelText="Cancle"
                            >
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
                            </Popconfirm>
                        </>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Typography.Title
                style={{ marginTop: 0, marginBottom: 40 }}
                level={2}
            >
                {translate("permission-list")}
            </Typography.Title>
            <Input
                style={{
                    width: "25%",
                }}
                placeholder="Search Permission by Name"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchPermission(e.target.value)}
            />
            <ResizableAntTable
                size="small"
                pagination={{
                    total: data?.data.total_group_count,
                    onChange: (page, limit) => {
                        setPage(page);
                        setLimit(limit);
                    },
                }}
                style={{ marginTop: 40 }}
                data={formattedData || []}
                columns={columns}
                bordered
            />
        </>
    );
};

export default PermissionList;

PermissionList.propTypes = {
    translate: PropTypes.func.isRequired,
};
