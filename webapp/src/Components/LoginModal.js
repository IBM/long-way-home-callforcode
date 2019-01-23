import React, { Component } from 'react';
import {Select, SelectItem, TextInput} from 'carbon-components-react';
import Modal from 'carbon-components-react/lib/components/Modal';

export default class LoginModal extends Component{
    constructor(props) {
      super(props);
      this.state ={
        selectValue: null
      };
    }


    render(){
        return <Modal
        primaryButtonText="Login"
        secondaryButtonText="Cancel"
        handleSubmit={this.props.handleSubmit}
        open={this.props.open}
        onRequestSubmit={(e) => {
            this.props.onSubmit(this.state.selectValue)
        }}
        >
            <Select defaultValue="placeholder-item" onChange={(v) => {this.setState({selectValue: v.target.value})}}>
                <SelectItem
                    disabled
                    hidden
                    value="placeholder-item"
                    text="Select Your NGO"
                />
                <SelectItem value="bluecross" text="Blue Cross"/>
                <SelectItem value="redcross" text="Red Cross"/>
                <SelectItem value="browncross" text="Brown Cross"/>
                <SelectItem value="yellowcross" text="Yello Cross"/>
            </Select>
            <TextInput labelText="UserName:" required />
            <TextInput labelText="Password:" type="password" required />
        </Modal>
    }
}