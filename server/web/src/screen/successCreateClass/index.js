import React, { Component } from 'react'
import { insertClassroom } from '../../mongoDBFunction'
import { Body, FlexCenter } from '../../style'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import MaterialUIForm from 'material-ui-form'
import Success from '../../asset/success.jpg'

const liff = window.liff
const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      disabled: {
        color: '#11336C',
        fontSize: "20px",
        fontWeight: "500",
        backgroundColor: "white",
        '&$disabled': {
          color: '#11336C',
        }
      }
    },
    MuiNotchedOutline: {
      disabled: {
        borderColor: "#11336C"
      }
    },
    MuiOutlinedInput: {
      disabled: {
        color: "black"
      }
    }
  }
});

class SuccessCreateClass extends Component {

  constructor(props) {
    super(props)
    this.state = {
      classPublicKey: "",
      classPrivateKey: "",
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  componentDidMount() {
    let { classPublicKey, classPrivateKey } = this.props.location.state
    // let classPubilcKey = "studentt"
    // let classPrivateKey = "adminnn"
    window.addEventListener('load', this.initialize);
    this.setState({
      classPublicKey: classPublicKey,
      classPrivateKey: classPrivateKey
    })
  }

  initialize() {
    liff.init(async (data) => {
      let profile = await liff.getProfile()
      this.setState({
        userId: profile.userId
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
      <Body>
        <Grid item xs={12}>
            <h2><p style={{color: "#11336C"}}> New Classroom Success </p></h2>
            <FlexCenter>
              <FlexCenter flexDirection="row" >
                <img src={Success} style={{height: "150px"}}/>
              </FlexCenter>
              <FlexCenter flexDirection="row">
                <p style={{color: "#11336C", fontWeight: "500"}}> Your new classroom was created.</p>
              </FlexCenter>
            </FlexCenter>
            <Grid item xs={12} style={{paddingTop: "15px"}}>
              <MuiThemeProvider theme={theme}>
                <TextField 
                  id="outlined-name"
                  label="Your Admin Code"
                  margin="normal"
                  variant="outlined"
                  value={this.state.classPrivateKey}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
                <TextField 
                  id="outlined-name"
                  label="Your Student Code"
                  margin="normal"
                  variant="outlined"
                  value={this.state.classPublicKey}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </MuiThemeProvider>
            </Grid>
        </Grid>
      </Body>
    );
  }
}

export default SuccessCreateClass;
