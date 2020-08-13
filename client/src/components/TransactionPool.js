import React,{Component} from 'react'
import Transaction from './Transaction'

const POOL_INTERVAL_MS = 10000
class TransactionPool extends Component{
    state = {transactionPoolMap : {} }

    fetchTransactionPoolMap = () =>{
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
  
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
            </div>
        )
    }
}

export default TransactionPool