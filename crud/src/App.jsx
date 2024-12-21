import { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error("Error fetching todos:", error));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.error("Error deleting todo:", error));
  };

   const editTodo=(id)=>{
     const updatedTitle=prompt("edit todo");
      if(updatedTitle){
         axios.patch(`http://localhost:5000/api/todos/${id}`,{title:updatedTitle})
         .then(response =>{
          setTodos(todos.map(todo=> todo._id===id ? response.data:todo))
         })
         .catch(error=>console.error("Error",error))
      }
   }

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      axios.post('http://localhost:5000/api/todos', { title: newTodo })
        .then(response => {
          setTodos([...todos, response.data]);
          setNewTodo('');
        })
        .catch(error => console.error("Error adding todo:", error));
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <h1>CRUD App</h1>

      <input
        type="text"
        placeholder="Search Box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add Data"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="search-input"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo._id} className="todo-item">
            {todo.title}
            <div>
              <button onClick={() => editTodo(todo._id)}>Edit</button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
