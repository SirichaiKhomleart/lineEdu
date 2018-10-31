import React, { Component } from 'react'
import logo from '../../asset/lineLOGO.jpg'
import { getAllClassroom } from '../../mongoDBFunction'

const liff = window.liff

export class HomePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayName : '',
      userId : '',
      pictureUrl : '',
      statusMessage : '',
      class: {}
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  async componentDidMount () {
    window.addEventListener('load', this.initialize);
    let data = await getAllClassroom()
    this.setState({
      class: data
    })
    console.log(this.state.class)
  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile()
      this.setState({
        displayName: profile.displayName,
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage
      })
    })
  }

  closeApp(event) {
    event.preventDefault()
    liff.sendMessages([{
      type: 'text',
      text: 'Thank you, Bye!'
    }]).then(() => {
      liff.closeWindow()
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <p className="App-intro" style={{marginTop: '50px'}}>
          Welcome and Testing Liff
        </p>
        <button color="primary" onClick={this.closeApp}>Close</button>
      </div>
    );
  }
}
