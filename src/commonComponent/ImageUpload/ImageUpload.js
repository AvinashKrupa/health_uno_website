import React from "react";
import ImgCrop from "antd-img-crop";
import { uploadCamera } from "../../constants/PatientImages";
import { Upload, message } from "antd";
import 'antd/dist/antd.css';

const ImageUpload = ({ getImage, classname }) => {
  const props = {
    name: "file",
    action: `${process.env.REACT_APP_BASE_URL}fileUpload`,
    data: { type: "profile" },
    headers: {
      authorization: "authorization-text",
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        getImage(info.file.response.data.url);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className={classname}>
      <ImgCrop rotate>
        <Upload {...props}>
          <img alt="img" src={uploadCamera} />
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default ImageUpload;
