import React, { Component } from 'react';
import '../App.scss';
import ReviewSearchPage from './ReviewSearchPage';
import {Tile, Button} from 'carbon-components-react';
import EncodingDisplay from './EncodingDisplay';
import LoginModal from './LoginModal';

export default class ReviewHomePage extends Component{
    constructor(props) {
      super(props);
      this.state = {
        encodings: [],
        openEncoding: null,
        missingEncodings: [],
        ngo: null
      };
    }

    getNGOEncodings = (ngo) => {
        fetch('api/encoding/byngo?ngo=' + ngo)
        .then((r) => {
          if(r.status === 200){
            r.json().then((j) => this.setState({encodings: j}));
          }
        },(e) => {
          this.addNotification('Error', '', e, 'error');
        });
        fetch('api/encoding/missing')
        .then((r) => {
            if(r.status === 200){
                r.json().then((j) => this.setState({missingEncodings: j}));
            }
        },(e) => {
            this.addNotification('Error', '', e, 'error');
        });
      }

    render(){
        let myEncodings = this.state.encodings.map((e, i) => {
            return <Tile key={i}>
                <EncodingDisplay encoding={e}/>
                <Button onClick={() => {this.setState({openEncoding: i})}}>Find Matches</Button>
                {i == this.state.openEncoding && (
                    <ReviewSearchPage result={e} encodings={this.state.missingEncodings}/>
                )}
            </Tile>
        });
        return (
        <div>
            <LoginModal open={this.state.ngo === null} onSubmit={(id) => {this.setState({ngo: id}, this.getNGOEncodings(id))}}/>
            { this.state.ngo && <div>
            {myEncodings}
            </div>}
        </div>
        )
    }

}