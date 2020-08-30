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
        maxWidth: '600px',
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
        padding: '14px 15px',
        borderRadius: '50px',
        border: '1px solid ' + colors.borderBlue,
        alignItems: 'center',
        maxWidth: '500px',
        float: 'right',
        position: 'absolute',
        right: '15px',
        top: '15px',
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
        paddingTop: '20px',
        flexWrap: 'wrap'
    },
    rewardPoolContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '28px 30px',
        borderRadius: '50px',
        border: '1px solid ' + colors.borderBlue,
        margin: '20px',
        background: colors.white,
        minHeight: '300px',
        minWidth: '200px',
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
        color: colors.darkGray,
        paddingBottom: '20px',
    },
    poolWebsite: {
        color: colors.darkGray,
        paddingBottom: '20px',
        textDecoration: 'none'
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
                    <Button
                        variant="outlined"
                        color="secondary"
                        href={"https://t.me/toastfinance"}
                        target="_blank"
                        style={{display: "inline"}}
                    >
                        <Typography variant={'h4'}>Telegram</Typography>
                    </Button>

                    <Card className={classes.addressContainer} onClick={this.overlayClicked}>
                        <div style={{
                            background: '#DC6BE5',
                            opacity: '1',
                            borderRadius: '10px',
                            width: '10px',
                            height: '10px',
                            marginRight: '3px',
                            marginTop: '3px',
                            marginLeft: '6px'
                        }}></div>
                        <Typography variant={'h4'} className={classes.walletAddress} noWrap>{address}</Typography>
                    </Card>

                    <Typography variant={'h5'} className={classes.disaclaimer}><img src="/feature.jpg"
                                                                                    width="400"/><br/><br/>The choice is
                        yours.<br /><br /></Typography>

                    <Button
                        variant="outlined"
                        color="secondary"
                        href={"https://uniswap.info/pair/0xbdde248cfe84258e16dbf3911c1ce9c93beb3eb9"}
                        target="_blank"
                    >
                        <Typography variant={'h4'}>AVO-HOUSE Uniswap pair</Typography>
                    </Button>

                    <div className={classes.rewardPools}>
                        {
                            this.renderRewards()
                        }
                    </div>
                    <hr />
                    {modalOpen && this.renderModal()}
                </div>
              <Typography variant={'h5'} className={classes.footer}><br /><br />Toast.finance is an untested clone of ZZZ.finance (itself based on YFI - ygov.finance). The main difference between ZZZ.finance and Toast.finance is that instead of having one token initially, there are two that work together - $HOUSE and $AVO. Apart from this, the important features of ZZZ remain true for Toast.finance - there are no dev wallets or funds, no presale, no airdrop, no early wallets. 100% owned by the community. The tokens have no inherent value and any value is up to the community. 20,000 $HOUSE and 100,000 $AVO were minted and all tokens were sent directly to the appropriate pools.
                <br /><br /><u>$AVO tokenomics:</u><br />Total supply: 100,000 AVO<br />Decimals: 18 (spread that avo around)<br />Supply sent Pool A: 25,000 AVO to Pool A<br />Supply sent to Uniswap: 75,000 AVO to Pool AB
                <br /><br /><u>$HOUSE tokenomics:</u><br />Total supply: 20,000 HOUSE<br />Decimals: 0 (no subdividing)<br />Supply sent to Uniswap: 5,000 HOUSE to Pool AB<br />Supply sent to Uniswap: 15,000 HOUSE to Pool B
                <br /><br /><u>Pool A:</u><br />Pool A is a 98%/2% DAI/AVO Balancer pool.<br />To contribute to Pool A, you need to add DAI and AVO into the Balancer pool, which will give you BPT tokens. You can then stake your BPT tokens here by clicking "Farm more avocados" to receive a share of the 25,000 AVO tokens reserved for Pool A rewards.
                <br /><br /><u>Pool AB:</u><br />Pool AB is a AVO/HOUSE Uniswap liquidity pool.<br />75,000 AVO and 5,000 HOUSE have been sent here and the UNI-V2 pool tokens have been burned. Liquidity is locked.
                <br /><br /><u>Pool B:</u><br />Pool B is a HOUSE/ETH Uniswap liquidity pool.<br />15,000 HOUSE and 3 ETH have been sent here and the UNI-V2 pool tokens have been locked into the Pool B contract. Click "Earn income from your house" here, and you can stake your $HOUSE to get a share of these UNI-V2 tokens (which you can exchange for their worth in ETH and HOUSE).
              </Typography>
              <Typography variant={'h5'} className={classes.footer} style={{textAlign: 'left'}}>
                <br /><br /><u>Addresses:</u>
                <br />Toast.finance Deployer - <a href="https://etherscan.io/address/0x6cef9EcD79e87F8a88143eE9b464119bB296dA8b" target="_blank">0x6cef9EcD79e87F8a88143eE9b464119bB296dA8b</a>
                  <br />HOUSE token - <a href="https://etherscan.io/address/0x19810559df63f19cfe88923313250550edadb743" target="_blank">0x19810559df63f19cfe88923313250550edadb743</a>
                  <br />AVO token - <a href="https://etherscan.io/address/0x774adc647a8d27947c8d7c098cdb4cdf30b126de" target="_blank">0x774adc647a8d27947c8d7c098cdb4cdf30b126de</a>
                  <br />Pool A - <a href="https://etherscan.io/address/0x45352f928af429a01909b28e66b208c05de4df67" target="_blank">0x45352f928af429a01909b28e66b208c05de4df67</a>
                  <br />Pool B - <a href="https://etherscan.io/address/0xc18109c4fee0b915cee8c56d65cc1b44c866aa35" target="_blank">0xc18109c4fee0b915cee8c56d65cc1b44c866aa35</a>
                  <br />Uniswap HOUSE-ETH pair - <a href="https://uniswap.info/pair/0x2209b8260110af927AF0f2Eb96db471aE3Ab05EA" target="_blank">0x2209b8260110af927AF0f2Eb96db471aE3Ab05EA</a>
                  <br />Uniswap HOUSE-AVO pair - <a href="https://uniswap.info/pair/0xbdde248cfe84258e16dbf3911c1ce9c93beb3eb9" target="_blank">0xbdde248cfe84258e16dbf3911c1ce9c93beb3eb9</a>
                  <br />Balancer DAI-AVO pool - <a href="https://pools.balancer.exchange/#/pool/0xcfcdb690bdc88f43f7cac7d968d0d66d2118ad20/" target="_blank">0xcfcdb690bdc88f43f7cac7d968d0d66d2118ad20</a>

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

                <br />Pool A setRewardDistribution<a href="https://etherscan.io/tx/0xfc6cd920e7a079a593b2b0951d51bc0a919d71351a6549daeb60e509e17bcbbe" target="_blank">0xfc6cd920e7a079a593b2b0951d51bc0a919d71351a6549daeb60e509e17bcbbe</a>
                  <br />Pool A setYFI<a href="https://etherscan.io/tx/0x6fd06a5bb0075bd214605c858b861f492ac0e2732156e268ef2426046b61af87" target="_blank">0x6fd06a5bb0075bd214605c858b861f492ac0e2732156e268ef2426046b61af87</a>
                  <br />Pool A notifyRewardAmount<a href="https://etherscan.io/tx/0x0fcab8478cb583f8a279cfdd9ff44bc6ec1248bb62b8c59ec407499f156a7ed7" target="_blank">0x0fcab8478cb583f8a279cfdd9ff44bc6ec1248bb62b8c59ec407499f156a7ed7</a>

                  <br />Pool B setRewardDistribution<a href="https://etherscan.io/tx/0x58415779ebf3249388599d8f8b909db181cc8be0f945faa9d4928de4b32432bf" target="_blank">0x58415779ebf3249388599d8f8b909db181cc8be0f945faa9d4928de4b32432bf</a>
                  <br />Pool B setYFI<a href="https://etherscan.io/tx/0xfee6a907ca330292e613d76cb8bc0ebbc30a75df43a728f6e0bd06cf95b73a07" target="_blank">0xfee6a907ca330292e613d76cb8bc0ebbc30a75df43a728f6e0bd06cf95b73a07</a>
                  <br />Pool B notifyRewardAmount<a href="https://etherscan.io/tx/0xb78f2a39a2d2e81938bc4e80e4733a18d9436ffc66892b1189b9751bfa736d6a" target="_blank">0xb78f2a39a2d2e81938bc4e80e4733a18d9436ffc66892b1189b9751bfa736d6a</a>

                  <br /><br /><u>Credits:</u>
                  <br />Toast icon thanks to <a href={"https://www.iconfinder.com/"} target={"_blank"}>Iconfinder</a>.<br />"The Millennial's Dilemma" meme thanks to unknown artist.
              </Typography>
            </div>
        )
    }

    renderRewards = () => {
        const {rewardPools, governanceContractVersion} = this.state

        return rewardPools.filter((rewardPool) => {
            if (['Uniswap', 'Balancer'].includes(rewardPool.id)) {
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
            <Typography variant='h3' className={classes.poolName}>{rewardPool.name}</Typography>
            <Typography variant='h5' className={classes.poolWebsite}><a href={rewardPool.link} target="_blank">Get {rewardPool.tokens[0].symbol}</a></Typography>
            <Typography varian='h5' className={classes.tokensList} align='center'>
                Stake {rewardPool.tokens[0].symbol} for {rewardPool.tokens[0].rewardsSymbol}.
            </Typography>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                    if (rewardPool.tokens.length > 0) {
                        this.navigateStake(rewardPool)
                    }
                }}
            >
                <Typography variant={'h4'}>{rewardPool.stakingName}</Typography>
            </Button>
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
