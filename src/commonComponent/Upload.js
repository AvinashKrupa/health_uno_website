import 'rc-cropping/assets/index.css';
import CropViewer from 'rc-cropping';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import Upload from 'rc-upload';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { API } from '../api/config/APIController';
import axios from 'axios';
import Constants from '../constants';

class UploadImage extends Component {
  beforeUpload(file) {
    const cropper = this.cropper;
    console.log('>> cropper', this.cropper);
    return cropper.selectImage(file).then(image => {
      console.log('>> selecTImage', image);
      return image;
    });
  }

onChange = (Blob) => {
    console.log('Blob: ', Blob);
    this.uploadProfileImage(Blob)

}
 uploadProfileImage(file) { 
     console.log('file: ', file);
    let photo = file;
    let bodyFormData = new FormData(); 
    if (photo !== undefined) {
        bodyFormData.append('file', file);
    } 
    bodyFormData.append('type', 'profile');
    this.uploadImageWithData(API.FILEUPLOAD, bodyFormData)
    .then(response => {
         console.log('response: ', response); 
    })
    .catch(error => {
         console.log('error: ', error); 
    })
}
  uploadImageWithData(endPoint, formData) {
      console.log('endPoint: ', endPoint);
    return new Promise(async (resolve, reject) => { 
    axios({
        method: 'post',
        url: Constants.BASE_URL + endPoint, data: formData,
        headers: { 'Content-Type': undefined, }
     })
    .then(response => { 
        console.log('uploadImageWithData: ', response);
        resolve(response.data); 
    }).catch(err => { 
        reject(err);
     }); 
    });
}


  render() {
    return (<div>
      <Upload type="drag" beforeUpload={this.beforeUpload} ><a>Upload Image</a></Upload>
      <CropViewer
        onChange={this.onChange}
        getSpinContent={() => <span>loading...</span> }
        renderModal={() => <Dialog />}
        locale="en"
        ref={ele => this.cropper = ele}
        circle
      />
    </div>);
  }
}

export default UploadImage;