import 'rc-cropping/assets/index.css';
import CropViewer from 'rc-cropping';
import React, { Component } from 'react';
import { API } from '../api/config/APIController';
import axios from 'axios';
import Constants from '../constants';
import { Image } from 'react-bootstrap';
import {uploadCamera} from '../constants/PatientImages';
import { Modal } from 'antd';
import 'antd/dist/antd.css';

class UploadImage extends Component {
  beforeUpload(file) {
    const cropper = this.cropper;
    return cropper.selectImage(file).then(image => {
      return image;
    });
  }

  onChange = (Blob) => {
    this.uploadProfileImage(Blob)
  }

  uploadProfileImage(file) {
    let photo = file;
    let bodyFormData = new FormData();
    if (photo !== undefined) {
      bodyFormData.append('file', file);
    }
    bodyFormData.append('type', 'profile');
    this.uploadImageWithData(API.FILEUPLOAD, bodyFormData)
      .then(response => {
      })
      .catch(error => {
      })
  }
  uploadImageWithData(endPoint, formData) {
    return new Promise(async (resolve, reject) => {
      axios({
        method: 'post',
        url: Constants.BASE_URL + endPoint, data: formData,
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


  render() {
    return (<div>
      <CropViewer
        resetPreviewAfterSelectImage={true}
        onChange={this.onChange}        
        getSpinContent={() => <span></span>}
        renderModal={() => <Modal />}
        circle
        locale="en-US"
        fileType="image/jpeg"
        showSelected={false}
        accept="image/gif,image/jpeg,image/png,image/bmp,image/x-png,image/pjpeg"
      ><Image className={this.props?.className ? this.props?.className : 'fa-camera '} src={uploadCamera}></Image></CropViewer>
    </div>);
  }
}

export default UploadImage;