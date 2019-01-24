import React, { Component } from 'react';

export default class EncodingDisplay extends Component{

    render(){
        let encoding = this.props.encoding;
        let info = [];
        if(encoding.contactInfo !== null){
          for(let k in encoding.contactInfo){
            info.push(<p key={k}>{k} : {encoding.contactInfo[k]}</p>)
          }
        }
        return <div>
            <div>
                <img src={encoding.src}/>
          </div>
          <div>{info}</div>
        </div>
    }
}