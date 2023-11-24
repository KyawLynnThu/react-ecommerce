import { Fragment, useState, useEffect } from "react";
import { useCommonApiMutation, useGetDataQuery } from "../../../config/api";
import ResizableAntTable from "../../common/resizable-ant-table";
import AnimatedLayout from "../../common/animated-layout";
import endpoints from "../../../config/api/endpoints";
import CategoryTableColumns from "./columns";
import AppAlert from "../../common/alert";
import PropTypes from "prop-types";
import { scrollAction } from "../../../utils/helper";
import { setEditData } from "../../../features/categorySlice";
import { useDispatch } from "react-redux";

const CategoryList = ({ activeKey }) => {
    // Dispatch hook
    const dispatch = useDispatch();

    // Fetching data and managing state
    const endpointMap = {
        1: endpoints.categoriesEndpoint,
        2: endpoints.categorysubgroupsEndpoint,
        default: endpoints.subcategoriesEndpoint,
    };

    const endpoint = endpointMap[activeKey] || endpointMap.default;
    const { data } = useGetDataQuery(endpoint);

    const [errorStatus, setErrorStatus] = useState(false);
    const [msg, setMsg] = useState("");

    // API mutation hook
    const [commonApi] = useCommonApiMutation();

    useEffect(() => {
        setMsg("");
    }, [activeKey]);

    // Edit handler
    const handleEdit = (data) => {
        setMsg("");
        dispatch(setEditData(data));
        scrollAction();
    };

    // Delete handler
    const handleDelete = async (data) => {
        try {
            // Making DELETE request
            const response = await commonApi({
                endpoint: `${endpoint}/${data.id}`,
                method: "DELETE",
            });

            // Handling response
            setErrorStatus(response.data?.isSuccess);
            setMsg(response.data?.message);
        } catch (error) {
            // Handling error
            console.error("Error during delete:", error);
            setErrorStatus(false);
            setMsg("An error occurred during delete.");
        }
    };

    // Columns configuration
    const columns = CategoryTableColumns({
        handleEdit,
        handleDelete,
        activeKey,
    });

    return (
        <AnimatedLayout style={{ marginTop: 15 }}>
            <Fragment>
                {/* Displaying alert message if any */}
                {msg && (
                    <AppAlert
                        msg={msg}
                        status={errorStatus}
                        onClose={() => setMsg("")}
                    />
                )}

                {/* Resizable Ant Table */}
                <ResizableAntTable
                    data={data?.data || []}
                    columns={columns}
                    size="small"
                    scrollY={400}
                    pagination={false}
                />
            </Fragment>
        </AnimatedLayout>
    );
};

CategoryList.propTypes = {
    activeKey: PropTypes.number.isRequired,
};

export default CategoryList;
