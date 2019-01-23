import React, { Component } from 'react';
import {FileUploaderButton} from 'carbon-components-react';
import '../App.scss';

import FaceDetectionBox from './FaceDetectionBox'


export default class MissingImgUploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
        photo: null,
        results: null,
        chosenFace: null,
        detecting: true
    };
  }

  render(){
    return (
      <div>
        <FileUploaderButton 
          onChange={
            (event) => {
              this.setState({photo: URL.createObjectURL(event.target.files[0])});
            }
          }
          labelText="Upload from Device"
        />
        <FaceDetectionBox
          photo={this.state.photo}
          modelsLoaded={this.props.modelsLoaded}
          handleContinue={this.props.handleContinue}
          addNotification={this.props.addNotification}
        />
      </div>
    )
  }
}