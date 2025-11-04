import { useState, useEffect } from 'react'

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
    
       <div>{sum}</div>
    <button onClick={()=>Appsum(0)}> ++++</button> 
    <br></br>
    <br></br>
    <br></br>
    <button onClick={()=>Appsum(1)}> -----</button>
    
    
    </>
 
  )
}

export default Calendar