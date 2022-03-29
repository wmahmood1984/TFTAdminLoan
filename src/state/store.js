import { adopreducer } from './ui/index'


// //import { configureStore,  createSerializableStateInvariantMiddleware, getDefaultMiddleware } from '@reduxjs/toolkit'
// import { createStore, applyMiddleware } from 'redux'; 
// import { Iterable } from 'immutable'
// import {
//   configureStore,
//   createSerializableStateInvariantMiddleware,
//   isPlain,
// } from '@reduxjs/toolkit'
// //import reducer from './reducer'

// // Augment middleware to consider Immutable.JS iterables serializable
// const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

// const getEntries = (value) =>
//   Iterable.isIterable(value) ? value.entries() : Object.entries(value)

// const serializableMiddleware = createSerializableStateInvariantMiddleware({
//   isSerializable,
//   getEntries,
// })



//export const store = createStore(() => [], {}, applyMiddleware());
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
export const store = configureStore({
    reducer : {
        adoptReducer : adopreducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck:false,
        
    })
})