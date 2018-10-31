import React, { Component } from 'react'
import { Body, FlexCenter } from '../../style'
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
    // let classPublicKey = "studentt"
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
            <h2><p> New Classroom Success </p></h2>
            <FlexCenter>
              <FlexCenter flexDirection="row" >
                <img src={Success} style={{height: "150px"}}/>
              </FlexCenter>
              <FlexCenter flexDirection="row">
                <p style={{color: "#73c96e", fontWeight: "500"}}> Your new classroom was created.</p>
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
