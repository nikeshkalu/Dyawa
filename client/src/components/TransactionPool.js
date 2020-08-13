import React,{Component} from 'react'
import Transaction from './Transaction'
import Button from '@material-ui/core/Button';
import history from '../history'

const POOL_INTERVAL_MS = 10000
class TransactionPool extends Component{
    state = {transactionPoolMap : {} }

    fetchTransactionPoolMap = () =>{
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
  
    }
    
    fetchMineTransaction = () =>{
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if(response.status == 200){
                    alert('Mine successful')
                       history.push('/blocks')
                       location.reload();
                }
                else{
                    alert('Mine Unsuccesful')
                }

              
               
            })

            // .then(json => this.setState({ transactionPoolMap: json }));
    }

    componentDidMount(){
        this.fetchTransactionPoolMap()

        this.fetchPoolMapInterval = setInterval(
            ()=>this.fetchTransactionPoolMap(),
            POOL_INTERVAL_MS
            )
    }

    componentWillMount(){
        clearInterval(this.fetchPoolMapInterval)
    }

    render(){
        return(
            <div>
                <div>
                    <h3>Transaction Pool</h3>
                    {
                        Object.values(this.state.transactionPoolMap).map(transaction =>{
                            return(
                                <div key={transaction.id}>
                                   <Transaction transaction={transaction}/> 
                                   <hr/>
                                </div>
                            )
                        })
                    }
                </div>
              <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={this.fetchMineTransaction}
                        // className={classes.submit}
                        >
                        Mine Transaction
                    </Button>
            </div>
        )
    }
}

export default TransactionPool