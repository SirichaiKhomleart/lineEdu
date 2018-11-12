import React, { Component } from 'react'
import { Text, BarLinkList } from '../../style'
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';

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

class SelectClassTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
 
    }
  }

  componentDidMount () {
    
  }

  renderListClass = () => {
      let { selectedClassAndChap,allClassList } = this.props
      return (
        allClassList.map((data,key) => {
            let index = selectedClassAndChap.findIndex(x => (x.class === data.classId));
            return(
                <BarLinkList 
                    lastItem={(key === allClassList.length-1) ? true : false} 
                    key={data.classId}
                    onClick={() => this.props.selectClassFunc(data.classId,data.className)}
                >
                    <Text style={{color: (index === -1) ? "gray" : "#17A085"}}> {data.className} </Text>
                    <i className="material-icons" style={{color: (index === -1) ? "gray" : "#17A085"}}>
                        chevron_right
                    </i>
                </BarLinkList>
            )
        })
      )
  }

  render() {
    return (      
        <div style={{display: 'flex', flexDirection: 'column', minHeight: "350px", justifyContent: "space-between"}}>
            <Grid item xs={12}>
                <div style={{marginTop: "30px", marginBottom: "15px"}}>
                    <Text> Pick classes that you want to upload your lecture note </Text>
                </div>
                <Grid item xs={12}>
                    <MuiThemeProvider theme={themeCheckBox}>
                        {this.renderListClass()}
                    </MuiThemeProvider>
                </Grid>
            </Grid>

            <Grid item xs={12} style={{display: "flex", flexDirection: "column", marginTop: "20px"}}>
                <MuiThemeProvider theme={themeButtonBack}>
                    <Button style={{marginTop: "10px"}} onClick={() => this.props.changeTabFunc("input")}>
                        Back
                    </Button>
                </MuiThemeProvider>
            </Grid>
        </div>
    );
  }
}

export default SelectClassTab;