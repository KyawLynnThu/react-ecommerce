import { Fragment, useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Alert, Radio, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useCommonApiMutation } from "../../../config/api";
import {
    categoryEn,
    categoryMm,
    categoryZh,
    categoryId,
    categoryImg,
    initialValues,
    statusOptions,
    imageUrl,
} from "./fields-name";
import { useDispatch, useSelector } from "react-redux";
import { clearEditData } from "../../../features/categorySlice";
import PropTypes from "prop-types";
import SingleFileUpload from "../../common/single-file-upload";
import { scrollAction } from "../../../utils/helper";

const CategoryTabs = ({ title, activeKey, optionData, url }) => {
    // Hooks for state management
    const { t: f } = useTranslation("form");
    const dispatch = useDispatch();
    const [errorStatus, setErrorStatus] = useState(false);
    const [msg, setMsg] = useState("");
    const [fileList, setFileList] = useState([]);

    // Retrieve the editData from the category slice
    const editData = useSelector((state) => state.category.editData);

    // API mutation hook
    const [commonApi, { isLoading }] = useCommonApiMutation();
    const [form] = Form.useForm();

    useEffect(() => {
        // Set form fields value when id exists
        if (editData?.id) {
            setMsg("");
            const data = {
                [categoryEn[activeKey - 1]]:
                    editData[categoryEn[activeKey - 1]],
                [categoryMm[activeKey - 1]]:
                    editData[categoryMm[activeKey - 1]],
                [categoryZh[activeKey - 1]]:
                    editData[categoryZh[activeKey - 1]],
                [categoryId[activeKey - 1]]:
                    editData[categoryId[activeKey - 1]],
                status: editData.status,
                sort: editData.sort,
            };
            form.setFieldsValue(data);
        }
    }, [editData]);

    // Set default form fields value and remove alert message
    useEffect(() => {
        form.resetFields();
        setFileList([]);
        setMsg("");

        if (editData) dispatch(clearEditData());
    }, [activeKey]);

    // Handles form submission
    const onFinish = async (values) => {
        const tempObj = {
            [categoryEn[activeKey - 1]]: values[categoryEn[activeKey - 1]],
            [categoryMm[activeKey - 1]]: values[categoryMm[activeKey - 1]],
            [categoryZh[activeKey - 1]]: values[categoryZh[activeKey - 1]],
            [categoryId[activeKey - 1]]: values[categoryId[activeKey - 1]],
            ...values,
        };

        // Create FormData to handle file uploads
        const formData = new FormData();

        // Loop through tempObj and append them to FormData
        for (const key in tempObj) {
            formData.append(key, values[key]);
        }

        // If there is a file selected, append it to FormData
        if (fileList && fileList.length > 0) {
            const imgFile = fileList[0].originFileObj;
            formData.append(categoryImg[activeKey - 1], imgFile);
        }

        // let endpoint = url;
        let method = "POST";

        if (editData?.id) {
            // If id exists, append it to the URL and change method
            url += `/${editData?.id}`;
            method = "PUT";
        }

        // Define API request data
        const reqData = {
            endpoint: url,
            method,
            body: formData,
        };

        try {
            // Make API request
            const response = await commonApi(reqData);

            // Update state based on API response
            setErrorStatus(!response.data.isSuccess);
            setMsg(response.data?.message);

            // If API request is successful, reset form and clear file selection
            if (response.data?.isSuccess) {
                form.resetFields();
                setFileList([]);
                if (editData) dispatch(clearEditData());
            }
        } catch (error) {
            // Handle API request error
            const errorMessage = error.message || "An error occurred.";
            setErrorStatus(true);
            setMsg(errorMessage);
        }
        scrollAction();
    };

    // Handles form submission failure
    const onFinishFailed = (errorInfo) => {
        setMsg("");
        console.log("Failed:", errorInfo);
    };

    // Handles file change in FileUpload component
    const handleFileChange = (fileList) => {
        setMsg("");
        setFileList(fileList);
    };

    return (
        <Fragment>
            {/* Display Success/Error Message */}
            {msg && (
                <Alert
                    message={msg}
                    type={errorStatus ? "error" : "success"}
                    closable
                    onClose={() => setMsg("")}
                    style={{ marginBottom: 30 }}
                />
            )}

            {/* Sub Category Registration Form */}
            <Form
                form={form}
                initialValues={initialValues}
                name={title}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{ sm: { span: 9 }, md: { span: 6 } }}
                wrapperCol={{ span: 12 }}
            >
                {/* Category Name (English) */}
                <Form.Item
                    label={f("category-name-en")}
                    name={categoryEn[activeKey - 1]}
                    rules={[
                        {
                            required: true,
                            message: "Please enter the category name!",
                        },
                    ]}
                >
                    <Input maxLength={255} />
                </Form.Item>

                {/* Category Name (Myanmar) */}
                <Form.Item
                    label={f("category-name-mm")}
                    name={categoryMm[activeKey - 1]}
                    rules={[
                        {
                            required: true,
                            message: "Please enter the category name!",
                        },
                    ]}
                >
                    <Input maxLength={255} />
                </Form.Item>

                {/* Category Name (Chinese) */}
                <Form.Item
                    label={f("category-name-zh")}
                    name={categoryZh[activeKey - 1]}
                    rules={[
                        {
                            required: true,
                            message: "Please enter the category name!",
                        },
                    ]}
                >
                    <Input maxLength={255} />
                </Form.Item>

                {activeKey !== 1 && (
                    <Form.Item
                        label={
                            activeKey === 2
                                ? f("category-id")
                                : f("category-subgroup-id")
                        }
                        name={categoryId[activeKey - 1]}
                        rules={[
                            {
                                required: true,
                                message: "Please choose the Category ID!",
                            },
                        ]}
                    >
                        <Select>
                            {optionData &&
                                optionData?.map((i, index) => {
                                    return (
                                        <Select.Option key={index} value={i.id}>
                                            {activeKey === 2
                                                ? i.categoryName_en
                                                : i.subgroupName_en}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                )}

                {/* Sort Order */}
                <Form.Item label={f("sort")} name="sort">
                    <InputNumber
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>

                {/* Status (Enable/Disable) */}
                <Form.Item label={f("status")} name="status">
                    <Radio.Group>
                        {statusOptions.map((option) => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>

                {/* Category Image Upload */}
                <Form.Item label={f("category-image")} name="category-image">
                    <SingleFileUpload
                        setMsg={setMsg}
                        onFileChange={handleFileChange}
                        setErrorStatus={setErrorStatus}
                        buttonText={f("click-to-upload")}
                        initialImageUrl={editData?.[imageUrl[activeKey - 1]]}
                    />
                </Form.Item>

                {/* Form Submission Button */}
                <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                    <Button
                        disabled={isLoading}
                        type="primary"
                        htmlType="submit"
                        style={{ marginTop: 20 }}
                    >
                        {editData?.id ? f("update") : f("save")}
                    </Button>
                </Form.Item>
            </Form>
        </Fragment>
    );
};

CategoryTabs.propTypes = {
    title: PropTypes.string.isRequired,
    activeKey: PropTypes.number.isRequired,
    optionData: PropTypes.array,
    url: PropTypes.string.isRequired,
};

export default CategoryTabs;
