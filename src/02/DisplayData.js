import React, { useState, useEffect } from 'react';

export default function DisplayData() {
    const [dataBoard, setDataBoard] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newBoard, setNewBoard] = useState({
        title: '',
        content: '',
        writer: ''
    });
    const [editId, setEditId] = useState(null); // 수정할 게시물의 ID



    useEffect(() => {
        loadBoard();
    }, []);

    const loadBoard = async () => {
        try {


            const response = await fetch('http://localhost:8080/board');
            if (!response.ok) {
                throw new Error('Failed to fetch board data');
            }
            const result = await response.json();
            setDataBoard(result);
        } catch (error) {
            console.error('Error fetching Board:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const method = editId==null ? 'POST' : 'PUT'; // 수정일 경우 PUT, 새로 추가일 경우 POST
            const url = editId==null ? `http://localhost:8080/board` :  `http://localhost:8080/board/${editId}`;
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'jwt-token'
                },
                body: JSON.stringify(newBoard)
            });

            if (!response.ok) {
                throw new Error('Failed to submit board data');
            }

             // 서버 응답을 확인
             const result = await response.json();
             console.log('Server response:', result);

            // Reload board data after successful submission
            await loadBoard();
            // Reset the form and hide it
            setNewBoard({
                title: '',
                content: '',
                writer: ''
            });
            setEditId(null); 
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting board data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBoard(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/board/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch board data');
            }
            const result = await response.json();
            setNewBoard(result);
            setEditId(id);
            setShowForm(true); // Show form when editing
        } catch (error) {
            console.error('Error fetching board data for edit:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/board/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'jwt-token'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete board data');
            }
    
            // Server response for successful deletion
          // 서버 응답 확인 (빈 응답을 처리할 필요 없음)
            console.log('Board deleted successfully');
    
            // Reload board data after successful deletion
            await loadBoard();
        } catch (error) {
            console.error('Error deleting board data:', error);
        }
    };

    const loadData = () => {
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
                            <td>{board.id}</td>
                            <td>{board.title}</td>
                            <td>{board.writer}</td>
                            <td>{board.content}</td>
                            <td>{board.createDate}</td>
                            <td>
                                <button onClick={() => handleEdit(board.id)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(board.id)}>delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const toggleForm = () => {
        // showForm 상태를 반전시킵니다. 현재 폼이 보이면 숨기고, 숨겨져 있으면 보이게 합니다.
        setShowForm(!showForm);
    
        // 만약 현재 폼이 열려 있지 않은 상태라면 (즉, 폼을 열 경우):
        if (!showForm) {
            // newBoard 상태를 초기값으로 리셋합니다. 사용자가 새 게시물을 입력할 수 있도록 합니다.
            setNewBoard({
                title: '',
                content: '',
                writer: ''
            });
            
            // editId 상태를 null로 설정하여, 폼이 새 게시물 추가 모드로 동작하도록 합니다.
            setEditId(null); // 수정 모드가 아니라는 것을 나타냅니다.
        }
    };

    return (
        <div>
            <h2>Data Display</h2>
            <button onClick={loadBoard}>Load Board</button>
            <button onClick={toggleForm}>{editId ? 'Cancel' : '글쓰기'}</button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={newBoard.title}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Content:
                        <textarea
                            name="content"
                            value={newBoard.content}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Writer:
                        <input
                            type="text"
                            name="writer"
                            value={newBoard.writer}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            )}

            <div>{loadData()}</div>
        </div>
    );
}