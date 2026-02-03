import {create} from 'zustand';

export const useAuthStore = create((set)=>({
    authUser:{name:"John", _id:1234,age:25},
    isLoading:false,

    login: ()=>{
        console.log("We just logged in");
    }
}))