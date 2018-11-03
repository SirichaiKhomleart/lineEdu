import React, { Component } from 'react'
import logo from '../../asset/lineLOGO.jpg'
import { getAllClassroom } from '../../mongoDBFunction'

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
  }

  async componentDidMount () {
    let data = await getAllClassroom()
    this.setState({
      class: data
    })
    console.log(this.state.class)
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
