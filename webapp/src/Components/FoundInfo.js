import React, { Component } from 'react';
import {TextInput, Form, Button} from 'carbon-components-react';


export default class FoundInfo extends Component {

  render() {
    return (
      <Form onSubmit={this.props.handleContinue}>
        <TextInput
          id="FullName"
          labelText="Victims Name"
          placeholder="eg. John Smith"
          required
        />
        <TextInput
          id="Found"
          labelText="Location found"
          required
        />
        <TextInput
          id="CurrentLocation"
          labelText="Current Location"
          required
        />
        <TextInput
          id="Age"
          labelText="Approximate Age"
          required
        />
        <Button type="submit" className="some-class">
        Submit
        </Button>
      </Form>
    )
  }
}