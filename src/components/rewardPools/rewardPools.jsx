import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import {
    Typography,
    Button,
    Card
} from '@material-ui/core';
import {withNamespaces} from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import {colors} from '../../theme'

import {
    ERROR,
    CONFIGURE_RETURNED,
    GET_BALANCES,
    GET_BALANCES_RETURNED,
    GOVERNANCE_CONTRACT_CHANGED
} from '../../constants'

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '40px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    intro: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '400px'
    },
    introCenter: {
        minWidth: '100%',
        textAlign: 'center',
        padding: '48px 0px'
    },
    investedContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        minWidth: '100%',
        [theme.breakpoints.up('md')]: {
            minWidth: '800px',
        }
    },
    connectContainer: {
        padding: '12px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '450px',
        [theme.breakpoints.up('md')]: {
            width: '450',
        }
    },
    actionButton: {
        '&:hover': {
            backgroundColor: "#2F80ED",
        },
        padding: '12px',
        backgroundColor: "#2F80ED",
        borderRadius: '1rem',
        border: '1px solid #E1E1E1',
        fontWeight: 500,
        [theme.breakpoints.up('md')]: {
            padding: '15px',
        }
    },
    buttonText: {
        fontWeight: '700',
        color: 'white',
    },
    disaclaimer: {
        padding: '12px',
        marginTop: '20px',
        //border: '1px solid rgb(174, 174, 174)',
        //borderRadius: '0.75rem',
        marginBottom: '0px',
        textAlign: 'center',
        width: '100%',
    },
    footer: {
        padding: '12px',
        paddingTop: '0',
        paddingBottom: '30px',
        textAlign: 'justify',
        width: '100%',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    addressContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '0.83rem',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
        padding: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderRadius: '50px',
        border: "1px solid rgb(239 239 239)",
        alignItems: 'center',
        maxWidth: '500px',
        marginBottom: '15px'
    },
    walletAddress: {
        padding: '0px 12px'
    },
    walletTitle: {
        flex: 1,
        color: colors.darkGray
    },
    rewardPools: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '50px',
        flexWrap: 'wrap'
    },
    rewardPoolContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '25px',
        paddingTop: '30px',
        paddingBottom: '30px',
        borderRadius: '20px',
        border: '1px solid rgb(228 227 227)',
        boxShadow: '1px 1px 5px 1px rgb(226 226 226)',
        margin: '0px',
        marginBottom: '40px',
        background: 'rgb(241,241,241)',
        minHeight: '300px',
        maxWidth: '45%',
        minWidth: '45%'
    },
    title: {
        width: '100%',
        color: colors.darkGray,
        minWidth: '100%',
        marginLeft: '20px'
    },
    poolName: {
        paddingBottom: '20px',
        color: colors.text
    },
    tokensList: {
        fontSize: '17px',
    color: 'rgb(33 37 54)',
    paddingBottom: '25px'
    },
    poolWebsite: {
        color: colors.darkGray,
        paddingBottom: '20px',
        textDecoration: 'none'
    },
    stakeButton: {
    display: "block", width: "100%", 
    background: "rgb(241,241,241)", 
    color: "rgb(170, 149, 133)", 
    fontWeight: "bold", 
    marginTop: "15px", 
    padding: "12px", 
    border: "1px solid rgb(239 239 239)", 
    boxShadow: "1px 1px 5px 1px rgb(212 212 212)", 
    borderRadius: "20px", 
    textDecoration: "none",
    '&:hover': {
           background: 'rgb(216 211 209)',
           color: 'rgb(255 255 255)',
           borderColor: 'rgb(216 211 209)',
        },
    },
    stakeButtontwo: {
  display: "block", width: "100%", 
  background: "rgb(241,241,241)", 
  color: "rgb(170, 149, 133)", 
  fontWeight: "bold", 
  padding: "14px", 
  border: "1px solid rgb(239 239 239)", 
  boxShadow: "1px 1px 5px 1px rgb(212 212 212)", 
  borderRadius: "20px", 
  textDecoration: "none", 
  textAlign: "center",
  '&:hover': {
           background: 'rgb(216 211 209)',
           color: 'rgb(255 255 255)',
           borderColor: 'rgb(216 211 209)',
        },
    }
    
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class RewardPools extends Component {

    constructor(props) {
        super()

        const account = store.getStore('account')
        const governanceContractVersion = store.getStore('governanceContractVersion')
        const rewardPools = store.getStore('rewardPools')

        this.state = {
            rewardPools: rewardPools,
            loading: !(account && rewardPools),
            account: account,
            governanceContractVersion: governanceContractVersion
        }

        dispatcher.dispatch({type: GET_BALANCES, content: {}})
    }

    componentWillMount() {
        emitter.on(CONFIGURE_RETURNED, this.configureReturned);
        emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
        emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
    }

    componentWillUnmount() {
        emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
        emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
        emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
    };

    setGovernanceContract = () => {
        this.setState({governanceContractVersion: store.getStore('governanceContractVersion')})
    }

    balancesReturned = () => {
        const rewardPools = store.getStore('rewardPools')
        this.setState({rewardPools: rewardPools})
    }

    configureReturned = () => {
        this.setState({loading: false})
    }

    render() {
        const {classes} = this.props;
        const {
            value,
            account,
            loading,
            modalOpen,
        } = this.state

        var address = null;
        if (account.address) {
            address = account.address.substring(0, 6) + '...' + account.address.substring(account.address.length - 4, account.address.length)
        }

        return (
            <div style={{width: '100%'}}>
                <div className={classes.root}>
                    <Card className={classes.addressContainer} onClick={this.overlayClicked}>
                        <div style={{
                            background: '#DC6BE5',
                            opacity: '1',
                            borderRadius: '10px',
                            width: '10px',
                            height: '10px'
                         }}></div>
                        <Typography variant={'h4'} className={classes.walletAddress} noWrap>{address}</Typography>
                    </Card>

                    <Button
                      className={classes.stakeButtontwo}
                      style={{ width: 'auto', padding:'5px', paddingLeft: '30px', paddingRight: '30px' }}
                        href={"https://uniswap.info/pair/0xbdde248cfe84258e16dbf3911c1ce9c93beb3eb9"}
                        target="_blank"
                    >
                     AVO-HOUSE Uniswap pair
                    </Button>

                    <div className={classes.rewardPools}>
                        {
                            this.renderRewards()
                        }
                    </div>
                    <hr />
                    {modalOpen && this.renderModal()}
                </div>
              <Typography variant={'h5'} className={classes.footer} style={{textAlign: 'center'}}>
                <br /><br /><u>Addresses:</u>
                <br />Toast.finance Deployer - <a href="https://etherscan.io/address/0x6cef9EcD79e87F8a88143eE9b464119bB296dA8b" target="_blank">0x6cef9EcD79e87F8a88143eE9b464119bB296dA8b</a>
                  <br />HOUSE token - <a href="https://etherscan.io/address/0x19810559df63f19cfe88923313250550edadb743" target="_blank">0x19810559df63f19cfe88923313250550edadb743</a>
                  <br />AVO token - <a href="https://etherscan.io/address/0x774adc647a8d27947c8d7c098cdb4cdf30b126de" target="_blank">0x774adc647a8d27947c8d7c098cdb4cdf30b126de</a>
                  <br />EGGS token - <a href="https://etherscan.io/address/0x98be5a6b401b911151853d94a6052526dcb46fe3" target="_blank">0x98be5a6b401b911151853d94a6052526dcb46fe3</a>
                  <br />Pool A - <a href="https://etherscan.io/address/0x45352f928af429a01909b28e66b208c05de4df67" target="_blank">0x45352f928af429a01909b28e66b208c05de4df67</a>
                  <br />Pool B - <a href="https://etherscan.io/address/0xc18109c4fee0b915cee8c56d65cc1b44c866aa35" target="_blank">0xc18109c4fee0b915cee8c56d65cc1b44c866aa35</a>
                  <br />Uniswap HOUSE-ETH pair - <a href="https://uniswap.info/pair/0x2209b8260110af927AF0f2Eb96db471aE3Ab05EA" target="_blank">0x2209b8260110af927AF0f2Eb96db471aE3Ab05EA</a>
                  <br />Uniswap HOUSE-AVO pair - <a href="https://uniswap.info/pair/0xbdde248cfe84258e16dbf3911c1ce9c93beb3eb9" target="_blank">0xbdde248cfe84258e16dbf3911c1ce9c93beb3eb9</a>
                  <br />Balancer DAI-AVO pool - <a href="https://pools.balancer.exchange/#/pool/0xcfcdb690bdc88f43f7cac7d968d0d66d2118ad20/" target="_blank">0xcfcdb690bdc88f43f7cac7d968d0d66d2118ad20</a>
                  <br />Pool C - <a href="https://etherscan.io/address/0x2988d4c36feefe70f5889e9ac61ae075db7fd217" target="_blank">0x2988d4c36feefe70f5889e9ac61ae075db7fd217</a>
                  <br />Balancer DAI-EGGS pool - <a href="https://pools.balancer.exchange/#/pool/0x6928f625e448cc4480378938d9e98439d7baf1b9/" target="_blank">0x6928f625e448cc4480378938d9e98439d7baf1b9</a>
                  <br />Pool D - <a href="https://etherscan.io/address/0xdb93f1079d58802ec914907a55352f7e55374cc3" target="_blank">0xdb93f1079d58802ec914907a55352f7e55374cc3</a>

                  <br /><br /><u>Transactions:</u>
                  <br />HOUSE token contract creation - <a href="https://etherscan.io/tx/0xd24e2fc64d06518556998fc2f801567e1622e12ffa34214b4aff752a08e2a2a9" target="_blank">0xd24e2fc64d06518556998fc2f801567e1622e12ffa34214b4aff752a08e2a2a9</a>
                  <br />AVO token contract creation - <a href="https://etherscan.io/tx/0xe48cabe76e9aee38451bf1bb5ba9fbbf73b396d022be1e7db28f4d82ab3aa995" target="_blank">0xe48cabe76e9aee38451bf1bb5ba9fbbf73b396d022be1e7db28f4d82ab3aa995</a>
                  <br />Pool A contract creation - <a href="https://etherscan.io/tx/0x57bf8b90fade31e3d2a55165427b36eea2d9e290340553981e69d0ddc51a6dc0" target="_blank">0x57bf8b90fade31e3d2a55165427b36eea2d9e290340553981e69d0ddc51a6dc0</a>
                  <br />Pool B contract creation - <a href="https://etherscan.io/tx/0xbfe1b97ab3f0302573ece35950c74900617d462b117dacd7981c0e8d56aef914" target="_blank">0xbfe1b97ab3f0302573ece35950c74900617d462b117dacd7981c0e8d56aef914</a>

                  <br />Add Deployer as HOUSE minter - <a href="https://etherscan.io/tx/0x4a13fa582f18374ddb9f41010bf612fd9d94de1e95b55669df1f24bef8f26d87" target="_blank">0x4a13fa582f18374ddb9f41010bf612fd9d94de1e95b55669df1f24bef8f26d87</a>
                <br />Mint 20,000 HOUSE tokens - <a href="https://etherscan.io/tx/0x2603f2a7a8e3ca1ad9663334af3c9faa3f393fd0848b993de7f14412a4957b6c" target="_blank">0x2603f2a7a8e3ca1ad9663334af3c9faa3f393fd0848b993de7f14412a4957b6c</a>
                <br />Remove HOUSE minter - <a href="https://etherscan.io/tx/0xd6072e060046683bc6feff46d5d50fb09c49192f32ce779e405aa1a73a480e66" target="_blank">0xd6072e060046683bc6feff46d5d50fb09c49192f32ce779e405aa1a73a480e66</a>
                  <br />Burn HOUSE admin key - <a href="https://etherscan.io/tx/0x2202877bad26265dea135093edf90f7b4809f68e1314acad99825b78558d4a68" target="_blank">0x2202877bad26265dea135093edf90f7b4809f68e1314acad99825b78558d4a68</a>
                  <br />HOUSE setAllow - <a href="https://etherscan.io/tx/0x0a8f934a576a238b84132a4b486433812c050caa4a72d8855800c8ecd0374da5" target="_blank">0x0a8f934a576a238b84132a4b486433812c050caa4a72d8855800c8ecd0374da5</a>
                  <br />Add Deployer as AVO minter - <a href="https://etherscan.io/tx/0xc6f9401a40ea99193a18b9eea9a2da8fe55d7361e38c35832a679f8b5fe5836f" target="_blank">0xc6f9401a40ea99193a18b9eea9a2da8fe55d7361e38c35832a679f8b5fe5836f</a>
                <br />Mint 100,000 AVO tokens - <a href="https://etherscan.io/tx/0x5456171eab301343e08aca15cf9d3b8936ed5b019b15b46025397fd71ca60e79" target="_blank">0x5456171eab301343e08aca15cf9d3b8936ed5b019b15b46025397fd71ca60e79</a>
                <br />Remove AVO minter - <a href="https://etherscan.io/tx/0xf11777f3d488d096b31371995babb79c23c391a0a6e4322a9e891c6d2c0e5b8a" target="_blank">0xf11777f3d488d096b31371995babb79c23c391a0a6e4322a9e891c6d2c0e5b8a</a>
                <br />Burn AVO admin key - <a href="https://etherscan.io/tx/0xc21243899da8af8c6158f5bfd2892a785083b13c248a4f3c840a00f09145c9ed" target="_blank">0xc21243899da8af8c6158f5bfd2892a785083b13c248a4f3c840a00f09145c9ed</a>
                  <br />AVO setAllow - <a href="https://etherscan.io/tx/0x82ca75ff378ec33ea829d568532d2360e6342874a21507d774f2a1a11acbdd70" target="_blank">0x82ca75ff378ec33ea829d568532d2360e6342874a21507d774f2a1a11acbdd70</a>

                  <br />Liquidity AB created - <a href="https://etherscan.io/tx/0x99bc01dca43120618b63b02ac52b9904075fe3b587fe30a016ab8ce1c8065f8b" target="_blank">0x99bc01dca43120618b63b02ac52b9904075fe3b587fe30a016ab8ce1c8065f8b</a>
                  <br />Liquidity AB tokens burned - <a href="https://etherscan.io/tx/0x591619e7f357689a4ebf849bcad75471efc4ccfbb9e915534a1e24e54f70f9f1" target="_blank">0x591619e7f357689a4ebf849bcad75471efc4ccfbb9e915534a1e24e54f70f9f1</a>
                  <br />Liquidity B created - <a href="https://etherscan.io/tx/0x99bc01dca43120618b63b02ac52b9904075fe3b587fe30a016ab8ce1c8065f8b" target="_blank">0x99bc01dca43120618b63b02ac52b9904075fe3b587fe30a016ab8ce1c8065f8b</a>
                  <br />Liquidity B tokens sent to Pool B - <a href="https://etherscan.io/tx/0xbef2719e1224611d47ac0165189342ba46112a49553b80b63bb64289469787fd" target="_blank">0xbef2719e1224611d47ac0165189342ba46112a49553b80b63bb64289469787fd</a>

                  <br />Balancer pool created - <a href="https://etherscan.io/tx/0xb7cdbb7accc4f791d111d8611c578423a1f54bd48dbb9020afe030314df7f610" target="_blank">0xb7cdbb7accc4f791d111d8611c578423a1f54bd48dbb9020afe030314df7f610</a>
                  <br />24,999.9 AVO sent to Pool A - <a href="https://etherscan.io/tx/0x14f12530d1191281b6a809bc5f679f37243e805a3aa8a428be6dc6f0100ed3d4" target="_blank">0x14f12530d1191281b6a809bc5f679f37243e805a3aa8a428be6dc6f0100ed3d4</a>

                  <br />Pool A setRewardDistribution - <a href="https://etherscan.io/tx/0xfc6cd920e7a079a593b2b0951d51bc0a919d71351a6549daeb60e509e17bcbbe" target="_blank">0xfc6cd920e7a079a593b2b0951d51bc0a919d71351a6549daeb60e509e17bcbbe</a>
                  <br />Pool A setYFI - <a href="https://etherscan.io/tx/0x6fd06a5bb0075bd214605c858b861f492ac0e2732156e268ef2426046b61af87" target="_blank">0x6fd06a5bb0075bd214605c858b861f492ac0e2732156e268ef2426046b61af87</a>
                  <br />Pool A notifyRewardAmount - <a href="https://etherscan.io/tx/0x0fcab8478cb583f8a279cfdd9ff44bc6ec1248bb62b8c59ec407499f156a7ed7" target="_blank">0x0fcab8478cb583f8a279cfdd9ff44bc6ec1248bb62b8c59ec407499f156a7ed7</a>

                  <br />Pool B setRewardDistribution - <a href="https://etherscan.io/tx/0x58415779ebf3249388599d8f8b909db181cc8be0f945faa9d4928de4b32432bf" target="_blank">0x58415779ebf3249388599d8f8b909db181cc8be0f945faa9d4928de4b32432bf</a>
                  <br />Pool B setYFI - <a href="https://etherscan.io/tx/0xfee6a907ca330292e613d76cb8bc0ebbc30a75df43a728f6e0bd06cf95b73a07" target="_blank">0xfee6a907ca330292e613d76cb8bc0ebbc30a75df43a728f6e0bd06cf95b73a07</a>
                  <br />Pool B notifyRewardAmount - <a href="https://etherscan.io/tx/0xb78f2a39a2d2e81938bc4e80e4733a18d9436ffc66892b1189b9751bfa736d6a" target="_blank">0xb78f2a39a2d2e81938bc4e80e4733a18d9436ffc66892b1189b9751bfa736d6a</a>
                  <br />Pool B Proposal #3 update - <a href="https://etherscan.io/tx/0xef56fd24ccfe8aa656acb44da7accc624179118f671d1cd3764114dc3c8e90b2" target="_blank">0xef56fd24ccfe8aa656acb44da7accc624179118f671d1cd3764114dc3c8e90b2</a>

                  <br />EGGS token contract creation - <a href="https://etherscan.io/tx/0x04a0ee43f944e00de1419b3c005dc8ed87c3131482b0179dc5ed8a5aad6c4e6a" target="_blank">0x04a0ee43f944e00de1419b3c005dc8ed87c3131482b0179dc5ed8a5aad6c4e6a</a>
                  <br />Add deployer as EGGS minter - <a href="https://etherscan.io/tx/0x925e7486bff1f42b3cb7d8fc904d04ae2436e386af4c2bfc5f74c95c66282d45" target="_blank">0x925e7486bff1f42b3cb7d8fc904d04ae2436e386af4c2bfc5f74c95c66282d45</a>
                  <br />Mint 100,000 EGGS tokens - <a href="https://etherscan.io/tx/0x28df626b763c12e36346852c70fecfbd62ed9df56ae9d81b30a0528a69ea41f1" target="_blank">0x28df626b763c12e36346852c70fecfbd62ed9df56ae9d81b30a0528a69ea41f1</a>
                  <br />Remove EGGS minter - <a href="https://etherscan.io/tx/0xc2ceb524db7ff98c3f39f4ca575e980649dd070325e4da20b688704483ce9c27" target="_blank">0xc2ceb524db7ff98c3f39f4ca575e980649dd070325e4da20b688704483ce9c27</a>
                  <br />Burn EGGS admin key - <a href="https://etherscan.io/tx/0x10b543763276e3e999655424a734517047678ca82ad3d7658e80556de92dce81" target="_blank">0x10b543763276e3e999655424a734517047678ca82ad3d7658e80556de92dce81</a>
                  <br />EGGS setAllow - <a href="https://etherscan.io/tx/0x58b9b03d95b34926dd414f8ddb3919f5240a42ddb563a12c24ba4cf1267f5569" target="_blank">0x58b9b03d95b34926dd414f8ddb3919f5240a42ddb563a12c24ba4cf1267f5569</a>
                  <br />Pool C contract creation - <a href="https://etherscan.io/tx/0xd2c48a53f72a2e6d3540f7e6bc7b4a3a1eee866f040c5c64db897f25d0ef9d7c" target="_blank">0xd2c48a53f72a2e6d3540f7e6bc7b4a3a1eee866f040c5c64db897f25d0ef9d7c</a>
                  <br />50,000 EGGS sent to Pool C - <a href="https://etherscan.io/tx/0x6d48da2c83e770c69b18b8b6fdd388d118d01377675537e4de1b7501751f3079" target="_blank">0x6d48da2c83e770c69b18b8b6fdd388d118d01377675537e4de1b7501751f3079</a>
                  <br />Pool C setRewardDistribution - <a href="https://etherscan.io/tx/0x92c79ce6d036f9b06da1ca4b235cfaed9541a150e89685803f88788f90b2527f" target="_blank">0x92c79ce6d036f9b06da1ca4b235cfaed9541a150e89685803f88788f90b2527f</a>
                  <br />Pool C setYFI - <a href="https://etherscan.io/tx/0xe7da793b32b1b0502c94f1874fbe929d9b891e2b3fec2932a5d196b620871b20" target="_blank">0xe7da793b32b1b0502c94f1874fbe929d9b891e2b3fec2932a5d196b620871b20</a>
                  <br />Pool C notifyRewardAmount - <a href="https://etherscan.io/tx/0x34045b37649c1fbb63a214714f1ec06a9148038c10e1df2507db3649c47cb292" target="_blank">0x34045b37649c1fbb63a214714f1ec06a9148038c10e1df2507db3649c47cb292</a>
                  <br />DAI/EGGS Balancer pool created - <a href="https://etherscan.io/tx/0xa9f3967e535ceca852f86d3f130e7b3ca6f9de4c375181fd3910de2537cade3d" target="_blank">0xa9f3967e535ceca852f86d3f130e7b3ca6f9de4c375181fd3910de2537cade3d</a>
                  <br />Pool D contract creation - <a href="https://etherscan.io/tx/0x81ec9daae7acc9a45b4dc3351cd8178e6c55c1418f826a63d170d929877de8eb" target="_blank">0x81ec9daae7acc9a45b4dc3351cd8178e6c55c1418f826a63d170d929877de8eb</a>
                  <br />49,999.9 EGGS sent to Pool D - <a href="https://etherscan.io/tx/0xc616712cadeca577f459862d077d753efb23eb0fcd374f8bdc8528e9c518b76b" target="_blank">0xc616712cadeca577f459862d077d753efb23eb0fcd374f8bdc8528e9c518b76b</a>
                  <br />Pool D setRewardDistribution - <a href="https://etherscan.io/tx/0xec5be46a4c67a02d0bb8a76eac495400eb5b7a4a7ec8b157180cf878d04c1e58" target="_blank">0xec5be46a4c67a02d0bb8a76eac495400eb5b7a4a7ec8b157180cf878d04c1e58</a>
                  <br />Pool D setYFI - <a href="https://etherscan.io/tx/0x1101449cfd94c9e9a4739819ed0bc2f2ccefba5cd86a1fb8e5706fa037203208" target="_blank">0x1101449cfd94c9e9a4739819ed0bc2f2ccefba5cd86a1fb8e5706fa037203208</a>
                  <br />Pool D notifyRewardAmount - <a href="https://etherscan.io/tx/0xbe1eb0186b5057caaba86a1208e2f01e266fe458ef3cb3dfdb94c26adab9211e" target="_blank">0xbe1eb0186b5057caaba86a1208e2f01e266fe458ef3cb3dfdb94c26adab9211e</a>
 </Typography>
            </div>
        )
    }

    renderRewards = () => {
        const {rewardPools, governanceContractVersion} = this.state

        return rewardPools.filter((rewardPool) => {
            if (['Uniswap', 'Balancer', 'PoolC', 'PoolD'].includes(rewardPool.id)) {
                return true
            } else {
                return false
            }
        }).map((rewardPool) => {
            return this.renderRewardPool(rewardPool)
        })
    }

    renderRewardPool = (rewardPool) => {

        const {classes} = this.props

        var address = null;
        let addy = ''
        if (rewardPool.tokens && rewardPool.tokens[0]) {
            addy = rewardPool.tokens[0].rewardsAddress
            address = addy.substring(0, 6) + '...' + addy.substring(addy.length - 4, addy.length)
        }

        return (<div className={classes.rewardPoolContainer} key={rewardPool.id}>
            <img src={rewardPool.tokens[0].iconImg} width="70" style={{display: 'block', margin: 'auto', marginTop: '0px', marginBottom: '17px'}}/>
            <Typography variant='h3' className={classes.poolName}>{rewardPool.name}</Typography>
            <Typography varian='h5' className={classes.tokensList} align='center'>
                Stake {rewardPool.tokens[0].symbol} for {rewardPool.tokens[0].rewardsSymbol}
            </Typography>
            <Button
                className={classes.stakeButtontwo} 
                onClick={() => {
                    if (rewardPool.tokens.length > 0) {
                        this.navigateStake(rewardPool)
                    }
                }}
            >
                <Typography variant={'h4'}>{rewardPool.stakingName}</Typography>
            </Button>
            <Typography style={{ width: "100%", textAlign: "center" }}><a className={classes.stakeButton} href={rewardPool.link} target="_blank">Get {rewardPool.tokens[0].symbol}</a></Typography>

        </div>)
    }

    navigateStake = (rewardPool) => {
        store.setStore({currentPool: rewardPool})

        this.props.history.push('/stake')
    }

    renderModal = () => {
        return (
            <UnlockModal closeModal={this.closeModal} modalOpen={this.state.modalOpen}/>
        )
    }

    overlayClicked = () => {
        this.setState({modalOpen: true})
    }

    closeModal = () => {
        this.setState({modalOpen: false})
    }

}

export default withRouter(withStyles(styles)(RewardPools));
