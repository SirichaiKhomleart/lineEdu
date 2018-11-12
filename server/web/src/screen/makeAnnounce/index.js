import React, { Component } from 'react'
import { announceMsg } from '../../messageFunction/announce'
import { Body, Header2 } from '../../style'
import Grid from '@material-ui/core/Grid';
import InputMessageTab from './inputMessageTab'
import SelectClassTab from './selectClassTab';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { getUserByUserID,getClassById } from '../../mongoDBFunction'

const liff = window.liff

class MakeAnnounce extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: "",
      userFullName: "",
      tab: "input",
      selectedClass: [],
      selectedClassName: [],
      message: "",
      allClassList: [],
      noti: false
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  async componentDidMount () {
    await window.addEventListener('load', this.initialize);
    let user = await getUserByUserID({userId: this.state.userId});
    if (this.state.userId === "") {
      user = await getUserByUserID({userId: "Ubab717ae1162a07a32154640a5f4f1e8"});
    }
    let allClassList = await Promise.all(user.userCoClassList.map(async (data) => {
      let result = await getClassById(data);
      return {
        classId: data,
        className: result.className
      }
    }))
    this.setState({
      allClassList: allClassList,
      userFullName: user.userFullName
    })
    
    console.log("user",user);
    console.log("allClassList",allClassList);
  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile();
      this.setState({
        userId: profile.userId
      })
    })
  }

  closeApp(event) {
    event.preventDefault()
    liff.closeWindow()
  }

  renderTab = () => {
    let { tab,allClassList,selectedClass,message,selectedClassName } = this.state
    if (tab === "input") {
      return (
        <InputMessageTab 
          changeTabFunc={this.changeTab}
          changeMshFunc={this.handleMsgChange}
          message={message}
          submitFunc={this.submitForm}
          closeAppFunc={this.closeApp}
          selectedClassName={selectedClassName}
        />
      )
    } else {
      return (
        <SelectClassTab 
          selectClassFunc={this.selectClass}
          selectedClass={selectedClass}
          allClassList={allClassList}
          changeTabFunc={this.changeTab}
        />
      )
    }
    
  };

  changeTab = (tab) => {
    this.setState({
      tab: tab,
    });
  };

  selectClass = (classId,className) => {
    let { selectedClass,selectedClassName } = this.state
    let index = selectedClass.indexOf(classId);
    if (index === -1) {
      this.setState({
        selectedClass: [...selectedClass,classId],
        selectedClassName: [...selectedClassName,className],
      });
    } else {
      selectedClass.splice( index, 1 );
      selectedClassName.splice( index, 1 );
      this.setState({
        selectedClass: selectedClass,
        selectedClassName: selectedClassName
      });
    }
  };

  handleMsgChange = (event) => {
    this.setState({
        message: event.target.value,
    });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ noti: false });
  };

  submitForm =  async (values, pristineValues) => {
    let { selectedClass,message,userId,userFullName,selectedClassName } = this.state
    if (selectedClass.length === 0) {
      this.setState({
        noti: true
      })
    } else {
      let sendedData = {
        selectedClass: selectedClass,
        selectedClassName: selectedClassName,
        message: message,
        sender: userFullName,
        senderId: userId
      }
      console.log(selectedClassName);
      let data = await announceMsg(sendedData);
      console.log(data);
      this.props.history.push({
        pathname: '/makeAnnounceSuccess'
      })
    }
  }

  render() {
    return (
      <Body>
        <Grid item xs={12}>
          <Header2> Make Announcements </Header2>
            { this.renderTab() }
        </Grid>
        {/* <SnackbarContent
          message={
            "You still don't choose any classroom to announce."
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.noti}
          autoHideDuration={4000}
          onRequestClose={this.handleClose}
          ref = 'snackbar'
        /> */}
      </Body>
    );
  }
}

export default MakeAnnounce;
