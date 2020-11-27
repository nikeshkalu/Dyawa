import React,{Component} from 'react'
// import Blocks from './Blocks'
import {Link} from 'react-router-dom'
import TransactionPool from './TransactionPool';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ConductTransaction from './conductTransaction';
import Main from './Main';
import { motion } from "framer-motion"


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
                <motion.div
                whileHover={{
                    scale: 1.005,
                    transition: { duration: 0.5 },
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
                 }}>
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
                  </motion.div>      
                </Grid>
                    <br/>
                    <br/>
                    <br/>
                <Main balance={balance}/>

                <br/><br/>
                

                
                </div>
                
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