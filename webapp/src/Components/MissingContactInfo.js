import React, { Component } from 'react';
import {TextInput, Form, Button} from 'carbon-components-react';


export default class MissingContactInfo extends Component {

  render() {
    return (
      <Form onSubmit={this.props.handleContinue} action={() => {}}>
        <TextInput
          id="FullName"
          labelText="Your Full Name"
          placeholder="eg. John Smith"
          required
        />
        <TextInput
          id="Email"
          labelText="Your Prefered Email"
          placeholder="Please enter an email"
          type="email"
          required
        />
        <TextInput
          id="Number"
          labelText="Prefered Number"
          required
        />
        <TextInput
          id="NameOfMissingPerson"
          labelText="Full Name of Missing Person"
          required
        />
        <TextInput
          id="Relationship"
          labelText="Your Relationship to Missing person"
          required
        />
        <Button type="submit" className="some-class">
        Submit
        </Button>
      </Form>
    )
  }
}