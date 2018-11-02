import React, { Component } from 'react'
import { Body, FlexCenter, Header2 } from '../../style'
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Success from '../../asset/success.jpg'

const liff = window.liff
const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      disabled: {
        color: '#73c96e',
        fontSize: "20px",
        fontWeight: "500",
        backgroundColor: "white",
        '&$disabled': {
          color: '#73c96e',
        }
      }
    },
    MuiPrivateNotchedOutline: {
      disabled: {
        borderColor: "#73c96e"
      }
    },
    MuiOutlinedInput: {
      disabled: {
        color: "black"
      }
    }
  },
  typography: {
    useNextVariants: true,
  },
});

class SuccessAnnouncement extends Component {

  constructor(props) {
    super(props)
    this.state = {
      classPublicKey: "",
      classPrivateKey: "",
    }
    this.closeApp = this.closeApp.bind(this)
  }

  componentDidMount() {
  }

  closeApp(event) {
    event.preventDefault()
    liff.closeWindow()
  }

  render() {
    return (
      <Body>
        <Grid item xs={12}>
            <Header2 style={{marginBottom: "40px"}}> Make Announcements </Header2>
            <FlexCenter>
              <FlexCenter flexDirection="row" >
                <img src={Success} style={{height: "150px"}}/>
              </FlexCenter>
              <FlexCenter flexDirection="row">
                <p style={{color: "#73c96e", fontWeight: "500"}}> Your message already sent</p>
              </FlexCenter>
            </FlexCenter>
        </Grid>
      </Body>
    );
  }
}

export default SuccessAnnouncement;
