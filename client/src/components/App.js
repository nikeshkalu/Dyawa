import React,{Component} from 'react'
// import Blocks from './Blocks'
import {Link} from 'react-router-dom'

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
            <div>
                <div>
                Welcome to Dyawa Projects
                </div>
                <hr/>
                wallet:
                <div> Address:{address}</div>
                <div>Balance:{balance}</div>
                <br/>
                <div>
                    <Link to='/blocks'>Blocks</Link><br/>
                    <Link to='/conductTransaction'>Conduct Transaction</Link>

                </div>
               
            </div>
        )
    }
}

export default App