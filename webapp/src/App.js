import 'carbon-components/scss/globals/scss/styles.scss';

import React, { Component } from 'react';
import { ToastNotification} from 'carbon-components-react';
import './App.scss';
import logo_cfc from './images/logo__cfc-header.png';
import logo_ibm from './images/ibm_logo-300x130.png';
import MissingHomePage from './Components/MissingHomePage';
import FoundHomePage from './Components/FoundHomePage';
import ReviewHomePage from './Components/ReviewHomePage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        notifications: []
    };
}

  addNotification = (title, subtitle, message, type) => {
    this.setState((prev) => {
      let newNotifications = prev.notifications.slice();
      newNotifications.push(
        {title: title, subtitle: subtitle,
          message: message, kind: type, id: Math.floor(Date.now() / 1000)
        })
      return {notifications: newNotifications}
    })
  }



  render() {
    const notifications = this.state.notifications.map(
      (n) => {
        return <ToastNotification
        onCloseButtonClick={() => {this.setState((prev) => {
          return {
            notifications: prev.notifications.filter((t) => {return true ? t.id !== n.id : false})
          }
        })}}
        title={n.title}
        subtitle={n.subTitle}
        caption={n.message}
        style={{minWidth: "30rem", marginBottom: ".5rem"}}
        kind={n.kind}
        id={n.id}
        key={n.id}
      />
      }
    )
    const PAGES = {
      '/': <MissingHomePage addNotification={this.addNotification} />,
      '/ui': <MissingHomePage addNotification={this.addNotification} />,
      '/ui/ngo': <FoundHomePage addNotification={this.addNotification} />,
      '/ngo': <FoundHomePage addNotification={this.addNotification} />,
      '/review': <ReviewHomePage addNotification={this.addNotification} />
    };
    const Handler = PAGES[window.location.pathname];
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo_cfc} className="App-logo" alt="logo" />
            <img src={logo_ibm} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Long Way Home</h1>
          </header>
        </div>
        <article className="App__demo">
        {Handler}
        </article>
        {notifications}
      </div>
    )
  }
}

export default App;
