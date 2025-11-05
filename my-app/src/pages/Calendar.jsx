import { useState, useEffect } from 'react'
import Hero from '../components/Hero/Hero';

function Calendar() {
  const [sum, setSum] = useState(0);

  useEffect(() => {
  

  }, [])


const Appsum = (m) => {
    
   if(m === 0){
       const r = sum + 1;
    setSum(r);            
    console.log('rrrrrr' + r);
    setSum(r);            
  
   }else{
           const r = sum - 1;
    setSum(r);            
    console.log('rrrrrr' + r);
    setSum(r);  
   }
 
}
















  return (
    <>
     <section className="relative min-h-screen px-6 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">

       <div >{sum}</div>
    <button onClick={()=>Appsum(0)}> ++++</button> 
    <br></br>
    <br></br>
    <br></br>
    <button onClick={()=>Appsum(1)}> -----</button>
  
   

     

 
    </section>
    
    </>
 
  )
}

export default Calendar