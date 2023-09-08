import { checkData, findWallet } from '@/ServerAction';
import Recharge from '@/components/Recharge';
import React from 'react'


type Props = {
    params: {},
    searchParams: { [key: string]: string | string[] | undefined },
  }

const page = async(props:Props) => {
    const searchParams = props.searchParams;

    const {email,userid,amount} = searchParams;
    const findWal = await findWallet();

    const chkdata:boolean = await checkData(`${email}`,`${userid}`);
    if(chkdata){
        return (
<Recharge  amnt={parseInt(`${amount}`)} email={`${email}`} userid={`${userid}`}/>
        )
    }
    // if(!email ||)
  return (
    <div>

        {/* Recharge: {email}
        {userid}
        {amount} */}

        <p>Loading....</p>
        
      
    </div>
  )
}

export default page
