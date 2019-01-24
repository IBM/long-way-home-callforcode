import React, { Component } from 'react';
import '../App.scss';
import {ProgressIndicator, ProgressStep, Accordion, AccordionItem, Button, Loading} from 'carbon-components-react';
import * as util from '../util';
import FoundImgUploadBox from './FoundImgUploadBox';
import FoundInfo from './FoundInfo';
import ReviewPage from './ReviewPage';
import LoginModal from './LoginModal';

const FoundProgress = (props) => {return (
  <ProgressIndicator currentIndex={props.currentStep}>
  <ProgressStep label="Add Picture" description="Step 1: Add an image of the individual" />
  <ProgressStep label="Info" description="Step 2: Add Information about where you found them" />
  <ProgressStep label="Review & Upload" description="Step 3: Review your data and upload" />
</ProgressIndicator>
)}

export default class FoundHomePage extends Component{

  constructor(props) {
    super(props);
    this.state = {
      modelsLoaded: false,
      currentStep: 0,
      photoData: null,
      chosenFace: null,
      contactInfo: null,
      detectionResults: null,
      ngo: null
    };
  }

  handleContactContinue = (event) => {
    event.preventDefault();
    let infoDict = {};
    for(let i=0; i<event.target.length; i++){
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
    return(
    <div>
      <LoginModal open={this.state.ngo === null} onSubmit={(id) => {this.setState({ngo: id})}}/>
      {this.state.ngo &&
      <div>
      <p className="App-intro">
        Add a picture of the found individual.
      </p>
      <FoundProgress currentStep={this.state.currentStep}/>
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
          onFocus={() => {}}
        >
          Load Models
        </Button>
        {this.state.modelsLoding && <Loading small withOverlay={false} />}
        <FoundImgUploadBox
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
        <FoundInfo
          handleContinue={this.handleContactContinue}
        />
      </AccordionItem>
      <AccordionItem
        title="Review & Upload"
        open={this.state.currentStep === 2}
        onHeadingClick={() => this.handleAccordionClick(2)}
      >
      {this.state.detectionResults !== null && (
        <ReviewPage
          info={this.state.contactInfo}
          photo={this.state.photoData}
          handleUpload={() => {
            util.postencoding(
              {
                encoding: Array.from(this.state.detectionResults[this.state.chosenFace].descriptor),
                contactInfo: this.state.contactInfo,
                ngo: this.state.ngo,
                missing: false
              },
              this.state.photoData,
              this.props.addNotification
            );
            this.setState({currentStep: 3});
            }}
        />
      )}
      </AccordionItem>
    </Accordion>
    </div>}
  </div>
    )

  }

}
