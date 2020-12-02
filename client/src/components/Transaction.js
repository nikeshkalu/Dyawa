import React from 'react'

const Transaction = (props) =>{
    const {input,outputMap} = props.transaction
    const recepients = Object.keys(outputMap)

    return(
        <div style={{fontSize:15}}>
            <div>
                From : {input.address} <br></br>
                {/* Balance : {input.amount} */}
            </div>
            {
                recepients.map(recepient =>{
                    return(
                        <div key={recepient}>
                            To : {recepient} <br/>
                            Sent : {outputMap[recepient]}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Transaction