"use server";

import prisma from "@/prisma/prisma";
import { nanoid } from "nanoid";
import Razorpay from "razorpay";
// import { data } from "autoprefixer"

// export const createUser = async (username: string, email: string) => {
//   try {
//     const user = await prisma.user.create({
//       data: {
//         email: email,
//         mobile: username,
//         Account: {
//           create: {
//             balance: 0,
//           },
//         },
//       },
//       include: {
//         Account: true,
//       },
//     });

//     if (!user) {
//       return console.log("Failed to Create User");
//     }
//     console.log("Created User:", user);
//   } catch (error) {
//     console.log(error);
//   }
// };


export const fetchBalance = async(userid:string)=>{

    try {
        // const user = await prisma.user.findUnique({
        //     where:{
        //         id:userid
        //     }
        // });


        const account = await prisma.account.findUnique({
            where:{
                userid:userid
            }
        });

        if(!account){
            console.log("Account nut found");
            return -1;
        };

        return account.balance;

    } catch (error) {
        console.log(error);
        return 0;
    }
}

export const findWallet = async()=>{
    try {
        const wal = await prisma.wallet.findUnique({
            where:{
                userid:844
            }
        });

        console.log(wal);
    } catch (error) {
        console.log(error);
    }
}

export const AddBalance = async(userid:string,email:string,balance:number)=>{
    try {

        const bankAccount = await prisma.tbl_user.findUnique({
           
                where: {
                    mobile: userid,
                    email:email
                  },
            
        });
      
       
        console.log("bank",bankAccount);

          if(!bankAccount){
              console.log("Invalid Bank Id");
            return false;
          }

          const id = bankAccount.id;

          const amntTable = await prisma.wallet.findUnique({
            where:{
                userid:id
            }
          });
          console.log("bank",amntTable);
          if(!amntTable){
              console.log("Invalid Bank Id");
            return false;
          }

          const newAmount = parseFloat(amntTable.amount)+balance;

        const add = await prisma.wallet.update({
            where:{
                id:amntTable.id
            },
            data:{
                amount:newAmount.toString(),
            }
        });

        if(!add){
            console.log("failed to add balance");
            return false;
        }
        console.log("success",add);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}



export const savePayment = async (paymentInfo: {
  amount: string;
  payment_id: string;
  order_id: string;
  razorpay_signature: string;
  name: string;
  userid:string
}) => {
  try {
    const pay = await prisma.payment.create({
      data: {
        amount: paymentInfo.amount,
        userid: paymentInfo.userid,
        order_id: paymentInfo.order_id,
        payment_id: paymentInfo.payment_id,
        razorpay_signature: paymentInfo.razorpay_signature,
      },
    });
    if (!pay) {
      return console.log("Failed");
    }
    return console.log(pay);
  } catch (error) {
    console.log(error);
  }
};



// export const createUser = async()=>{
//     try {
//         const user = await prisma.user.create({
//             data:{
//               email:"ram2@gmail.com",
//               password:"1234",
//             }
//         });

//         if(!user){
//             console.log("failed");
//             return;
//         }
//         console.log(user);

//     } catch (error) {
//         console.log(error);
//     }
// }



export async function GeneratePayment(amount:number):Promise<string> {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY!,
        key_secret: process.env.RAZORPAY_SECRET,
    });
    const payment_capture = 1;
    const price = amount; //Put your desired amount here

    const currency = "INR"; //Put your desired currency's code , check in razorpay docs for allowed codes.
    const options = {
        amount:(price*100), // amount in smallest currency unit
        currency: "INR",
        receipt:nanoid(),
    };

    try {
        const response = await razorpay.orders.create(options);
        if(!response){
            return JSON.stringify({success:false});
        }
        return JSON.stringify({data:response,success:true})

    } catch (err) {
        return JSON.stringify({success:false});
    }
}
 


export async function checkData(email:string,userid:string) {
    try {
        const user = await prisma.tbl_user.findUnique({
            where:{
                email:email,
                mobile:userid
            },
            
        })
        if(!user){
            return false;
        }
        console.log(user);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}