import React, { Component } from 'react';
import {Button, Loading, Tile} from 'carbon-components-react';
import '../App.scss';
import {allFacesMtcnn, drawDetection, drawLandmarks, } from 'face-api.js';


import FaceSelect from './FaceSelect';

const IMAGE_DIMS = {width: 300, height: 300}


export default class FaceDetectionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
        results: null,
        chosenFace: null,
        detecting: false
    };
  }

  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }

  detectFaces = async () => {
    this.setState({detecting: true}, () => {
      const minConfidence = 0.99;
      allFacesMtcnn(this.refs.canvas, minConfidence)
      .then((result) => {
        this.setState({results: result, detecting: false});
        },
        (e) => {
          this.props.addNotification("Error", "Failed to Detect Faces", "", "error");
          this.setState({detecting: false});
        }
      );
    })
  }

  updateCanvas() {
    if(this.refs.canvas){
      const canvas  = this.refs.canvas
      const ctx = this.refs.canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        let height = img.height;
        let width = img.width;
        if(height > width){
          width = IMAGE_DIMS.width * width / height;
          height = IMAGE_DIMS.height;
        }else{
          height = IMAGE_DIMS.height * height / width;
          width = IMAGE_DIMS.width;
        }
        ctx.width = width;
        ctx.height = height;
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
        if (typeof(this.state.results) !==  "undefined" && this.state.results !== null) {
          for(let i =0; i < this.state.results.length; i++){
            if (typeof(this.state.results[i]) !==  "undefined"){
            drawDetection(canvas, this.state.results[i].detection, {withScore: false});
            drawLandmarks(canvas, this.state.results[i].landmarks);
            }
          }
        }
      };
      img.src = this.props.photo;    
    }
  } 

  render() {
    if(this.props.photo)
      return (
        <div>
        <Tile>
          <canvas ref="canvas" src={this.props.photo} width={IMAGE_DIMS.width} height={IMAGE_DIMS.height}/>
          <Button 
            onClick={this.detectFaces}
            disabled={(!this.props.modelsLoaded || this.state.detecting)}>
          Detect Faces
          </Button>
          {this.state.detecting && <Loading small withOverlay={false} />}
        </Tile>
        { this.state.results !== null && (
        <FaceSelect
          results={this.state.results}
          canvasRef={this.refs.canvas}
          handleFaceSelect={(f) => {this.setState({chosenFace: f})}}
        />)}
        <Button
          onClick={() => {
            this.refs.canvas.toBlob( (data) => {
            this.props.handleContinue(this.state.chosenFace, this.state.results, data);
            }, 'image/jpeg', 0.95);
          }}
          disabled={this.state.detecting || this.state.chosenFace == null}  
        >
          Continue
        </Button>
        </div>
      )
    else
      return null
  }
}