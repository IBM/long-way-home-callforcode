import React, { Component } from 'react';
import {TileGroup, RadioTile} from 'carbon-components-react';
import '../App.scss';
import {drawDetection, drawLandmarks} from 'face-api.js';

export default class FaceSelect extends Component {

  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    let canvas = this.props.canvasRef;
    for(let i =0; i < this.props.results.length; i++){
      if (typeof(this.props.results[i]) !==  "undefined"){
      drawDetection(canvas, this.props.results[i].detection, {withScore: false});
      drawLandmarks(canvas, this.props.results[i].landmarks);
      }
      const resultCanvas = this.refs["faceCanvas" + i];
      if(resultCanvas){
        const ctx = resultCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          this.props.results[i].detection.box.x,
          this.props.results[i].detection.box.y,
          this.props.results[i].detection.box.width,
          this.props.results[i].detection.box.height, 0, 0,
          this.props.results[i].detection.box.width,
          this.props.results[i].detection.box.height
        );
      }
    }
  }

  render() {
    let tileList = this.props.results.map((r, i) => {
      return (
      <RadioTile
        value={i} 
        id={"tile-" + i} 
        key={"tile-" + i} 
      >
      <div>
        <div>Score : {this.props.results[i].detection.score}</div>
        <div><canvas ref={"faceCanvas" + i}/></div>
      </div>
      </RadioTile>)
    });
    if(tileList){
      return (
        <TileGroup
          onChange={(e) => {
            this.props.handleFaceSelect(e)
          }}
          name="tile-group"
          defaultSelected="default-selected"
          legend="Select The Correct Face"
        >
        {tileList}
    </TileGroup>
      )
    }
    return null;
  }
}