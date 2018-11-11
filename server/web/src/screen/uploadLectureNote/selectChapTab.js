import React, { Component } from 'react'
import { Text, BarLinkList } from '../../style'
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { insertChapter,getChapListByClassID } from '../../mongoDBFunction'



const themeCheckBox = createMuiTheme({
  overrides: {
    MuiIconButton: {
        root: {
            padding: "0px"
        }
    },
    MuiCheckbox: {
        colorSecondary: {
            color: "#80808066",
            '&$checked': {
                color: '#17A085',
            }
        }
    }
  },
  typography: {
    useNextVariants: true,
  },
});
const themeButtonBack = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        color: '#17A085',
        fontSize: "18px",
        fontWeight: "500",
        backgroundColor: "white",
        height: "50px",
        border: "solid 1px"
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
          fontSize: "12px",
          fontWeight: "300",
          backgroundColor: "#17A085",
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
const theme = createMuiTheme({
    overrides: {
        MuiFormLabel: {
            root: {
                color: '#17A085',
                '&$focused': {
                    color: '#17A085',
                }
            }
        },
        MuiInput: {
            root: {
                borderColor: "#17A085",
                '&$focused': {
                    borderColor: "#17A085"
                }
            }
        }
    },
    typography: {
        useNextVariants: true,
    },
});
class SelectChapTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
        newChapter: false,
        nameChapter: ""
    }
  }

  componentDidMount () {
    
  }

  addNewChapter = () => {
    this.setState({
        newChapter: true
    })
  }

  cancelNewChapter = () => {
    this.setState({
        newChapter: false
    })
  }

  handleChapterNameChange = (event) => {
    this.setState({
        nameChapter: event.target.value,
    });
  };

  confirmNewChapter = async () => {
    let { nameChapter } = this.state
    let { allChapList,refreshFunc,currentClass } = this.props
    let result = await insertChapter(allChapList._id,nameChapter)
    if (result.mModified !== 0) {
        await refreshFunc(allChapList._id,currentClass)
        this.setState({
            newChapter: false,
            nameChapter: ""
        })
    }
  }

  renderListClass = () => {
      let { selectedClassAndChap,allChapList,currentClass } = this.props
      if (allChapList.classLec) {
          console.log(allChapList);
        return (
            allChapList.classLec.map((data,key) => {
                let index = selectedClassAndChap.findIndex(x => (x.class === allChapList._id && x.chapId === data._id));
                return(
                    <BarLinkList 
                        lastItem={false} 
                        key={data.classId || key}
                        onClick={() => this.props.selectClassFunc(data._id,data.chapterName,allChapList._id,currentClass)}
                    >   
                        <Text style={{color: (index === -1) ? "gray" : "#17A085"}}> {data.chapterName} </Text>
                        <Checkbox 
                            icon={<RadioButtonUnchecked />} 
                            checkedIcon={<CheckCircle />} 
                            checked={(index === -1) ? false : true}
                        />
                    </BarLinkList>
                )
            })
          )
      } else {
          return (
              <div></div>
          )
      }
  }

  renderNewChapter = () => {
    let { newChapter,nameChapter } = this.state
    if (newChapter === false) {
        return (
            <BarLinkList 
                lastItem={true} 
                onClick={() => this.addNewChapter()}
            >  
                <div style={{display: "flex", alignItems: "center"}}>
                    <Icon style={{fontSize: "25px", color: "#17A085", marginRight: "10px"}}>
                        add
                    </Icon>
                    <Text style={{color: "#17A085"}}> New Chapter </Text>
                </div>
            </BarLinkList>
        )
    } else {
        return (
            <BarLinkList 
                lastItem={true}
                style={{alignItems: "center"}}
            >  
                <div style={{display: "flex", alignItems: "center"}}>
                    <MuiThemeProvider theme={theme}>
                        <TextField
                            label="New Chapter's Name: "
                            id="simple-start-adornment"
                            margin="normal"
                            style={{marginTop: "0px", marginBottom: "0px"}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={nameChapter}
                            onChange={this.handleChapterNameChange}
                        />
                    </MuiThemeProvider>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    <MuiThemeProvider theme={themeButton}>
                        <Button onClick={() => this.confirmNewChapter()}
                        disabled={(nameChapter === "") ? true : false}>
                            Add
                        </Button>
                    </MuiThemeProvider>
                    <Icon style={{color: "gray", fontSize: "25px", paddingLeft: "15px"}}
                        onClick={() => this.cancelNewChapter()}  
                    >
                        clear
                    </Icon>
                </div>
            </BarLinkList>
        )
    }

  }

  render() {
      let {currentClass} = this.props
    return (      
        <div style={{display: 'flex', flexDirection: 'column', minHeight: "350px", justifyContent: "space-between"}}>
            <Grid item xs={12}>
                <div style={{marginTop: "30px", marginBottom: "15px"}}>
                    <Text> Pick classes that you want to upload your lecture note for {currentClass} </Text>
                </div>
                <Grid item xs={12}>
                    <MuiThemeProvider theme={themeCheckBox}>
                        {this.renderListClass()}
                        {this.renderNewChapter()}                        
                    </MuiThemeProvider>
                </Grid>
            </Grid>

            <Grid item xs={12} style={{display: "flex", flexDirection: "column", marginTop: "20px"}}>
                <MuiThemeProvider theme={themeButtonBack}>
                    <Button style={{marginTop: "10px"}} onClick={() => this.props.changeTabFunc("selectClass")}>
                        OK
                    </Button>
                </MuiThemeProvider>
            </Grid>
        </div>
    );
  }
}

export default SelectChapTab;
