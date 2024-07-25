import React, { useState, useEffect } from 'react';

export default function DisplayData() {
    const [dataBoard, setDataBoard] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newBoard, setNewBoard] = useState({
        title: '',
        content: '',
        writer: ''
    });

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
            const response = await fetch('http://localhost:8080/board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'jwt-token'
                },
                body: JSON.stringify(newBoard)
            });

            if (!response.ok) {
                throw new Error('Failed to submit board data');
            }
            // Reload board data after successful submission
            await loadBoard();
            // Reset the form and hide it
            setNewBoard({
                title: '',
                content: '',
                writer: ''
            });
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
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div>
            <h2>Data Display</h2>
            <button onClick={loadBoard}>Load Board</button>
            <button onClick={toggleForm}>글쓰기</button>

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