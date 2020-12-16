import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import FormLabel from '@material-ui/core/FormLabel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import ConductTransaction from './conductTransaction';
import TransactionPool from './TransactionPool';
import { motion } from "framer-motion"




const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(5),
  },
}));

export default function Main({balance}) {
  const [spacing, setSpacing] = React.useState(10);
  const classes = useStyles();

  

  return (
    <Grid container className={classes.root} spacing={5}>
      <Grid item xs={12}>
        <Grid container justify="space-evenly" spacing={spacing} direction="row" alignItems="center" >

             <Grid item>
             <motion.div
              whileHover={{
                scale: 1.005,
                transition: { duration: 0.5 },
                boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
              }}>

                 <Paper style={{
                               height: 200,
                               width: 200,
                            //    paddingRight : 100, 
                               textAlign: 'center',
                               background:"linear-gradient(45deg, rgb(79, 0, 188), rgb(41, 171, 226))",
                               flexGrow: 1,
                                 }}>
                                     <br/><br/><br/>
                                     <div style={{fontSize:50,color:"white"}}>{balance}</div>
                                     <br/>
                                     <div style={{color:"white",fontSize:20}}>BALANCE</div>
                </Paper>
                </motion.div>

             </Grid>
            
             <Grid item >
             <motion.div
              whileHover={{
                scale: 1.005,
                transition: { duration: 0.5 },
                boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
              }}>
                <Paper style={{
                                height: 350,
                                textAlign: 'center',
                                flexGrow: 1,
                                background:"linear-gradient(45deg, rgb(49, 42, 108), rgb(133, 45, 145))",
                                // background : "linear-gradient(45deg, rgb(79, 0, 150), rgb(41, 171, 226))",
                                width : 290,
                            }}>
                                <br/><ConductTransaction/>
                </Paper>
               </motion.div> 

            </Grid>

            <Grid item>
            <motion.div
              whileHover={{
                scale: 1.005,
                transition: { duration: 0.5 },
                boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",

              }}>

                <Paper style={{
                                textAlign: 'center',
                                height: 550,
                               background:"linear-gradient(45deg, rgb(69, 20, 90), rgb(255, 83, 0))",
                              // background : "linear-gradient(45deg, rgb(79, 0, 150), rgb(41, 171, 226))",
                               flexGrow: 1,
                               width : 330,

                            }}>
                                <TransactionPool/>
                </Paper>
            </motion.div>

            </Grid>
           
        </Grid>
      </Grid>
    </Grid>
  );
}
