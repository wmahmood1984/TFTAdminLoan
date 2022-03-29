
import '../App.css';
import Web3 from 'web3';
import {Adminabi,AdminconAddress,Admin} from "../config.js"
import {useEffect, useState} from "react"
import Papa from "papaparse"
import { Link } from 'react-router-dom';

function Home() {
  const web3 = new Web3(Web3.givenProvider)
  const contract = new web3.eth.Contract(Adminabi,AdminconAddress)
  const [mcas,setMCAS] =  useState()
  const [mcasIssued,setMcasIssued] =  useState()
  const [esas,setESAS] =  useState()
  const [esasIssued,setESASIssued] =  useState()
  const [tds,setTDS] =  useState()
  const [tdsIssued,setTDSIssued] =  useState()
  const [csv,setCSV] = useState()
  const[scheme,setScheme]= useState()
  const[address,setAddress]= useState()
  const[quantity,setQuantity]= useState()
  const[Advisor,setAdvisor]= useState()
  const[TEAM,setTEAM]= useState()
  const [mcasDetails,setMcasDetails]= useState()
  const [esasDetails,setEsasDetails]= useState()
  const[days,setDays]= useState()
  const[tokensVested,setTokenVested]= useState()
  // const[schemea,setschemea]= useState()
  const[quantitya,setquantitya]= useState()

useEffect(() => {
  const abc = async()=>{
  const result = await web3.eth.getAccounts((e,r)=>{setAddress(r[0])})
  contract.methods.MCAS().call((e,r)=>{setMCAS(r)})
  contract.methods.MCASIssued().call((e,r)=>{setMcasIssued(r)})
  contract.methods.ESAS().call((e,r)=>{setESAS(r)})
  contract.methods.ESASIssued().call((e,r)=>{setESASIssued(r)})
  contract.methods.TDS().call((e,r)=>{setTDS(r)})
  contract.methods.TDSIssued().call((e,r)=>{setTDSIssued(r)})

  contract.methods.Team().call((e,r)=>{setTEAM(r)})
  contract.methods.MCASDetails(result[0]).call((e,r)=>{setMcasDetails(r)})
  contract.methods.ESASDetails().call((e,r)=>{setEsasDetails(r)})
  contract.methods.teamClaimVested().call((e,r)=>{setTokenVested(r)})
}
  abc()

}, [scheme])


const handleChange = async event => {
  const file = await event.target.files[0]
  Papa.parse(file, {
    complete: updateData,
    header: false
  });
  // const reader = new window.FileReader()
  // reader.readAsText(file)
  // reader.onloadend = async ()=>{   console.log("reader",reader.result) }
}

function  updateData(result) {
  var data = result.data;
  console.log(data);
  setCSV(data);
}


window.ethereum.on("accountsChanged",(e,r)=>{window.location.reload()})

console.log("mcas",mcasDetails)
console.log("esas",esasDetails)

function handleMCASSubmit (){

if(csv && scheme){
  var myArray = []
  var currentTime = days ==0? 0 : new Date().getTime()/1000

csv.map((v,i)=>{
myArray.push([v[0],Number(v[1])*100000000,Math.floor(currentTime)+Number(v[2])*60*60*24])
})

myArray.pop()

console.log("data",myArray)
contract.methods.setMCAS(scheme,
    myArray
  ).send({from:address}).on("confirmation",(e,r)=>{
    setCSV("")
    setScheme("")
  }) 
}else{
  window.alert("Please provide parameters")
}

}


function handleESASSubmit (){

  if(quantity && days){
   

    var currentTime = days ==0? 0 : new Date().getTime()/1000

  contract.methods.setESAS(scheme,quantity*100000000,Math.floor(currentTime)+days*60*60*24
    
    ).send({from:address}).on("confirmation",(e,r)=>{
      setDays("")
      setScheme("")
      setQuantity("")
    }) 
  }else{
    window.alert("Please provide parameters")
  }
  
  
  
   
  
  
     
  
  }

  
async function claimTeam(){
  contract.methods.teamClaim().send({from:address})
}


async function claimESAS(schemeNo){
  contract.methods.ESASClaim(schemeNo,quantitya).send({from:address})
}

async function MCASClaim(schemeNo){
  contract.methods.ESASClaim(schemeNo,quantitya).send({from:address})
}


  return (
    <div className="App">

      <Link to="InstantBuy">Instant Buy</Link>
      <Link to="staking">Staking</Link>
      <Link to="loan">Loan</Link>
  {Admin == address? 
    <div className='AdminBlock'>
      <h1>TFT Admin Panel</h1>
      <p>Mkt and Comm AirDrop{"  "}<span >{`${mcasIssued/100000000} / ${mcas/100000000}`}</span></p>
      <p>Strategic Adv AirDrop{"  "}<span >{`${esasIssued/100000000} / ${esas/100000000}`}</span></p>
      <p>Team AirDrop{"  "}<span >{`${tdsIssued/100000000} / ${tds/100000000}`}</span></p>
      
 

      <div style={{border:"1px solid black"}}>
        <h3>Members and Community AirDrop</h3>
        <input
        value={scheme}
        type="value"
        placeholder='enter scheme number'
        onChange={(e)=>{setScheme(e.target.value)}}
        ></input>
        <div className="Recipients_info_2Qot1" data-v-404281ee=""><input className="CSV-file-input" type="file" onChange={handleChange}/></div>
        <button onClick={handleMCASSubmit}>submit</button>
      </div>

      <div style={{border:"1px solid black"}}>
        <h3>External Strategic Advisor AirDrop</h3>
        <input
        value={scheme}
        type="value"
        placeholder='enter scheme number'
        onChange={(e)=>{setScheme(e.target.value)}}
        ></input>

        <input
        value={quantity}
        type="value"
        placeholder='enter quantity'
        onChange={(e)=>{setQuantity(e.target.value)}}
        ></input>

        <input
        value={days}
        type="value"
        placeholder='enter vesting days'
        onChange={(e)=>{setDays(e.target.value)}}
        ></input>

  
        <button onClick={handleESASSubmit}>submit</button>
      </div>
      <button
      onClick={()=>{contract.methods.approve().send({from:address})}}
      >Approve tokens</button>
       <button
        disabled={tokensVested<=0}
        onClick={claimTeam}>Transfer to Team</button>
    </div> 
    
    : 

    Advisor == address? 
    
    <div className='AdminBlock'>
      <h1>TFT Advisor Panel</h1>
      <p>Strategic Adv AirDrop{"  "}<span >{`${esasIssued/100000000} / ${esas/100000000}`}</span></p>
      <table style={{border : "2px solid forestgreen", width: "500px", minHeight: "30px",textAlign: "center", }}>
        <thead>
          <tr>
            <th style={{borderBottom: "2px solid forestgreen", borderRight:"2px solid forestgreen" , backgroundColor:"burlywood" }}>Scheme No.</th>
            <th style={{borderBottom: "2px solid forestgreen" , borderRight: "2px solid forestgreen", backgroundColor:"burlywood"}}>Eligibility</th>
            <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Days left</th>
            <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Claim</th>
          </tr>
        </thead>
        <tbody>
          {esasDetails &&  esasDetails.map((val, key) => {
            var currentTime = new Date().getTime()/1000
            return (
              <tr key={key}>
                <td style={{borderRight: "2px solid forestgreen",  backgroundColor: "transparent",  fontWeight:"bold"}}>{val.Scheme}</td>
                <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent", fontWeight:"bold" }}>{val.amount/100000000}</td>
                <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent", fontWeight:"bold"}}>{((Number(val.Days)- currentTime)/(60*60*24)).toFixed(0)}</td>
                <td style={{  backgroundColor : "transparent",  fontWeight:"bold"}}>
                  <input
                    value={quantitya}
                    type="value"
                    placeholder='enter quantity'
                    onChange={(e)=>{setquantitya(e.target.value)}}
                  ></input>

                  <input
                    value={Advisor}
                    type="value"
                    placeholder='enter Advisor address'
                    onChange={(e)=>{setAdvisor(e.target.value)}}
                  ></input>
                  
                  <button 
                    disabled={Number(val.Days)-currentTime>0}
                    onClick={()=>{
                      claimESAS(val.Scheme)}}>Claim</button></td>
              </tr>)})}

                
        </tbody>
        <tfoot></tfoot>
                
                
      </table>     
 
      
    </div> 
    
    : 
    
    TEAM == address ? 
    <div className='AdminBlock'>
      <h1>TFT TEAM Panel</h1>
      <p>Team AirDrop{"  "}<span >{`${tdsIssued} / ${tds/100000000}`}</span></p>
      <p>Tokens vested so far : {tokensVested}</p>
      <button
        disabled={tokensVested<=0}
        onClick={claimTeam}>claim</button>
    </div> 
    
    :  
           
    <div>
      <h1>Marketing and Community Panel Panel</h1>
      <p>Mkt and Comm AirDrop{"  "}<span >{`${mcasIssued/100000000} / ${mcas/100000000}`}</span></p>
      <table style={{border : "2px solid forestgreen", width: "500px", minHeight: "30px",textAlign: "center", }}>
        <thead>
          <tr>
            <th style={{borderBottom: "2px solid forestgreen", borderRight:"2px solid forestgreen" , backgroundColor:"burlywood" }}>Scheme No.</th>
            <th style={{borderBottom: "2px solid forestgreen" , borderRight: "2px solid forestgreen", backgroundColor:"burlywood"}}>Eligibility</th>
            <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Days left</th>
            <th style={{borderBottom: "2px solid forestgreen", backgroundColor:"burlywood"}}>Claim</th>
            </tr>
        </thead>
        <tbody>
          {mcasDetails &&  mcasDetails.map((val, key) => {
            var currentTime = new Date().getTime()/1000
            return (
              <tr key={key}>
                <td style={{borderRight: "2px solid forestgreen",  backgroundColor: "transparent",  fontWeight:"bold"}}>{val.Scheme}</td>
                <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent", fontWeight:"bold" }}>{val.amount/100000000}</td>
                <td style={{borderRight: "2px solid forestgreen",  backgroundColor : "transparent", fontWeight:"bold"}}>{((Number(val.Days)- currentTime)/(60*60*24)).toFixed(0)}</td>
                <td style={{  backgroundColor : "transparent",  fontWeight:"bold"}}>
               

                  <input
                    value={quantitya}
                    type="value"
                    placeholder='enter quantity'
                    onChange={(e)=>{setquantitya(e.target.value)}}
                  ></input>

                  <button 
                    disabled={Number(val.Days)-currentTime>0}
                    onClick={()=>{MCASClaim(val.Scheme)}}>Claim</button></td>
              </tr>)})}

                
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>}
    

    
    </div>
  );
}

export default Home;
