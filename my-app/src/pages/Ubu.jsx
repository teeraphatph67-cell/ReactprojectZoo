import { useState } from "react";
// import { data } from "react-router-dom";
const ubu = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "kong",
      url: "asdfihjwoierh",
      test: "asdfsadf",
      test2: "gasghhtt",
      test3: "htrujrds",
      test4: "xcvhbrgf",
      test5: "kuytutyh",
    },
  ]); 
  // //เพิ่มข้อมูลใหม่
  // const Add = () => {
  //   const newItem = {
  //     id: Date.now(),
  //     name: "NEW",
  //     url: "Url NEW",
  //   };
  //   setData([...data, newItem]);
  // };
  // const Delete = (id)=>{
  //   setData(data.filter ((item) => item.id !==id));

  // }

  return (
    <>
      <h1>รายละเอียด</h1>

      {data.map((item) => (
        <div key={item.id}>
          <div key={item.id} className="border p-2 my-2">
            <p>ชื่อ: {item.name}</p>
            <p>URL: {item.url}</p>
            <p>test: {item.test}</p>
            <p>test2: {item.test2}</p>
            <p>test3: {item.test3}</p>
            <p>test4: {item.test4}</p>
            <p>test5: {item.test5}</p>
          </div>
          {/* <button onClick={Add} className="border">
            add
          </button>
          <button onClick={() => Delete(item.id)} className="border">
            delete
          </button>
          <button className="border">edit</button> */}
        </div>
      ))}
    </>
  );
};

export default ubu;
