"use client";
import {
  AddBalance,
  GeneratePayment,
  
  fetchBalance,
  savePayment,
} from "@/ServerAction";
import prisma from "@/prisma/prisma";
import axios from "axios";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";

import {useRouter} from "next/navigation"

export default function Recharge({email,userid,amnt}:{email:string,userid:string,amnt:number}) {

    

    const router = useRouter();

//   const fetch = async () => {
//     const b = await fetchBalance("clm9ll6ce00009ialv9hk7dav");
//     setAmount(b);
//   };

  useEffect(() => {
  displayRazorpay();
    return () => {};
  }, []);

  const loadScript = async () => {
    return await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  async function displayRazorpay() {
    const res = await loadScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // const result = await axios.post("http://127.0.0.1:3000/api/checkout",{amount:amnt});
    const gen = await GeneratePayment(amnt);
    const result:{
        data:{currency:any,id:string,amount:number},
        success:boolean
    } = JSON.parse(gen);

    if (!result.success) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;
    // console.log(result.data);
    console.log(result.data);
    const options = {
      key: "rzp_test_peJueZXXuTYDMZ", // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: "Shadow Team",
     
      description: "Recharge",
      image: "/next.svg",
      order_id: order_id,
      handler: async function (response: any) {
        if (!response) {
          return console.log("cancelled");
        }
        paymentObject.close();
        console.log(response);

        const data = {
          amount: `${amount / 100}`,
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          name: "Ram",
          userid: "clm9ll6ce00009ialv9hk7dav",
        };

        // const res = await savePayment(data);

        const addBalance = await AddBalance(
         userid,
         email,
          amount / 100
        );

        if(addBalance){
         
            return router.replace("https://colorsgame.me/myaccount.php");
            // return
        }
        alert("Something went wrong");

        console.log(res);

        // const result = await axios.post("http://localhost:5000/payment/success", data);

        // alert(result.data.msg);
      },
      prefill: {
        name: "Shadow Team",
        email: "help@shadowteam.com",
        contact: "1234567",
      },
      notes: {
        address: "Online",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  
}
  

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* Amount : {amount} */}
        <div>


            <p>Please wait while your transaction is complete,Donot refresh the page</p>
          <button onClick={() => displayRazorpay()}>Display RazorPay</button>
          <br />

          <button
            onClick={() => {
            //   createUser("Ranjit Das", "21053420@gmail.com");
            }}
          >
            CreateAccount
          </button>

          <br />
          {/* <button
            onClick={() => {
              AddBalance("clm9jxwhu00069is9121vuxxx", 200);
            }}
          >
            AddBalace
          </button> */}

          {/* <button onClick={()=>createUser()}>Create User</button> */}
        </div>
      </main>
    </>
  );
}
