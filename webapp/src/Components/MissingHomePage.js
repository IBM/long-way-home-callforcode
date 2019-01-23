import React, { Component } from 'react';
import '../App.scss';
import {ProgressIndicator, ProgressStep, Accordion, AccordionItem, Button, Loading} from 'carbon-components-react';
import {loadMtcnnModel, loadFaceRecognitionModel} from 'face-api.js';

import MissingImgUploadBox from './MissingImgUploadBox';
import MissingContactInfo from './MissingContactInfo';
import ReviewPage from './ReviewPage';
import * as util from '../util';

const MissingProgress = (props) => {return (
  <ProgressIndicator currentIndex={props.currentStep}>
  <ProgressStep label="Add Picture" description="Step 1: Add an image of your loved one's face" />
  <ProgressStep label="Contact Info" description="Step 2: Add Information to contact you" />
  <ProgressStep label="Review & Upload" description="Step 3: Review your data and upload" />
</ProgressIndicator>
)}

export default class MissingHomePage extends Component{
  constructor(props) {
    super(props);
    this.state = {
      modelsLoaded: false,
      currentStep: 0,
      photoData: null,
      chosenFace: null,
      contactInfo: null,
      detectionResults: null
    };
  }

  postencoding = () => {
    let encoding = {
      encoding: Array.from(this.state.detectionResults[this.state.chosenFace].descriptor),
      contactInfo: this.state.contactInfo
    }
    fetch(
      'api/encoding',
      {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(encoding)
      }
    )
    .then((r) => {
      if(r.status === 200){
        r.json()
        .then( (j) =>{
          fetch(j.uploadUrl, {
            method: 'PUT',
            headers: {"Content-Type": "image/jpeg"},
            body: this.state.photoData
          })
          .then((r) => {
            if(r.status === 200)
              this.props.addNotification("Upload success", "", "", "success");
            else
              this.props.addNotification("Upload Failed", "", "", "error");
          });
        });
      }
    });
  }

  handleContactContinue = (event) => {
    event.preventDefault();
    let infoDict = {};
    for(let i=0; i<event.target.length; i++){
      if(infoDict[event.target[i].id])
        infoDict[event.target[i].id] = event.target[i].value
    }
    this.setState({contactInfo: infoDict, currentStep: 2})
  }

  handleAccordionClick = (index) => {
    this.setState(
      {currentStep: index}
    )
  }

  render(){
    return (
      <div>
        <p className="App-intro">
          Add a picture of your loved one.
        </p>
        <MissingProgress currentStep={this.state.currentStep}/>
        <Accordion>
        <AccordionItem title="Add Picture"
          open={this.state.currentStep === 0}
          onHeadingClick={() => this.handleAccordionClick(0)}
        >
          <p>
            Loading of NN models uses significant bandwidth. Use an appropriate connection.
          </p>
          <Button
            onClick={() => util.loadModels(this, this.props.addNotification)}
            onFocus={() => {}} className="some-class">
            Load Models
          </Button>
          {this.state.modelsLoding && <Loading small withOverlay={false} />}
          <MissingImgUploadBox
            modelsLoaded={this.state.modelsLoaded}
            addNotification={this.props.addNotification}
            handleContinue={(chosenFace, detectionResults, photoData) => {
              this.setState({
                chosenFace: chosenFace,
                detectionResults: detectionResults,
                photoData: photoData,
                currentStep: 1
              });
            }}
          />
        </AccordionItem>
        <AccordionItem
          title="Add Contact Info"
          open={this.state.currentStep === 1}
          onHeadingClick={() => this.handleAccordionClick(1)}
        >
          <MissingContactInfo
            handleContinue={this.handleContactContinue}
          />
        </AccordionItem>
        <AccordionItem
          title="Review & Upload"
          open={this.state.currentStep === 2}
          onHeadingClick={() => this.handleAccordionClick(2)}
        >
          <ReviewPage
            info={this.state.contactInfo}
            photo={this.state.photoData}
            handleUpload={() => {
              util.postencoding(
                {
                  encoding: Array.from(this.state.detectionResults[this.state.chosenFace].descriptor),
                  contactInfo: this.state.contactInfo
                },
                this.state.photoData,
                this.props.addNotification
              );
              this.setState({currentStep: 3});
              }}
          />
        </AccordionItem>
      </Accordion>
    </div>
    )
  }
}