import React,{Component} from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import history from '../history'

class ConductTransaction extends Component{
    state = {recepient:'',amount:0}

    render(){
        const onSubmit=(e)=>{
            e.preventDefault();
            const {recepient,amount} = this.state
            console.log(this.state)
            
            fetch(`${document.location.origin}/api/transact`,{
                method : 'POST',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify({recepient,amount})
            }).then(response => response.json())
              .then(json => {
                  alert(json.message || json.type)
                //   history.push('/transaction-pool')
                  location.reload();
                  
              });

          }
        
        return(
            <div style={{color : "white"}}>
                <br/><br/>
                <div>Conduct Transaction</div>
                <form noValidate onSubmit={onSubmit} >
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        // fullWidth
                        id="recepient"
                        label="Recepient address"
                        name="recepient"
                        autoComplete="recepient"
                        autoFocus
                        onChange={(event)=>this.setState({recepient:event.target.value})}
                        style = {{
                            border: '1px solid #e2e2e1',
                            overflow: 'hidden',
                            borderRadius: 6,
                            // backgroundColor: '#fcfcfb',
                            '&:hover': {
                            backgroundColor: 'linear-gradient(45deg, rgb(49, 42, 108), rgb(133, 45, 145))',
                            },
                            '&$focused': {
                            backgroundColor: 'linear-gradient(45deg, rgb(49, 42, 108), rgb(133, 45, 145))',
                            borderColor: 'white',
                            },

                        }}
                        // ref={register}
                    />
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        // fullWidth
                        name="amount"
                        label="Amount"
                        id="amount"
                        autoComplete="Amount"
                        onChange={(event)=>this.setState({amount:event.target.value})}
                        style = {{
                            border: '1px solid #e2e2e1',
                            overflow: 'hidden',
                            borderRadius: 6,
                            // backgroundColor: '#fcfcfb',
                            '&:hover': {
                            backgroundColor: 'linear-gradient(45deg, rgb(49, 42, 108), rgb(133, 45, 145))',
                            },
                            '&$focused': {
                            backgroundColor: 'linear-gradient(45deg, rgb(49, 42, 108), rgb(133, 45, 145))',
                            borderColor: 'white',
                            },

                        }}
                    />

                        <br/>
                        <br/>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        // className={classes.submit}
                        >
                        Conduct Transaction
                    </Button>
            </form>

            </div>
        )
    }
}

export default ConductTransaction