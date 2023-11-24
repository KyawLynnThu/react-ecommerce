import { useState } from "react";
import { Form, Input, Button, Upload, Modal, Space } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import AnimatedLayout from "../../common/animated-layout";
import ImgCrop from "antd-img-crop";

const ProductEnglish = ({ form, fileList, handleFileChange, onSave }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const uploadButton = (
        <div>
            <CameraOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        );
    };

    const handleCancel = () => setPreviewOpen(false);

    return (
        <Form
            form={form}
            onFinish={onSave}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
        >
            <AnimatedLayout>
                <Form.Item
                    label="Product Name (English)"
                    name="productName"
                    rules={[
                        {
                            required: true,
                            message: "Please enter product name",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Product Description (English)"
                    name="productDescription"
                    rules={[
                        {
                            required: true,
                            message: "Please enter product description",
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
            </AnimatedLayout>
            <AnimatedLayout style={{ marginTop: 15 }}>
                <Form.Item label="Product Image">
                    <Space>
                        <Form.Item
                            name="productImage"
                            valuePropName="fileList"
                            getValueFromEvent={handleFileChange}
                        >
                            <Upload
                                onPreview={handlePreview}
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={() => false}
                                onChange={handleFileChange}
                                multiple
                            >
                                {fileList.length < 5 && uploadButton}
                            </Upload>
                        </Form.Item>

                        <Modal
                            open={previewOpen}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img
                                alt="example"
                                style={{
                                    width: "100%",
                                }}
                                src={previewImage}
                            />
                        </Modal>
                    </Space>
                </Form.Item>
            </AnimatedLayout>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProductEnglish;
