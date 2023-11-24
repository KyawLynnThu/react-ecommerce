import { Fragment, useState, useEffect } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import CategoryRegistration from "./category-registration";
import AnimatedLayout from "../../common/animated-layout";
import endpoints from "../../../config/api/endpoints";
import { useCommonApiMutation } from "../../../config/api";
import CategoryList from "./category-list";

const CategoryManagement = () => {
    const { t } = useTranslation("form");
    const [defaultKey] = useState(1);
    const [activeKey, setActiveKey] = useState(defaultKey);
    const [optionData, setOptionData] = useState([]);
    const [url, setUrl] = useState("");

    const [commonApi] = useCommonApiMutation();

    useEffect(() => {
        // Extract the common logic for fetching data
        const fetchData = async (apiEndpoint) => {
            const response = await commonApi({ endpoint: apiEndpoint });
            if (response.data?.isSuccess) {
                setOptionData(response.data.data);
            }
        };

        // Use a switch statement for better readability
        switch (activeKey) {
            case 1:
                setUrl(endpoints.categoriesEndpoint);
                break;
            case 2:
                setUrl(endpoints.categorysubgroupsEndpoint);
                fetchData(endpoints.categoriesEndpoint);
                break;
            case 3:
                setUrl(endpoints.subcategoriesEndpoint);
                fetchData(endpoints.categorysubgroupsEndpoint);
                break;
            default:
                // Handle the default case if necessary
                break;
        }
    }, [activeKey]);

    const onChange = (key) => {
        setActiveKey(key);
    };

    const items = [
        {
            key: 1,
            label: t("category"),
            children: (
                <CategoryRegistration
                    title={t("category")}
                    activeKey={activeKey}
                    optionData={optionData}
                    url={url}
                />
            ),
        },
        {
            key: 2,
            label: t("category-subgroup"),
            children: (
                <CategoryRegistration
                    title={t("category-subgroup")}
                    activeKey={activeKey}
                    optionData={optionData}
                    url={url}
                />
            ),
        },
        {
            key: 3,
            label: t("sub-category"),
            children: (
                <CategoryRegistration
                    title={t("sub-category")}
                    activeKey={activeKey}
                    optionData={optionData}
                    url={url}
                />
            ),
        },
    ];

    return (
        <Fragment>
            <AnimatedLayout>
                <Tabs
                    defaultActiveKey={defaultKey}
                    items={items}
                    onChange={onChange}
                />
            </AnimatedLayout>
            <CategoryList activeKey={activeKey} />
        </Fragment>
    );
};

export default CategoryManagement;
