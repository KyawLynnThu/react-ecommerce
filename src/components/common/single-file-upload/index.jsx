import { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const SingleFileUpload = ({
    onFileChange,
    setErrorStatus,
    setMsg,
    buttonText,
    initialImageUrl,
}) => {
    // State to manage the list of uploaded files
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        // Check if the initialImageUrl is provided.
        if (initialImageUrl) {
            // If initialImageUrl is provided, set the fileList state with an array containing a single object.
            setFileList([
                {
                    uid: "-1", // Unique identifier for the file (in this case, set to "-1").
                    name: initialImageUrl.split("/").pop(), // Extract the file name from the URL.
                    status: "done", // Set the status of the file to "done" since it's preloaded.
                    url: initialImageUrl, // Set the URL of the file to the initialImageUrl.
                },
            ]);
        }
    }, [initialImageUrl]);

    // Function to handle file upload before processing
    const beforeUpload = (file) => {
        // List of accepted file formats
        const acceptedFormats = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/gif",
        ];

        // Check if the file format is accepted
        const isAcceptedFormat = acceptedFormats.includes(file.type);

        // Display an error message if the format is not accepted
        if (!isAcceptedFormat) {
            setErrorStatus(true);
            setMsg(
                `${file.name} is not a valid file format. Please upload a PNG, JPG, JPEG, or GIF file.`,
            );

            // Scroll to the top of the page for better visibility of the error
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }

        // Return false to prevent automatic upload of the file and ignore it in the file list
        return isAcceptedFormat ? false : Upload.LIST_IGNORE;
    };

    // Function to handle file changes
    const handleChange = ({ fileList }) => {
        // Update the state with the new file list
        setFileList(fileList);

        // Pass the fileList to the parent component or form
        onFileChange(fileList);
    };

    return (
        <div>
            {/* Upload component with specified configurations */}
            <Upload
                beforeUpload={beforeUpload}
                listType="picture"
                maxCount={1}
                accept="image/png, image/jpg, image/jpeg, image/gif"
                fileList={fileList}
                onChange={handleChange}
            >
                {/* Button trigger for file upload */}
                <Button icon={<UploadOutlined />}>{buttonText}</Button>
            </Upload>
        </div>
    );
};

// Prop types for the SingleFileUpload component
SingleFileUpload.propTypes = {
    onFileChange: PropTypes.func.isRequired,
    setErrorStatus: PropTypes.func.isRequired,
    setMsg: PropTypes.func.isRequired,
    buttonText: PropTypes.string.isRequired,
    initialImageUrl: PropTypes.string,
};

export default SingleFileUpload;
