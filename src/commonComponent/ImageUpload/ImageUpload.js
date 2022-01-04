import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { uploadCamera } from '../../constants/PatientImages';
import Constants from '../../constants';
import { API } from '../../api/config/APIController';
import axios from 'axios';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const ImageUpload = ({ getImage, classname }) => {
    const uploadProfileImage = async (file) => {
        let photo = file;
        let bodyFormData = new FormData();
        if (photo !== undefined) {
            bodyFormData.append('file', file);
        }
        bodyFormData.append('type', 'profile');
        uploadImageWithData(API.FILEUPLOAD, bodyFormData)
            .then(response => {
                console.log('response: ', response);
            })
            .catch(error => {
                console.log('error: ', error);
            })
    }
    const uploadImageWithData = async (endPoint, formData) => {
        return new Promise(async (resolve, reject) => {
            axios({
                method: 'post',
                url: Constants.BASE_URL + endPoint,
                data: formData,
                headers: { 'Content-Type': undefined, }
            })
                .then(response => {
                    this.props.getImage(response.data.data.url)
                    resolve(response.data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
    const props = {
        name: 'file',
        action: `${process.env.REACT_APP_BASE_URL}fileUpload`,
        data: { type: "profile" },
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                getImage(info.file.response.data.url)
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
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