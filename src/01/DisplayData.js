import React , {useState } from 'react'

export default function DisplayData() {
    const [dataBoard, setDataBoard ] = useState([]);

    const loadBoard =async()=>{
        await fetch('http://localhost:8080/board')
        .then (resp=> {return resp.json();})
        .then  (result =>{ setDataBoard(result);})
        .catch(error => {console.error('Error fetching Board:' , error);});
    };

    


    const loadData =() =>{
        return (
            <table align='center'>
                <thead>
                    <tr>
                        <th>ID</th><th>title</th><th>writer</th>
                        <th>content</th><th>createDate</th>
                    </tr>
                </thead>
                <tbody>
                    {dataBoard.map(board => (
                        <tr key={board.id}>
                            <td>{board.title}</td>
                            <td>{board.writer}</td>
                            <td>{board.content}</td>
                            <td>{board.createDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };
    const writeBoard =() =>{

    }
    return (
    <div>
      <h2>Data Display</h2>
      <button onClick={()=>loadBoard()}>Board</button>
      
      <div>{loadData()}</div>
    </div>
  );
};
