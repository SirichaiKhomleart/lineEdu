import React, { Component } from 'react'
import { insertClassroom } from '../../mongoDBFunction'
import {  Text, BarLink } from '../../style'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MaterialUIForm from 'material-ui-form'

const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#7B06FF',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#7B06FF',
        }
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderColor: "#7B06FF"
      },
      focused: {
        borderColor: "#7B06FF"
      }
    }
  },
  typography: {
    useNextVariants: true,
  },
});
const themeDesc = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#7B06FF',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#7B06FF',
        }
      }
    },
    MuiPrivateNotchedOutline: {
      focused: {
        borderColor: "#7B06FF"
      },
      root: {
        minHeight: "200px",
        borderColor: "#7B06FF"
      }
    }
  },
  typography: {
    useNextVariants: true,
  }
});
const themeButton = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        color: 'white',
        fontSize: "18px",
        fontWeight: "300",
        backgroundColor: "#7B06FF",
        height: "50px",
        '&$disabled': {
          color: "white",
          backgroundColor: "gray"
        }
      }
    }
  },
  typography: {
    useNextVariants: true,
  }
});

class InputMessageTab extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {

  }

  renderSelectClassTab() {
    let { selectedClassName } = this.props
    console.log(selectedClassName);
    let text = "Select Classes to Announce"
    if (selectedClassName.length === 1) {
        text = selectedClassName[0]
    } else if (selectedClassName.length > 1){
        text = selectedClassName[0] + " and " + (selectedClassName.length-1) + " other(s)"
    }
    return(
        <Text> {text} </Text>
    )
  }

  render() {
      let { message,changeMshFunc,submitFunc,closeAppFunc,changeTabFunc,selectedClassName } = this.props
    return (
        <MaterialUIForm onSubmit={submitFunc} style={{display: 'flex', flexWrap: 'wrap'}}>
        <Grid item xs={12}>
            <BarLink onClick={() => changeTabFunc("selectClass")}>
                { this.renderSelectClassTab() }
                <i className="material-icons">
                    chevron_right
                </i>
            </BarLink>
        </Grid>
        <Grid item xs={12}>
            <MuiThemeProvider theme={theme}>
            <MuiThemeProvider theme={themeDesc}>
                <div style={{minHeight: "220px"}}>
                <TextField 
                    id="outlined-name"
                    label="Message"
                    onChange={changeMshFunc}
                    margin="normal"
                    variant="outlined"
                    value={message}
                    fullWidth
                    multiline
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                </div>
            </MuiThemeProvider>
            </MuiThemeProvider>
        </Grid>
        <Grid item xs={12} style={{display: "flex", flexDirection: "column", marginTop: "20px"}}>
            <MuiThemeProvider theme={themeButton}>
                <Button type="submit"
                  disabled={(message === "" || selectedClassName.length === 0) ? true : false}  
                >
                    Done
                </Button>
            </MuiThemeProvider>
        </Grid>
        </MaterialUIForm>
    );
  }
}

export default InputMessageTab;
