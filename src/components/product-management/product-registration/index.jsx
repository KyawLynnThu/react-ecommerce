import React, { useState } from "react";
import { Tabs, Button, message, Form } from "antd";
// import TwoComponent from "./TwoComponent";
// import ThreeComponent from "./ThreeComponent";
import { useCommonApiMutation } from "../../../config/api";
import ProductEnglish from "./product-english";
import { Fragment } from "react";
import AnimatedLayout from "../../common/animated-layout";

const { TabPane } = Tabs;

const ProductRegistration = () => {
    const [formOne] = Form.useForm();
    const [formTwo] = Form.useForm();
    const [formThree] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [cropImage, setCropImage] = useState(null);

    const [commonApi] = useCommonApiMutation();

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleCropChange = (file) => {
        setCropImage(file);
    };

    const saveProduct = async (values, language) => {
        try {
            // Add any language-specific fields to the values object
            const payload = {
                ...values,
                language, // assuming language is a field indicating the language of the form
            };

            // Add any logic for handling file uploads
            const formData = new FormData();
            fileList.forEach((file, index) => {
                formData.append(`image${index}`, file);
            });

            // Add any language-specific endpoint or headers
            const response = await commonApi(payload, formData);

            if (response.data.isSuccess) {
                message.success(response.data.message);
                // Reset the form and file list
                language === "en" && formOne.resetFields();
                language === "mm" && formTwo.resetFields();
                language === "zh" && formThree.resetFields();
                setFileList([]);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error("Error saving product:", error);
            message.error("Error saving product. Please try again.");
        }
    };

    const items = [
        {
            key: 1,
            label: "English",
            children: (
                <ProductEnglish
                    form={formOne}
                    fileList={fileList}
                    handleFileChange={handleFileChange}
                    onSave={() => saveProduct(formOne.getFieldsValue(), "en")}
                />
            ),
        },
        {
            key: 2,
            label: "Myanmar",
            children: (
                <ProductEnglish
                    form={formOne}
                    fileList={fileList}
                    handleFileChange={handleFileChange}
                    handleCropChange={handleCropChange}
                    cropImage={cropImage}
                    onSave={() => saveProduct(formOne.getFieldsValue(), "en")}
                />
            ),
        },
    ];

    return (
        <Fragment>
            <Tabs defaultActiveKey={"1"} items={items} onChange={() => {}} />
        </Fragment>
    );
};

export default ProductRegistration;
