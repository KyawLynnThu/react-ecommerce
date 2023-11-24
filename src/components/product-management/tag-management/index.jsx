import { Button, Form, Input, Alert, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import endpoints from "../../../config/api/endpoints";
import { useCommonApiMutation } from "../../../config/api";
import TagList from "./list";
import { useTranslation } from "react-i18next";
import AnimatedLayout from "../../common/animated-layout";

const TagManagement = () => {
    const [form] = Form.useForm();
    const [msg, setMsg] = useState("");
    const [updateData, setUpdateData] = useState("");
    const [errorStatus, setErrorStatus] = useState(false);
    const [commonApi] = useCommonApiMutation();
    const { t } = useTranslation("form");

    useEffect(() => {
        form.setFieldsValue({
            tagName: updateData?.tagName,
        });
    }, [updateData, form]);

    const onFinish = async (values) => {
        const reqData = {
            endpoint: updateData
                ? `${endpoints.tagEndpoint}/${updateData?.key}`
                : endpoints.tagEndpoint,
            method: updateData ? "PUT" : "POST",
            body: values,
        };

        try {
            const response = await commonApi(reqData);

            const responseData = response?.data;

            const { isSuccess, message } = responseData;

            setErrorStatus(!isSuccess);
            setMsg(message);

            if (isSuccess) {
                form.resetFields();
                setUpdateData("");
            }
        } catch (error) {
            setErrorStatus(true);
            setMsg(error.message || "An Error Occurred");
        }
    };
    return (
        <AnimatedLayout>
            <Fragment>
                {msg && (
                    <Alert
                        message={msg}
                        type={errorStatus ? "error" : "success"}
                        onClose={() => setMsg("")}
                        closable
                        style={{ marginBottom: 30 }}
                    />
                )}
                <Typography.Title level={2}>
                    {t("tag-management")}
                </Typography.Title>
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelCol={{ sm: { span: 9 }, md: { span: 6 } }}
                    wrapperCol={{ span: 12 }}
                >
                    <Form.Item
                        label={t("tag-name")}
                        name="tagName"
                        rules={[
                            {
                                required: true,
                                message: "Tag Name required!",
                            },
                            {
                                max: 255,
                                message:
                                    "Tag Name field cannot exceed 255 characters.",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginTop: 20 }}
                        >
                            {updateData ? t("update") : t("save")}
                        </Button>
                    </Form.Item>
                </Form>
                <hr />
                <TagList
                    setErrorStatus={setErrorStatus}
                    setMsg={setMsg}
                    setUpdateData={setUpdateData}
                />
            </Fragment>
        </AnimatedLayout>
    );
};

export default TagManagement;
