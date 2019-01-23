import React, { Component } from 'react';
import {Tile, Button} from 'carbon-components-react';
import '../App.scss';


export default class MissingReviewPage extends Component{
  render(){
    let imageUrl = null;
    if(this.props.photo !== null)
      imageUrl = window.URL.createObjectURL(this.props.photo);
    let info = [];
    if(this.props.info !== null){
      for(let k in this.props.info){
        info.push(<p key={k}>{k} : {this.props.info[k]}</p>)
      }
    }
    return (
      <Tile>
        <h2>Info:</h2>
        {info}
        <img src= {imageUrl} />
        <Button
          onClick={this.props.handleUpload}
        >
          Upload
        </Button>
      </Tile>
    )
  }
}