import React,{Component} from 'react'
import Transaction from './Transaction'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { motion } from "framer-motion"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class Block extends Component{
    render(){
        const {timeStamp,data,hash,lastHash,nonce,difficulty} = this.props.block
        var blockNumber = this.props.index
        // const hashDisplay = `${hash.subString(0,15)}...`
        const stringyfiedData = JSON.stringify(data)
        // const dataDisplay = stringyfiedData.length>35?`${stringyfiedData.subString(0,35)}...`:stringyfiedData


        return(
            <div style={{
                alignItems:"center",
                 textAlign : "center",
                 maxWidth : 900,
                 minWidth : 200,
                 alignContent : "center",
                 margin : "auto",
                 }}>
            <Grid >
                <motion.div
                whileHover={{
                    scale: 1.005,
                    transition: { duration: 0.5 },
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
                 }}>
                    <Paper style={{
                        textAlign : "left",
                        maxHeight : 10000,
                        fontSize : 18,
                        alignContent : "center",
                        alignItems : "center",
                        padding : 30,
                        overflow : "auto",
                        flexGrow: 1,

                        // background:"linear-gradient(45deg, rgb(79, 0, 150), rgb(41, 171, 226))",
                    }}>  
                          Previous Hash: <i style={{fontSize:15,overflow:"auto",color:"green"}}>
                                    {lastHash}
                                        </i><br/>  

                           Hash: <i style={{fontSize:15,overflow:"auto",color:"green"}}>
                               {hash}
                                </i><br/>

                           Nonce : {nonce}<br/>

                           Difficulty : {difficulty}     
                
                                
                                <div style={{overflow:"auto"}}>
                                    Data : {
                                        data.map(transaction =>{
                                            return(
                                                <div key={transaction.id}>
                                                    <Transaction transaction={transaction}/>
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                <br/>
                                </div>
                               
                                    <div style={{fontSize:40,overflow:"auto"}}>
                                        Block #{blockNumber} 
                                        <i style={{fontSize:15,paddingLeft:30}}>
                                            Mined on {new Date(timeStamp).toLocaleDateString()}
                                        </i>

                                    </div>
                                    
                                    
                                    
                               
                               

                        </Paper>
                  </motion.div>      
                </Grid>
                <ExpandMoreIcon style={{fontSize : 50}}/><br></br>
                
             </div>

           
        )
    }
}

export default Block