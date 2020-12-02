import React,{Component} from 'react'
import Transaction from './Transaction'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { motion } from "framer-motion"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class Block extends Component{
    render(){
        const {timeStamp,data,hash} = this.props.block

        // const hashDisplay = `${hash.subString(0,15)}...`
        const stringyfiedData = JSON.stringify(data)
        // const dataDisplay = stringyfiedData.length>35?`${stringyfiedData.subString(0,35)}...`:stringyfiedData


        return(
            <div style={{
                alignItems:"center",
                 textAlign : "center",
                 width : 900,
                 alignContent : "center",
                 margin : "auto"
                 }}>
            <Grid >
                <motion.div
                whileHover={{
                    scale: 1.005,
                    transition: { duration: 0.5 },
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
                 }}>
                    <Paper style={{
                        textAlign : "center",
                        maxHeight : 10000,
                        fontSize : 18,
                        alignContent : "center",
                        alignItems : "center",
                        // paddingTop : 18,
                        overflow : "auto",
                        flexGrow: 1,

                        // background:"linear-gradient(45deg, rgb(79, 0, 150), rgb(41, 171, 226))",
                    }}>                       
                           
                           Hash: <div style={{fontSize:15,overflow:"auto"}}><br></br>
                                   {hash}
                                </div><br/>
                                <div>
                                    TimeStamp : {new Date(timeStamp).toLocaleDateString()}
                                </div>
                                <div>
                                    Data : {
                                        data.map(transaction =>{
                                            return(
                                                <div key={transaction.id}>
                                                    <Transaction transaction={transaction}/>
                                                    
                                                </div>
                                            )
                                        })
                                    }

                                    
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