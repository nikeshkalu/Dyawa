import React from 'react'
import ReactDOM from 'react-dom'
import {Router,Switch,Route,BrowserRouter} from 'react-router-dom'
import App from './components/App'
import history from './history'
import Blocks from './components/Blocks'
import ConductTransaction from './components/conductTransaction'

ReactDOM.render(
  // <BrowserRouter forceRefresh={true}>
  <BrowserRouter>
  <Switch>
        <Route exact path="/" component={App}/>
        <Route exact path="/blocks" component={Blocks} />
        <Route exact path="/conductTransaction" component={ConductTransaction} />


      </Switch>
</BrowserRouter>,
    
    document.getElementById('root')
  );
  
