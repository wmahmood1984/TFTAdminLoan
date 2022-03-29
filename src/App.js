import React from 'react'
import Home from './Pages/Home'
import { Routes, Route} from 'react-router'
import InstantBuy from './Pages/InstantBuy'
import Staking from './Pages/Staking'
import Loan from './Pages/Loan'
export default function App() {
    return (
    
        <div className="App">

    <Routes >
      <Route path="/" element={<Home ></Home>}></Route>

      <Route path="InstantBuy" element={<InstantBuy></InstantBuy>}></Route>
      <Route path="staking" element={<Staking></Staking>}></Route>
      <Route path="loan" element={<Loan></Loan>}></Route>


    </Routes>
    

    
    
        </div>)
}
