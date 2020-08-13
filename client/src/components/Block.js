import React,{Component} from 'react'
import Transaction from './Transaction'

class Block extends Component{
    render(){
        const {timeStamp,data,hash} = this.props.block

        // const hashDisplay = `${hash.subString(0,15)}...`
        const stringyfiedData = JSON.stringify(data)
        // const dataDisplay = stringyfiedData.length>35?`${stringyfiedData.subString(0,35)}...`:stringyfiedData


        return(
            <div>
                <div>
                    Hash : {hash}
                </div>
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
                    {/* {stringyfiedData} */}
                </div>
                <hr/>
            </div>
        )
    }
}

export default Block