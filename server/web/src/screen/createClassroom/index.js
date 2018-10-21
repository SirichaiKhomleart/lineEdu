import React, { Component } from 'react'
import { Body } from '../../style'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { InputLabel } from '@material-ui/core';

const liff = window.liff
const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: 'green',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: 'green',
        }
      }
    },
    MuiNotchedOutline: {
      focused: {
        borderColor: "green"
      }
    }
  }
});
const themeScoreSection = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: 'gray',
        fontSize: "18px",
        fontWeight: "300",
        '&$focused': {
          color: 'gray',
        }
      }
    }
  }
});

class CreateClassroom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayName : '',
      userId : '',
      pictureUrl : '',
      statusMessage : '',
      name: "name"
    }
    this.initialize = this.initialize.bind(this)
    this.closeApp = this.closeApp.bind(this)
  }

  componentDidMount() {
    window.addEventListener('load', this.initialize);
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

  handleChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  render() {
    return (
      <Body>
        <Grid xs={12}>
          <h3><p> Create new classroom </p></h3>
          <form style={{display: 'flex', flexWrap: 'wrap'}}>
            <Grid xs={12}>
              <MuiThemeProvider theme={theme}>
                <TextField 
                  id="outlined-name"
                  label="Class Name"
                  onChange={this.handleChange}
                  margin="normal"
                  variant="outlined"
                  value={this.state.name}
                  style={{width: "100%"}}
                />
                <TextField 
                  id="outlined-name"
                  label="Description"
                  onChange={this.handleChange}
                  margin="normal"
                  variant="outlined"
                  value={this.state.name}
                  style={{width: "100%"}}
                  multiline
                />
                <InputLabel
                  label="Score Sections"
                />
                <TextField
                  label="Section Name"
                  id="simple-start-adornment"
                  margin="normal"
                  defaultValue=" "
                  style={{width: "50%"}}
                  multiline
                />
                <TextField
                  label="Score"
                  id="simple-start-adornment"
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Point</InputAdornment>,
                  }}
                  style={{width: "30%", marginLeft: "20px"}}
                  defaultValue=" "
                />
              </MuiThemeProvider>
            </Grid>
            <Grid xs={12}>
              <Button>Submit</Button>
            </Grid>
          </form>
        </Grid>
      </Body>
    );
  }
}

export default CreateClassroom;
