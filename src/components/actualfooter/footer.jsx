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
    top: '0px',
    padding: '24px',
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
    textAlign: 'center'
  },
  footerText: {
    display: 'inline-block',
    fontSize: '15px',
    color: 'rgb(170, 149, 133)',
    cursor: 'pointer'
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
    marginRight: "20px",
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
          <a href={"https://t.me/toastfinance"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Telegram
            </Typography>
          </a>
          <a href={"https://github.com/Toast-finance/"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              GitHub
            </Typography>
          </a>
          <a href={"https://twitter.com/toastfinance"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Twitter
            </Typography>
          </a>
          <a href={"https://medium.com/@toastfinance/"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Medium
            </Typography>
          </a>
          <a href={"https://etherscan.io/token/0x19810559df63f19cfe88923313250550edadb743"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              HOUSE on Etherscan
            </Typography>
          </a>
          <a href={"https://etherscan.io/token/0x774adc647a8d27947c8d7c098cdb4cdf30b126de"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              AVO on Etherscan
            </Typography>
          </a>
          <a href={"https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x19810559df63f19cfe88923313250550edadb743"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              ETH-HOUSE on Uniswap
            </Typography>
          </a>
          <a href={"https://uniswap.exchange/swap?inputCurrency=0x19810559df63f19cfe88923313250550edadb743&outputCurrency=0x774adc647a8d27947c8d7c098cdb4cdf30b126de"} target="_blank" className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              HOUSE-AVO on Uniswap
            </Typography>
          </a>
        </div>
      </div>
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
