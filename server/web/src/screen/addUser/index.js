import React, { Component } from 'react'
import { insertClassroom } from '../../mongoDBFunction'
import { Body } from '../../style'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MaterialUIForm from 'material-ui-form'

const liff = window.liff
const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#27973D',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#27973D',
        }
      }
    },
    MuiNotchedOutline: {
      root: {
        borderColor: "#27973D"
      },
      focused: {
        borderColor: "#27973D"
      }
    }
  }
});
const themeButton = createMuiTheme({
    overrides: {
      MuiButton: {
        root: {
          color: 'white',
          fontSize: "18px",
          fontWeight: "300",
          backgroundColor: "#27973D",
          height: "50px"
        }
      }
    }
  });

class AddUser extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: "",
      picURL: "",
      displayName: "",
      email: "",
      phoneNum: "",
      fullName: ""
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  componentDidMount () {
    window.addEventListener('load', this.initialize);
  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile();
      this.setState({
        userId: profile.userId,
        picURL: profile.pictureUrl,
        displayName: profile.displayName
      })
    })
  }

  closeApp() {
    liff.sendMessages([{
      type: 'text',
      text: 'Thank you, you are ready to use our services.'
    }]).then(() => {
      liff.closeWindow()
    })
  }

  handleClassFullnameChange = (event) => {
    this.setState({
      fullName: event.target.value,
    });
  };

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handlePhoneNumChange = (event) => {
    this.setState({
      phoneNum: event.target.value,
    });
  };

  submitForm = (values, pristineValues) => {
    let { userId,picURL,displayName,email,phoneNum,fullName } = this.state
    let insertData = {
        userID: userId,
        userDisplayName: displayName,
        userPicURL: picURL,
        userFullName: fullName,
        userEmail: email,
        userPhoneNum: phoneNum
    }
    insertClassroom(insertData, (result) => {
      console.log(result);
    })
    this.closeApp();
  }

  render() {
    return (
      <Body>
        <Grid item xs={12}>
          <h3><p style={{color:"#27973D"}}> Registeration form </p></h3>
          <MaterialUIForm onSubmit={this.submitForm} style={{display: 'flex', flexWrap: 'wrap'}}>
            <Grid item xs={12}>
              <MuiThemeProvider theme={theme}>
                <TextField 
                  id="outlined-name"
                  label="Fullname (be used to display to other)"
                  onChange={this.handleFullnameChange}
                  margin="normal"
                  variant="outlined"
                  value={this.state.fullName}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField 
                  id="outlined-name"
                  label="Email"
                  onChange={this.handleEmailChange}
                  margin="normal"
                  variant="outlined"
                  value={this.state.email}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="(Optional)"
                />
                <TextField 
                  id="outlined-name"
                  label="Phone Number"
                  onChange={this.handlePhoneNumChange}
                  margin="normal"
                  variant="outlined"
                  value={this.state.phoneNum}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="(Optional)"
                />
              </MuiThemeProvider>
            </Grid>
            <Grid item xs={12} style={{display: "flex", flexDirection: "column", marginTop: "20px"}}>
              <MuiThemeProvider theme={themeButton}>
                <Button type="submit">
                  Done
                </Button>
              </MuiThemeProvider>
            </Grid>
          </MaterialUIForm>
        </Grid>
      </Body>
    );
  }
}

export default AddUser;
