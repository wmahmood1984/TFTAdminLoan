import React, { useState,useEffect } from 'react'
import "../App.css"
import { useSelector,useDispatch } from 'react-redux'
import { LStakinga, TFTApprove, Price, LUnStakinga, BUSDApprove } from '../state/ui';
import DailyTimer from '../Components/DailyTimer';


export default function Loan() {
    const dispatch = useDispatch()

    const [ TFT,setTFT] = useState();
    const [ Scheme,setScheme] = useState();

    const toggle = useSelector((state)=>{
        return  state.adoptReducer.toggle; 
       
       });

    useEffect(()=>{

 
        dispatch(Price({BNB:0,BUSD:0}))
    
      },[toggle])



    const _TFTAllowance = useSelector((state)=>{
        return  state.adoptReducer.TFTAllowance; 
       
       });
    
    const _indStakingInf = useSelector((state)=>{
        return  state.adoptReducer.indLoanInf; 
       
       });

    var filteredInfo = _indStakingInf && _indStakingInf.filter(item=>item.quantity>0)

    
    const _BUSDAllowance = useSelector((state)=>{
      return  state.adoptReducer.BUSDAllowance; 
     
     });

  
         
    function Stake() {
        if( Number(_TFTAllowance)/100000000 >= TFT){
            dispatch(LStakinga({_qty:TFT,Scheme}))
        }else{
            dispatch(TFTApprove({quantity :  TFT}))
        }
    }

    function Unstake(id,dollar){
      if(_BUSDAllowance>=dollar){
        dispatch(LUnStakinga({id}))
      }
      else{
        dispatch(BUSDApprove({quantity: dollar}))
      }

    }



    window.ethereum.on("accountsChanged",(e,r)=>{window.location.reload()})
    window.ethereum.on("chainChanged",(e,r)=>{window.location.reload()})
    
    var currentTime = new Date().getTime() / 1000
 



    return (
    <div className='AdminBlock'>

    <div style={{border:"1px solid black"}}>
      <p>TFT Amount for Loan{" "}
      <input 
      type="value"
      placeholder='enter TFT value here'
      value={TFT}

      onChange={(e)=>{
        setTFT(e.target.value)

        }}
      />
        </p>

        <p>Choose Scheme{" "}
      <input 
      type="value"
      placeholder='Press 1 for 30 days and 2 for 45 days'
      value={Scheme}

      onChange={(e)=>{
        setScheme(e.target.value)

        }}
      />
        </p>

      <button 

      onClick={Stake}>{Number(_TFTAllowance/100000000) >= TFT ?  "Stake" : "Approve"}</button>
      </div>

      <div>
      <table style={{border : "2px solid forestgreen", width: "500px", minHeight: "30px",textAlign: "center", }}>
            <thead>
            <tr>
                <th style={{borderBottom: "2px solid forestgreen", borderRight:"2px solid forestgreen" , backgroundColor:"burlywood" }}>Id</th>
                <th style={{borderBottom: "2px solid forestgreen" , borderRight: "2px solid forestgreen", backgroundColor:"burlywood"}}>Amount</th>
                <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Time to Daily return</th>
                
                <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>UnStaking</th>
                </tr>
            </thead>
            <tbody>
            {_indStakingInf &&  filteredInfo.map((val, key) => {
                return (
                    <tr key={key}>
                    <td style={{borderRight: "2px solid forestgreen",  backgroundColor: "transparent",  fontWeight:"bold"}}>{val.stakingId}</td>
                    <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent",  fontWeight:"bold" }}>{val.quantity/100000000}</td>
                    <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent",  fontWeight:"bold"}}>
                        { Number(val.timeOfInvestment)+(60*60*24) - currentTime > 0 ? <DailyTimer time={Number(val.timeOfInvestment)+(60*60*24)}/> :  val.daily/100000000 } </td>
                
                    <td><button onClick={()=>{Unstake(val.stakingId,val.dollarGiven)}}>{_BUSDAllowance>= val.dollarGiven? "Unstake" : "Approve BUSD for Unstake"}</button></td>
                    </tr>
                )
                })}

                
            </tbody>
            <tfoot></tfoot>
                
                
            </table>
      </div>

    </div>
  )
}
