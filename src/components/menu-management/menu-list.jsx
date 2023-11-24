import PropTypes from "prop-types";
import ResizableAntTable from "../common/resizable-ant-table";
import { useTranslation } from "react-i18next";

const MenuList = ({ data }) => {
    const { t } = useTranslation("form");
    const columns = [
        {
            title: t("label"),
            dataIndex: "label",
            key: "label",
            width: 1,
        },
        {
            title: t("path"),
            dataIndex: "path",
            key: "path",
            width: 1,
            responsive: ["md"],
        },
        {
            title: t("parent-id"),
            dataIndex: "id",
            key: "id",
            width: 1,
            responsive: ["md"],
        },
        {
            title: t("child-id"),
            dataIndex: "parent_id",
            key: "parent_id",
            width: 1,
            responsive: ["md"],
        },
    ];

    return (
        <ResizableAntTable
            columns={columns}
            data={data}
            style={{ marginTop: 40 }}
        />
    );
};

MenuList.propTypes = {
    data: PropTypes.array.isRequired,
};

export default MenuList;
