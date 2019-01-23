import React, { Component } from 'react';
import '../App.scss';
import {Tile, Button} from 'carbon-components-react';
import {euclideanDistance} from 'face-api.js';
import EncodingDisplay from './EncodingDisplay';

export default class ReviewSearchPage extends Component{

  constructor(props) {
    super(props);
    this.state = {
      matches: []
    };
  }

  componentDidMount(){
    this.searchEncodings();
  }

  searchEncodings = () => {
    this.setState({matches: []});
    this.props.encodings.forEach((enc) => {
      const encoding = new Float32Array(enc.encoding);
      const dist = euclideanDistance(
        this.props.result.encoding,
        encoding
      );
      if(dist < 0.8){
        this.setState((prev) => {
          const newMatches = prev.matches.slice();
          enc.dist = dist;
          newMatches.push(enc);
          return {matches: newMatches}
        })
      }
    }, this);
  }

  render(){
    const matches = this.state.matches.sort(
      (a, b) => {
        return a.dist < b.dist ? -1 : a.dist > b.dist ? 1 : 0}
      ).map((m, i) => {
      return (
        <Tile key={i}>
        <div>
          <div>
            Rank: #{i+1} <br/>
            Score: {m.dist} <br/>
            Id: {m.id} <br/>
          </div>
          <EncodingDisplay encoding={m}/>
          </div>
        </Tile>
      )
    });
    return (
      <div>
        {matches}
      </div>
    )
  }
}