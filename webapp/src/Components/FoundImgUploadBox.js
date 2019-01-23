import React, { Component } from 'react';
import {Button, Tile} from 'carbon-components-react';
import '../App.scss';
import Webcam from 'react-webcam';

import FaceDetectionBox from './FaceDetectionBox'

const IMAGE_DIMS = {width: 300, height: 300}


export default class FoundImgUploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
        photo: null,
        results: null,
        chosenFace: null,
        detecting: true
    };
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  render(){
    const videoConstraints = {
      width: IMAGE_DIMS.width,
      height: IMAGE_DIMS.height,
      facingMode: 'user',
    };
    let videoBox = <Button onClick={() => {this.setState({photo: null})}}>Retake</Button>
    if(this.state.photo === null){
      videoBox = (
      <Tile>
        <Webcam 
         audio={false} screenshotFormat="image/png" 
         ref={this.setRef} 
         videoConstraints={videoConstraints}
         width={IMAGE_DIMS.width}
         height={IMAGE_DIMS.height}/>
        <Button 
          onClick={() => {this.setState({photo: this.webcam.getScreenshot()})}}>
          Take Photo
        </Button>
      </Tile>
      )
    }

    return (
      <div>
        {videoBox}
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