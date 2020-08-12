import React,{Component} from 'react'
import Blocks from './Blocks'

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
                <Blocks/>
               
            </div>
        )
    }
}

export default App