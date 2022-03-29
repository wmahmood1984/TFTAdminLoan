import React, { useState,useEffect } from 'react'
import "../App.css"
import { useSelector,useDispatch } from 'react-redux'
import { Stakinga, TFTApprove, Price, UnStakinga } from '../state/ui';
import DailyTimer from '../Components/DailyTimer';


export default function Staking() {
    const dispatch = useDispatch()
    const [ TFT,setTFT] = useState();

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
        return  state.adoptReducer.indStakingInf; 
       
       });

    var filteredInfo = _indStakingInf && _indStakingInf.filter(item=>item.quantity>0)

    const _indRewardInf = useSelector((state)=>{
        return  state.adoptReducer.indRewardInf; 
       
       });

     console.log("reward",_indRewardInf)  
  
         
    function Stake() {
        if( Number(_TFTAllowance)/100000000 >= TFT){
            dispatch(Stakinga({_qty:TFT}))
        }else{
            dispatch(TFTApprove({quantity :  TFT}))
        }
    }

    function Unstake(id){
        dispatch(UnStakinga({id}))
    }

    console.log("staking info",_indStakingInf)

    window.ethereum.on("accountsChanged",(e,r)=>{window.location.reload()})
    window.ethereum.on("chainChanged",(e,r)=>{window.location.reload()})
    
    var currentTime = new Date().getTime() / 1000
 



    return (
    <div className='AdminBlock'>

    <div style={{border:"1px solid black"}}>
      <p>TFT Amount for Staking{" "}
      <input 
      type="value"
      placeholder='enter TFT value here'
      value={TFT}

      onChange={(e)=>{
        setTFT(e.target.value)

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
                <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Time to Monthly Return</th>
                <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Time to Quarterly Return</th>
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
                        <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent",  fontWeight:"bold"}}>
                        { Number(val.timeOfInvestment)+(60*60*24*30) - currentTime > 0 ? <DailyTimer time={Number(val.timeOfInvestment)+(60*60*24*30)}/> :  val.monthly/100000000 } </td>
                        <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent",  fontWeight:"bold"}}>
                        { Number(val.timeOfInvestment)+(60*60*24*30*3) - currentTime > 0 ? <DailyTimer time={Number(val.timeOfInvestment)+(60*60*24*30*3)}/> :  val.quarterly/100000000 } </td>
                    <td><button onClick={()=>{Unstake(val.stakingId)}}>UnStake</button></td>
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
