import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HomePage } from './screen/homepage/index.js'
import CreateClassroom from './screen/createClassroom/index.js'
import SuccessCreateClass from './screen/successCreateClass/index.js'
import AddUser from './screen/addUser/index.js'
import MakeAnnounce from './screen/makeAnnounce/index.js'
import AnnounceSuccess from './screen/makeAnnounce/success.js'
import UploadLN from './screen/uploadLectureNote/index.js'
import UploadLNSuccess from './screen/uploadLectureNote/success.js'



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
        <Route exact path="/" component={HomePage}></Route>
        <Route exact path="/createClassroom" component={CreateClassroom}></Route>
        <Route exact path="/successCreateClass" component={SuccessCreateClass}></Route>
        <Route exact path="/addUser" component={AddUser}></Route>
        <Route exact path="/makeAnnounce" component={MakeAnnounce}></Route>
        <Route exact path="/makeAnnounceSuccess" component={AnnounceSuccess}></Route>
        <Route exact path="/UploadLN" component={UploadLN}></Route>
        <Route exact path="/UploadLNSuccess" component={UploadLNSuccess}></Route>
      </div>
    );
  }
}

export default App;
