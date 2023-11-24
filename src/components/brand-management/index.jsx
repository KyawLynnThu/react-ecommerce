import { Fragment, useState, useEffect } from "react";
import BrandList from "./list/index";
import { Form, Button, Input, Alert } from "antd";
import AnimatedLayout from "../common/animated-layout";
import SingleFileUpload from "../common/single-file-upload";
import { useTranslation } from "react-i18next";
import endpoints from "../../config/api/endpoints";
import { useCommonApiMutation } from "../../config/api";

const Registration = () => {
    const { t: f } = useTranslation("form");
    const [form] = Form.useForm();
    const [updateData, setUpdateData] = useState();
    const [msg, setMsg] = useState("");
    const [fileList, setFileList] = useState([]);
    const [errorStatus, setErrorStatus] = useState(false);
    const [commonApi] = useCommonApiMutation();
    const [brandInitialImage, setBrandInitialImage] = useState(null);

    useEffect(() => {
        form.setFieldsValue({
            brandName: updateData?.brandName,
        });
        setBrandInitialImage(updateData?.brandImageUrl);
    }, [updateData, form]);

    const onFinish = async (values) => {
        const formData = new FormData();

        for (const key in values) {
            formData.append(key, values[key]);
        }

        if (fileList && fileList.length > 0) {
            const imgFile = fileList[0].originFileObj;
            formData.append("brand_image", imgFile);
        }

        const reqData = {
            endpoint: updateData
                ? `${endpoints.brandEndpoint}/${updateData?.id}`
                : `${endpoints.brandEndpoint}`,
            method: updateData ? "PUT" : "POST",
            body: formData,
        };

        try {
            const response = await commonApi(reqData);

            setErrorStatus(!response.data.isSuccess);
            setMsg(response.data?.message);

            if (response.data.isSuccess) {
                form.resetFields();
                setFileList([]);
                setBrandInitialImage(null);
                setUpdateData("");
            }
        } catch (error) {
            setErrorStatus(true);
            setMsg(error.message || "An Error Occurred");
        }
    };

    const handleFileChange = (fileList) => {
        setMsg("");
        setFileList(fileList);
    };

    return (
        <AnimatedLayout>
            <Fragment>
                {msg && (
                    <Alert
                        message={msg}
                        type={errorStatus ? "error" : "success"}
                        closable
                        onClose={() => setMsg("")}
                        style={{ marginBottom: 30 }}
                    />
                )}
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelCol={{ sm: { span: 9 }, md: { span: 6 } }}
                    wrapperCol={{ span: 12 }}
                >
                    <Form.Item
                        label={f("brand-name")}
                        name="brandName"
                        rules={[
                            {
                                required: true,
                                message: "Brand Name required!",
                            },
                            {
                                max: 255,
                                message:
                                    "Brand Name field cannot exceed 255 characters.",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label={f("brand-image")} name="brand_image">
                        <SingleFileUpload
                            initialImageUrl={brandInitialImage}
                            setErrorStatus={setErrorStatus}
                            onFileChange={handleFileChange}
                            buttonText={f("click-to-upload")}
                            setMsg={setMsg}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginTop: 20 }}
                        >
                            {updateData ? f("update") : f("save")}
                        </Button>
                    </Form.Item>
                </Form>
                <hr />
                <BrandList
                    setErrorStatus={setErrorStatus}
                    setMsg={setMsg}
                    setUpdateData={setUpdateData}
                />
            </Fragment>
        </AnimatedLayout>
    );
};

export default Registration;
