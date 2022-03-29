import React, { useEffect, useState } from 'react'
import "../App.css"
import { useSelector,useDispatch } from 'react-redux'
import { BUSDAddress,USDTAddress } from '../config'
import { BUSDApprove, Buy, DiscChange, initWeb3, Price,USDTApprove } from '../state/ui'


export default function InstantBuy() {
  const dispatch = useDispatch()
  const [BNB,setBNB] = useState(0)
  const [BUSD,setBUSD] = useState(0)
  const [USDT,setUSDT] = useState(0)
  const _discount = useSelector((state)=>{
    return  state.adoptReducer.discount; 
   
   });
  const [Disc,setDisc] = useState(0)

  const _price = useSelector((state)=>{
    return  state.adoptReducer.Price; 
   
   });



   const _address = useSelector((state)=>{
    return  state.adoptReducer.address; 
   
   });

   const _Admin = useSelector((state)=>{
    return  state.adoptReducer.Admin; 
   
   });

   const _balance = useSelector((state)=>{
    return  state.adoptReducer.balance; 
   
   });

  const _BUSDTFT = useSelector((state)=>{
    return  state.adoptReducer.BUSDTFT; 
   
   });

   const _BUSDAllowance = useSelector((state)=>{
    return  state.adoptReducer.BUSDAllowance; 
   
   });

   console.log("allowance",_BUSDAllowance)
   
   const _USDTAllowance = useSelector((state)=>{
    return  state.adoptReducer.USDTAllowance; 
   
   });

   const toggle = useSelector((state)=>{
    return  state.adoptReducer.toggle; 
   
   });




   window.ethereum.on("accountsChanged",(e,r)=>{window.location.reload()})
   window.ethereum.on("chainChanged",(e,r)=>{window.location.reload()})
  useEffect(()=>{

 
    dispatch(Price({BNB,BUSD}))

  },[BNB,BUSD,toggle])

console.log("Admin",_Admin)
console.log("Address",_address)
  async function Invest(){
    if(BNB>0){
      dispatch(Buy({quantity:0, value:BNB, usdCon: BUSDAddress }))
      setBNB(0)
    }else if(BUSD>0){
      if(_BUSDAllowance >= BUSD){
        console.log("Investment busd called")
        dispatch(Buy({quantity:BUSD, value:BNB,usdCon: BUSDAddress}))
        setBUSD(0)
      }else{
        dispatch(BUSDApprove({quantity :  BUSD}))
      }
    }
    else{
      if(_USDTAllowance >= USDT){
        console.log("Investment USDT Called")
        dispatch(Buy({quantity:USDT, value:BNB,usdCon: USDTAddress}))
        setUSDT(0)
      }else{
        dispatch(USDTApprove({quantity :  USDT}))
      }
    }


  }

  async function handleDiscount(){
    setDisc(0)
    dispatch(DiscChange({Disc}))
  }
  return (
    <div className='AdminBlock'>
      {_Admin == _address? 
      <div>
        <p>Current discount is {_discount}</p>
        <input type="value" value={Disc} onChange={(e)=>{setDisc(e.target.value)}}/>
        <button onClick={handleDiscount}>Change Discount</button>
      </div>
  : 
      <div></div>}
      <h3>Your balance is {(_balance/100000000).toFixed(2)}</h3>
      <div style={{border:"1px solid black"}}>
      <p>BNB Amount {" "}
      <input 
      type="value"
      placeholder='enter BNB value here'
      value={BNB}
      onChange={(e)=>{
        console.log("value",e.target.value)
        if(e.target.value==""){setBNB(0)}
        else{setBNB(e.target.value)}
        }}
      />
        </p>
      <p>On PancakeSwap you will get {(Number(_price)/100000000).toFixed(2)} TFT</p>
      <p>We will give you {( Number(_price)/100000000*(100+Number(_discount))/100).toFixed(2)}</p>
      <button onClick={Invest}>Invest</button>
      </div>


      <div style={{border:"1px solid black"}}>
      <p>BUSD Amount {" "}
      <input 
      type="value"
      placeholder='enter BUSD value here'
      value={BUSD}
      disabled={BNB>0}
      onChange={(e)=>{
        setBUSD(e.target.value)

        }}
      />
        </p>
      <p>On PancakeSwap you will get {(Number(_BUSDTFT)/100000000).toFixed(2)} TFT</p>
      <p>We will give you {( Number(_BUSDTFT)/100000000*(100+Number(_discount))/100).toFixed(2)}</p>
      <button 
      disabled={BNB>0}
      onClick={Invest}>{Number(_BUSDAllowance/1000000000000000000) >= BUSD ?  "Invest" : "Approve"}</button>
      </div>


      <div style={{border:"1px solid black"}}>
      <p>USDT Amount {" "}
      <input 
      type="value"
      placeholder='enter USDT value here'
      value={USDT}
      disabled={BNB>0}
      onChange={(e)=>{
        setUSDT(e.target.value)
        
      }}
      />
        </p>
        <p>On PancakeSwap you will get {(Number(_BUSDTFT)/100000000).toFixed(2)} TFT</p>
      <p>We will give you {( Number(_BUSDTFT)/100000000*(100+Number(_discount))/100).toFixed(2)}</p>
      <button 
      disabled={BNB>0}
      onClick={Invest}>{Number(_USDTAllowance/1000000000000000000) >= USDT?  "Invest" : "Approve"}</button>
      </div>
      
       
    </div>
  )
}
