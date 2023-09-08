import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid';
import Razorpay from 'razorpay';


async function generateObject() {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY!,
        key_secret: process.env.RAZORPAY_SECRET,
    });
    const payment_capture = 1;
    const price = 100; //Put your desired amount here

    const currency = "INR"; //Put your desired currency's code , check in razorpay docs for allowed codes.
    const options = {
        amount:(price*100), // amount in smallest currency unit
        currency: "INR",
        receipt:nanoid(),
    };

    try {
        const response = await razorpay.orders.create(options);
        return response;

    } catch (err) {
        return false;

    }
}
 
export async function POST() {
//   const res = await fetch('https://data.mongodb-api.com/...', {
//     headers: {
//       'Content-Type': 'application/json',
//       'API-Key': process.env.DATA_API_KEY,
//     },
//   })
//   const data = await res.json()



 
  
     
   // Initialize Razorpay Object 
   
            //Generate Payment Object
      
const data = await generateObject();

if(!data)return console.log("failed");
 
  return NextResponse.json({ data: data});


}