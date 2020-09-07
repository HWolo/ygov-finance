import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import {
  Link
} from "react-router-dom";
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
  footer: {
    //position: 'absolute',
    marginBottom: "10px",
    top: '0px',
    padding: '20px',
    paddingLeft: '75px',
    paddingRight: '50px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    }
  },
  footerLinks: {
    display: 'block',
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    textAlign: 'right'
  },
  footerText: {
    display: 'inline-block',
    background: 'rgb(241,241,241)',
    fontSize: '17px',
    fontWeight: 'bold',
    color: 'rgb(170, 149, 133)',
    padding: '6px',
    paddingLeft: '15px',
    paddingRight: '15px',
    boxShadow: '1px 1px 1px 1px rgb(212 212 212)',
    borderRadius: '20px',
    cursor: 'pointer',
       '&:hover': {
           background: 'rgb(216 211 209)',
           color: 'rgb(255 255 255)'
       }
  },

  languageContainer: {
    paddingLeft: '12px',
    display: 'none'
  },
  selectInput: {
    fontSize: '14px',
    color: colors.pink
  },
  link: {
    textDecoration: 'none',
    marginRight: "15px",
  }
});


class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      languages: store.getStore('languages'),
      language: 'en',
    }
  }

  render() {
    const { classes, t, location } = this.props;
    const {
    } = this.state

    return (
      <div className={classes.footer}>
        <div className={classes.footerLinks}>
          <Link to={"/"} className={ classes.link } style={{float: "left"}}>
            <Typography className={ classes.mainLogo } variant={ 'h6'} style={{background: "none", color: 'rgb(170, 149, 133)', boxShadow: "none",}}>
              <img alt="Toast.finance" src="/toastlogonew1.png" height="24"  style={{marginBottom: '3px', verticalAlign: "middle"}} />
              &nbsp;Toast.finance
            </Typography>
          </Link>

          <Link to={"/staking"} className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Snacks
            </Typography>
          </Link>
          <a href={"https://medium.com/@toastfinance/toast-finance-house-or-avo-5066766b2901"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Announcement
            </Typography>
          </a>
          <a href={"https://toast.finance/calc/"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Calculator
            </Typography>
          </a>
          <a href={"https://gov.toast.finance/"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Governance
            </Typography>
          </a>
        </div>
      </div>
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
