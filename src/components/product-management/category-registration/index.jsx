import { Fragment, useState, useEffect } from "react";
import AnimatedLayout from "../../common/animated-layout";
import {
    Form,
    Input,
    InputNumber,
    Button,
    Typography,
    Alert,
    Radio,
} from "antd";
import { useTranslation } from "react-i18next";
import { useCommonApiMutation } from "../../../config/api";
import endpoints from "../../../config/api/endpoints";
import { useLocation } from "react-router-dom";
import SingleFileUpload from "../../common/single-file-upload";

const CategoryRegistration = () => {
    // Hooks for state management
    const { t: s } = useTranslation("sidebar");
    const { t: f } = useTranslation("form");
    const [errorStatus, setErrorStatus] = useState(false);
    const [msg, setMsg] = useState("");
    const [fileList, setFileList] = useState([]);

    // Hooks for location
    const { state } = useLocation();

    const statusOptions = [
        { value: true, label: "Enable" },
        { value: false, label: "Disable" },
    ];

    // API mutation hook
    const [commonApi, { isLoading }] = useCommonApiMutation();
    const [form] = Form.useForm();

    // Form initial values
    const initialValues = {
        categoryName_en: "",
        categoryName_mm: "",
        categoryName_zh: "",
        status: true,
        sort: 1,
    };

    // Destructure editData from state if it exists
    const {
        id,
        categoryName_en,
        categoryName_mm,
        categoryName_zh,
        sort,
        status,
        categoryImageUrl,
    } = state?.editData || {};

    // State to manage edited data
    const [editData, setEditData] = useState({
        id,
        categoryName_en,
        categoryName_mm,
        categoryName_zh,
        sort,
        status,
        categoryImageUrl,
    });

    useEffect(() => {
        // Set form fields value when id exists
        if (id) {
            form.setFieldsValue({
                categoryName_en,
                categoryName_mm,
                categoryName_zh,
                status,
                sort,
            });
        }
    }, [id]);

    // Handles form submission
    const onFinish = async (values) => {
        // Create FormData to handle file uploads
        const formData = new FormData();

        // Loop through values and append them to FormData
        for (const key in values) {
            formData.append(key, values[key]);
        }

        // If there is a file selected, append it to FormData
        if (fileList && fileList.length > 0) {
            const imgFile = fileList[0].originFileObj;
            formData.append("category_icon", imgFile);
        }

        let endpoint = endpoints.categoriesEndpoint;
        let method = "POST";

        if (editData.id) {
            // If id exists, append it to the URL and change method
            endpoint += `/${editData.id}`;
            method = "PUT";
        }

        // Define API request data
        const reqData = {
            endpoint,
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
                setEditData({});
            }
        } catch (error) {
            // Handle API request error
            const errorMessage = error.message || "An error occurred.";
            setErrorStatus(true);
            setMsg(errorMessage);
        }
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
        <AnimatedLayout>
            <Fragment>
                {/* Page Title */}
                <Typography.Title
                    style={{ marginTop: 0, marginBottom: 40 }}
                    level={2}
                >
                    {/* {s("category-registration")} */}
                    Testing Category
                </Typography.Title>

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

                {/* Category Registration Form */}
                <Form
                    form={form}
                    initialValues={initialValues}
                    name="category-registration"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ sm: { span: 9 }, md: { span: 6 } }}
                    wrapperCol={{ span: 12 }}
                >
                    {/* Category Name (English) */}
                    <Form.Item
                        label={f("category-name-en")}
                        name="categoryName_en"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the category name!",
                            },
                            {
                                pattern: /^[A-Za-z\s]+$/, // Allow only English letters and spaces
                                message:
                                    "Please enter valid English characters!",
                            },
                        ]}
                    >
                        <Input maxLength={255} />
                    </Form.Item>

                    {/* Category Name (Myanmar) */}
                    <Form.Item
                        label={f("category-name-mm")}
                        name="categoryName_mm"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter the category name in Myanmar!",
                            },
                            {
                                pattern: /^[\u1000-\u109F\s]+$/, // Allow only Myanmar characters and spaces
                                message:
                                    "Please enter valid Myanmar characters!",
                            },
                        ]}
                    >
                        <Input maxLength={255} />
                    </Form.Item>

                    {/* Category Name (Chinese) */}
                    <Form.Item
                        label={f("category-name-zh")}
                        name="categoryName_zh"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please enter the category name in Chinese!",
                            },
                            {
                                pattern: /^[\u4e00-\u9fa5]{0,}$/, // Allow only English letters and spaces
                                message:
                                    "Please enter valid Chinese characters!",
                            },
                        ]}
                    >
                        <Input maxLength={255} />
                    </Form.Item>

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
                    <Form.Item
                        label={f("category-image")}
                        name="category-image"
                    >
                        <SingleFileUpload
                            setMsg={setMsg}
                            onFileChange={handleFileChange}
                            setErrorStatus={setErrorStatus}
                            buttonText={f("click-to-upload")}
                            initialImageUrl={editData.categoryImageUrl}
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
                            {editData.id ? f("update") : f("save")}
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        </AnimatedLayout>
    );
};

export default CategoryRegistration;
