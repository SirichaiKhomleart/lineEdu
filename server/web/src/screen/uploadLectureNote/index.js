import React, { Component } from 'react'
import { announceMsg } from '../../messageFunction/announce'
import { Body, Header2 } from '../../style'
import Grid from '@material-ui/core/Grid';
import UploadFormTab from './uploadFormTab'
import SelectClassTab from './selectClassTab';
import SelectChapTab from './selectChapTab';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { getUserByUserID,getClassById,getChapListByClassID,uploadDocumentRequest,insertUploadHis,uploadConfirm } from '../../mongoDBFunction'

const liff = window.liff

class UploadLN extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: "",
      userFullName: "",
      tab: "input",
      selectedClassAndChap: [],
      selectedClassName: [],
      fileName: "",
      desc: "",
      currentClass: "",
      allClassList: [],
      allChapList: [],
      file: false
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
    let { tab,allClassList,selectedClassAndChap,desc,fileName,selectedClassName,currentClass,allChapList,file } = this.state
    if (tab === "input") {
      return (
        <UploadFormTab 
          changeTabFunc={this.changeTab}
          changeDescFunc={this.handleDescChange}
          changeFileNameFunc={this.handleFileNameChange}
          selectedClassAndChap={selectedClassAndChap}
          desc={desc}
          fileName={fileName}
          submitFunc={this.submitForm}
          closeAppFunc={this.closeApp}
          selectedClassName={selectedClassName}
          uploadFunc={this.handleUploadFile}
          file={file}
        />
      )
    } else if (tab === "selectClass") {
      return (
        <SelectClassTab 
          selectClassFunc={this.selectClass}
          selectedClassAndChap={selectedClassAndChap}
          allClassList={allClassList}
          changeTabFunc={this.changeTab}
        />
      )
    } else if (tab === "selectChap") {
        return (
          <SelectChapTab 
            selectClassFunc={this.selectChap}
            selectedClassAndChap={selectedClassAndChap}
            allChapList={allChapList}
            changeTabFunc={this.changeTab}
            currentClass={currentClass}
            refreshFunc={this.selectClass}
          />
        )
      }
    
  };

  changeTab = (tab) => {
    this.setState({
      tab: tab,
    });
  };

  selectClass = async (classId,className) => {
    let chapList = await getChapListByClassID(classId);
    console.log(chapList)
    this.setState({
        allChapList: chapList,
        tab: "selectChap",
        currentClass: className
    });
    console.log(this.state.allChapList);
  };

  selectChap = async (chapId,chapName,classId,className) => {
    let { selectedClassAndChap,selectedClassName } = this.state
    let index = selectedClassAndChap.findIndex(x => (x.class === classId && x.chapId === chapId));
    if (index === -1) {
      this.setState({
        selectedClassAndChap: [...selectedClassAndChap,{class: classId, chapId: chapId, chapName: chapName}],
        selectedClassName: [...selectedClassName,className],
      });
    } else {
        selectedClassAndChap.splice( index, 1 );
        selectedClassName.splice( index, 1 );
        this.setState({
            selectedClassAndChap: selectedClassAndChap,
            selectedClassName: selectedClassName,
        });
    }
  };

  handleFileNameChange = (event) => {
    this.setState({
        fileName: event.target.value,
    });
  };

  handleDescChange = (event) => {
    this.setState({
        desc: event.target.value,
    });
  };

  handleUploadFile = async (event) => {
    await this.setState({
      file: event.target.files[0]
    })
  }

  submitForm =  async (values, pristineValues) => {
    let { selectedClassAndChap,desc,userId,userFullName,fileName,file,selectedClassName } = this.state
    let res = await Promise.all(selectedClassAndChap.map(async (data,key) => {
      let result = await uploadDocumentRequest(file,"/"+data.class+"/"+data.chapId);
      if (fileName === "") {
        fileName = file.name
      }
      let sendData = {
        lecName: fileName,
        lecDesc: desc,
        lecURL: result,
        lecUploader: userId
      }
      let metaData = {
        classId: data.class,
        chapId: data.chapId,
        className: selectedClassName[key],
        chapName: data.chapName,
        uploaderName: userFullName
      }
      let result2 = await insertUploadHis(sendData,metaData,userId)
      return result
    }))
    let confirmData = {
      senderId: userId,
      lecName: fileName,
      lecDesc: desc,
      lecURL: res[0]
    }
    await uploadConfirm(confirmData)

    this.props.history.push({
      pathname: '/UploadLNSuccess'
    })
    
  }

  render() {
    return (
      <Body>
        <Grid item xs={12}>
          <Header2> New Lecture Note </Header2>
            { this.renderTab() }
        </Grid>
      </Body>
    );
  }
}

export default UploadLN;
