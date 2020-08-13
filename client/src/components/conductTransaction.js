import React,{Component} from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
              });

          }
        
        return(
            <div>
                <div>Conduct Transaction</div>
                <form noValidate onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="recepient"
                        label="Recepient"
                        name="recepient"
                        autoComplete="recepient"
                        autoFocus
                        onChange={(event)=>this.setState({recepient:event.target.value})}
                        // ref={register}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="amount"
                        label="Amount"
                        id="amount"
                        autoComplete="Amount"
                        onChange={(event)=>this.setState({amount:event.target.value})}
                    />

                        
                    <Button
                        type="submit"
                        fullWidth
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