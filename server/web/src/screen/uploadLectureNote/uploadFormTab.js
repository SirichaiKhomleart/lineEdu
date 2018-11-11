import React, { Component } from 'react'
import { insertClassroom } from '../../mongoDBFunction'
import {  Text, BarLink,FlexCenter } from '../../style'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MaterialUIForm from 'material-ui-form'

const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        color: '#17A085',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#17A085',
        }
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderColor: "#17A085"
      },
      focused: {
        borderColor: "#17A085"
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
        color: '#17A085',
        fontSize: "20px",
        fontWeight: "500",
        '&$focused': {
          color: '#17A085',
        }
      }
    },
    MuiPrivateNotchedOutline: {
      focused: {
        borderColor: "#17A085"
      },
      root: {
        minHeight: "130px",
        borderColor: "#17A085"
      }
    },
    MuiFormControl: {
        marginNormal: {
            marginTop: "0px"
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
        backgroundColor: "#17A085",
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
const themeButtonUpload = createMuiTheme({
    overrides: {
      MuiButton: {
        root: {
          color: 'white',
          fontSize: "13px",
          fontWeight: "300",
          backgroundColor: "#17A085",
          width: "100%",
          marginTop: "5px"
        }
      }
    },
    typography: {
      useNextVariants: true,
    }
  });

class UploadFormTab extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {

  }

  renderSelectClassTab() {
    let { selectedClassName,selectedClassAndChap } = this.props
    console.log(selectedClassName);
    let text = "Select Classes to Upload Lecture Note"
    if (selectedClassName.length === 1) {
        text = selectedClassName[0]
    } else if (selectedClassName.length > 1){
        text = selectedClassName[0] + " " + selectedClassAndChap[0].chap + " and " + (selectedClassName.length-1) + " other(s)"
    }
    return(
        <Text> {text} </Text>
    )
  }

  render() {
    let { fileName,desc,changeDescFunc,changeFileNameFunc,submitFunc,changeTabFunc,selectedClassName,uploadFunc,file } = this.props
    return (
        <MaterialUIForm onSubmit={submitFunc} style={{display: 'flex', flexWrap: 'wrap'}}>
        <Grid item xs={12} style={{display: "flex"}}>
            <Grid item xs={4} style={{paddingRight: "10px", paddingTop: "16px"}}>
                <FlexCenter style={{border: "1px solid gray", borderRadius: "10px", height: "150px", width: "100%", alignItems: "center"}}>
                  <i className="material-icons" style={{fontSize: "70px", display:(file === false) ? "none" : "flex"}}>
                    description
                  </i>
                  <Text style={{display:(file === false) ? "none" : "flex"}}> File attached </Text>
                </FlexCenter>
                <MuiThemeProvider theme={themeButtonUpload}>
                    <div className="upload-btn-wrapper">
                        <button className="btn">Upload File</button>
                        <input type="file" onChange={uploadFunc}/>
                    </div>
                </MuiThemeProvider>
            </Grid>
            <Grid item xs={8}>
                <MuiThemeProvider theme={theme}>
                    <TextField 
                        id="outlined-name"
                        label="File Name"
                        onChange={changeFileNameFunc}
                        margin="normal"
                        variant="outlined"
                        value={fileName}
                        fullWidth
                        multiline
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <MuiThemeProvider theme={themeDesc}>
                        <div style={{minHeight: "150px"}}>
                            <TextField 
                                id="outlined-name"
                                label="Description"
                                onChange={changeDescFunc}
                                margin="normal"
                                variant="outlined"
                                value={desc}
                                placeholder="(Optional)"
                                fullWidth
                                multiline
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </MuiThemeProvider>
                </MuiThemeProvider>
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <BarLink onClick={() => changeTabFunc("selectClass")}>
                { this.renderSelectClassTab() }
                <i className="material-icons">
                    chevron_right
                </i>
            </BarLink>
        </Grid>
        <Grid item xs={12} style={{display: "flex", flexDirection: "column", marginTop: "20px"}}>
            <MuiThemeProvider theme={themeButton}>
                <Button type="submit"
                  disabled={(selectedClassName.length === 0 || file === false) ? true : false}  
                >
                    Done
                </Button>
            </MuiThemeProvider>
        </Grid>
        </MaterialUIForm>
    );
  }
}

export default UploadFormTab;