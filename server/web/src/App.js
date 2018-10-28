import React, { Component } from 'react'
import { Route,Router } from 'react-router-dom'
import { HomePage } from './screen/homepage/index.js'
import CreateClassroom from './screen/createClassroom/index.js'
import SuccessCreateClass from './screen/successCreateClass/index.js'
import AddUser from './screen/addUser/index.js'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <Router basename={'/reactjs'}>
          <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomePage}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/createClassroom`} component={CreateClassroom}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/successCreateClass`} component={SuccessCreateClass}></Route>
          <Route exact path={`${process.env.PUBLIC_URL}/addUser`} component={AddUser}></Route>
        </Router>
      </div>
    );
  }
}

export default App;
