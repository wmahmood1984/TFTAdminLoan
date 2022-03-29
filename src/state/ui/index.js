import Web3 from 'web3'
import { LoanConAbi,LoanConAddress,tokenAbi,USDTAddress,BUSDAddress, tokenAddress } from '../../config';
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");






var web3;
var LoanContract
var address
export const initWeb3 = createAsyncThunk(
    "InitWeb3",
    async(a,thunkApi)=>{
    

        try {
            if(Web3.givenProvider){ 
                web3 = new Web3(Web3.givenProvider);
			
             //   await Web3.givenProvider.enable()
                const networkId = await web3.eth.net.getId()

				LoanContract = new web3.eth.Contract(LoanConAbi, LoanConAddress);

				
                const addresses = await web3.eth.getAccounts()
                address = addresses[0];
				var ethBalance = await web3.eth.getBalance(address)
				
                thunkApi.dispatch(balance({
                    contract: LoanContract,
                    address: address,
				

                }))
				return {
                    web3,
                    LoanContract,
                    address,

					ethBalance,
                                                       }
            }else {console.log("error in loading web3")
					return {web3:null,contract:null,address:null,SeekGoldAddress:null}}
        } catch (error) {
            console.log("Error", error)
        }

    }
)



export const balance = createAsyncThunk("balance",
    async ({contract,address})=>{

		
        try {
            //const price = await contract.methods.getPrice(address).call()
			const price = 0 	

             return {price}

        } catch (error) {
            console.log("Error in ArrayThunk",error)
        }
    }
    )

export const Price = createAsyncThunk("Price",
    async ({BNB,BUSD})=>{

		
        try {
			if(Web3.givenProvider){ 
            web3 = new Web3(Web3.givenProvider);

			LoanContract = new web3.eth.Contract(LoanConAbi, LoanConAddress);
			var tokenContract = new web3.eth.Contract(tokenAbi,tokenAddress)
			var BUSDContract = new web3.eth.Contract(tokenAbi,BUSDAddress);
			var USDTContract = new web3.eth.Contract(tokenAbi,USDTAddress);
			const addresses = await web3.eth.getAccounts()
			address = addresses[0]

	
            const price = await LoanContract.methods.getPrice(
				web3.utils.toWei(BNB.toString(),"ether")
			).call()

			const balance = await tokenContract.methods.balanceOf(address).call()
			const discount = await LoanContract.methods.Discount().call()
			const BNBPrice = await LoanContract.methods.getLatestPrice().call()
			const Admin = await LoanContract.methods.admin().call()
			// const BUSDTFT = await LoanContract.methods.getBUSDTFT(
			// 	web3.utils.toWei(BUSD.toString(),"ether")
			// 	).call()
			const BUSDAllowance = await BUSDContract.methods.allowance(addresses[0],LoanConAddress).call()
			const USDTAllowance = await USDTContract.methods.allowance(addresses[0],LoanConAddress).call()
			const TFTAllowance = await tokenContract.methods.allowance(addresses[0],LoanConAddress).call()
			const indStakingInf = await LoanContract.methods.getStakingInfo().call({from:address})
            const indLoanInf = await LoanContract.methods.getLStakingInfo().call({from:address})
			const indRewardInf = await LoanContract.methods.calculateRewardInd().call({from:address})
            console.log("staking info",indLoanInf)

             return {price,indLoanInf,discount,BNBPrice,BUSDAllowance,USDTAllowance,balance,Admin,address,TFTAllowance,indStakingInf,indRewardInf}}
			


        } catch (error) {
            console.log("Error in Price Thunk",error)
        }
    }
    )


	export const Buy = createAsyncThunk("Buy",
    async ({quantity, value,usdCon})=>{

		
        try {
			
			var LQuantity = web3.utils.toWei(quantity.toString(),"ether")
			var lValue = web3.utils.toWei(value.toString(),"ether")
			const result = await LoanContract.methods.buyTFT(LQuantity,usdCon).send({from:address, value:lValue })

        } catch (error) {
            console.log("Error in Buy Function",error)
        }
    }
    )


	export const BUSDApprove = createAsyncThunk("BUSDApprove",
    async ({quantity})=>{

		
        try {
			var BUSDContract = new web3.eth.Contract(tokenAbi,BUSDAddress);
			var LQuantity = web3.utils.toWei(quantity.toString(),"ether")

			const result = await BUSDContract.methods.approve(LoanConAddress,LQuantity).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in BUSDApprove Function",error)
        }
    }
    )


	export const USDTApprove = createAsyncThunk("USDTApprove",
    async ({quantity})=>{

		
        try {
			var USDTContract = new web3.eth.Contract(tokenAbi,USDTAddress);
			var LQuantity = web3.utils.toWei(quantity.toString(),"ether")

			const result = await USDTContract.methods.approve(LoanConAddress,LQuantity).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in USDTApprove Function",error)
        }
    }
    )



	export const TFTApprove = createAsyncThunk("TFTApprove",
    async ({quantity})=>{

		
        try {
			var TFTContract = new web3.eth.Contract(tokenAbi,tokenAddress);


			const result = await TFTContract.methods.approve(LoanConAddress,quantity*100000000).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in TFTApprove Function",error)
        }
    }
    )



	export const DiscChange = createAsyncThunk("DiscChange",
    async ({Disc})=>{

		
        try {



			const result = await LoanContract.methods.changeDiscount(Disc).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in DiscChange Function",error)
        }
    }
    )


	export const Stakinga = createAsyncThunk("Staking",
    async ({_qty})=>{

		
        try {



			const result = await LoanContract.methods.Staking(_qty*100000000).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in DiscChange Function",error)
        }
    }
    )

    export const LStakinga = createAsyncThunk("Staking",
    async ({_qty,Scheme})=>{

		
        try {



			const result = await LoanContract.methods.LStaking(_qty*100000000,Scheme).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in DiscChange Function",error)
        }
    }
    )


	export const UnStakinga = createAsyncThunk("Staking",
    async ({id})=>{

		
        try {



			const result = await LoanContract.methods.unStaking(id).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in DiscChange Function",error)
        }
    }
    )


    export const LUnStakinga = createAsyncThunk("Staking",
    async ({id})=>{

		
        try {



			const result = await LoanContract.methods.LUnStaking(id).send({from:address })
			// .on(
			// 	"confirmation",(e,r)=>{window.location.reload()}
			// )

        } catch (error) {
            console.log("Error in DiscChange Function",error)
        }
    }
    )







const adoptSlice = createSlice({
    name: "AdopSlice",
    initialState: {
        web3: null,
		ethBalance: null,
        address : null,
        balance: null,
		Price: null,
		Active: null,
        toggle: false,
		remaining: null,
		discount: null,
		BNBPrice: null,
		BUSDTFT : null,
		BUSDAllowance: null,
		USDTAllowance: null,
		balance: null,
		Admin: null,
		TFTAllowance: null,
		indStakingInf: null,
		indRewardInf: null,
        indLoanInf: null,



    },
    reducers: {
        toggle : (state,actions)=>{
            state.toggle = !state.toggle;
        },
		setAccount: (state,actions)=>{
			state.address = actions.payload
		}
    },
    extraReducers: {
        [initWeb3.fulfilled] : (state,action)=>{
            state.web3 = action.payload.web3;
            state.address = action.payload.address;
			state.ethBalance = action.payload.ethBalance;



         },

         [Price.fulfilled] : (state,action)=>{
            
			state.Price = action.payload.price
			state.discount = action.payload.discount
			state.BNBPrice = action.payload.BNBPrice
//			state.BUSDTFT = action.payload.BUSDTFT
			state.BUSDAllowance = action.payload.BUSDAllowance
			state.USDTAllowance = action.payload.USDTAllowance
			state.balance = action.payload.balance
			state.Admin = action.payload.Admin
			state.address = action.payload.address
			state.TFTAllowance = action.payload.TFTAllowance
			state.indStakingInf = action.payload.indStakingInf
			state.indRewardInf = action.payload.indRewardInf
            state.indLoanInf = action.payload.indLoanInf

		},


		

       
        [BUSDApprove.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [BUSDApprove.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },


		[USDTApprove.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [USDTApprove.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },


		[Buy.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [Buy.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },


		[DiscChange.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [DiscChange.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },


		[Stakinga.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [Stakinga.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },



		[TFTApprove.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [TFTApprove.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },



		[UnStakinga.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [UnStakinga.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },


        [LStakinga.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [LStakinga.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },


        [LUnStakinga.pending] : (state,action)=>{
			

            state.toggle = !state.toggle;
			state.error = null;
        },
        [LUnStakinga.fulfilled] : (state,action)=>{
			
            state.toggle = !state.toggle;
			state.error = action.payload;

        },



       
//
    }
})

export const adopreducer = adoptSlice.reducer;
export const { toggle } = adoptSlice.actions
