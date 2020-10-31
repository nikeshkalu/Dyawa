import React,{Component} from 'react'
// import Blocks from './Blocks'
import {Link} from 'react-router-dom'
import TransactionPool from './TransactionPool';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ConductTransaction from './conductTransaction';

class App extends Component{
 
  state = { walletInfo: {} };
    
  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));
  }

    render(){
        const {address,balance} = this.state.walletInfo
        return(
            <div style={{
                fontFamily : "Comic Sans MS, cursive, sans-serif",
                padding : 15
            }}>
                <div>
                <Grid >
                    <Paper style={{
                        textAlign : "center",
                        height : 40,
                        fontSize : 18,
                        alignItems : "center",
                        paddingTop : 18,
                        background:"linear-gradient(45deg, rgb(79, 0, 150), rgb(41, 171, 226))",
                        color: "white"      
                    }}>                       
                          ADDRESS {address}  
                        </Paper>
                </Grid>

                <br/><br/>
                <Grid container 
                    spacing={10}
                    direction="row"
                    justify="center"
                    alignItems="center"
                   
                    >
                        <Grid item xs={1} sm={3} 
                            >
                            <Paper style={{
                               height: 200,
                               width: 200,
                               textAlign: 'center',
                               background:"linear-gradient(45deg, rgb(79, 0, 188), rgb(41, 171, 226))",
                               flexGrow: 1
                                 }}>
                                     <br/><br/><br/>
                                     <div style={{fontSize:50,color:"white"}}>{balance}</div>
                                     <br/>
                                     <div style={{color:"white",fontSize:20}}>BALANCE</div></Paper>
                        </Grid>
                        
                        <Grid item xs={1} sm={3} >
                            <Paper style={{
                                height: 350,
                                textAlign: 'center',
                                flexGrow: 1,
                                background:"linear-gradient(45deg, rgb(49, 42, 108), rgb(133, 45, 145))"                 
                              
                            }}>
                                <br/><ConductTransaction/>
                            </Paper>
                        </Grid>

                        <Grid item xs={1} sm={5} >
                            <Paper style={{
                                textAlign: 'center',
                                height: 550,
                               background:"linear-gradient(45deg, rgb(69, 20, 90), rgb(255, 83, 0))",
                               flexGrow: 1
                            }}>
                                <TransactionPool/></Paper>
                        </Grid>
                </Grid>

                
                </div>
                
                {/* <div>Wallet Balance:{balance}</div> */}
                <br/>
                <div>
                    <hr style={{paddingLeft:20,paddingRight:20}}></hr>
                    <Link to='/blocks'>Blocks</Link><br/>
                    {/* <Link to='/transaction-pool'>Transaction Pool</Link> */}
                    {/* <Link to='/conductTransaction'>Conduct Transaction</Link><br/> */}
                    

                </div>
               
            </div>
        )
    }
}

export default App