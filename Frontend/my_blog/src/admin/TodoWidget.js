import React, { useState } from 'react';

const TodoWidget = () => {
  const [todos, setTodos] = useState(['Finish project', 'Call client']);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Todo List</h3>
      <ul className="mb-4">
        {todos.map((todo, index) => (
          <li key={index} className="mb-2">{todo}</li>
        ))}
      </ul>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded-r">
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoWidget;