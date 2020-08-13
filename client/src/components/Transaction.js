import React from 'react'

const Transaction = (props) =>{
    const {input,outputMap} = props.transaction
    const recepients = Object.keys(outputMap)

    return(
        <div>
            <div>
                From : {input.address} |
                Balance : {input.amount}
            </div>
            {
                recepients.map(recepient =>{
                    return(
                        <div key={recepient}>
                            To : {recepient} | 
                            Sent : {outputMap[recepient]}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Transaction