import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  function handleInputChange(event){
    const {name, value} = event.target;

    setData({...data, [name]: value});

  }

  async function handleAddRepository() {
    const { title, url, techs } = data;

   const tech = techs.trim().split(',');

    const response = await api.post('repositories', {
      title,
      url,
      techs: tech,
    });

    const repository = response.data;

    setRepositories([ ... repositories, repository]);

    document.getElementById('title').value = "";
    document.getElementById('url').value = "";
    document.getElementById('techs').value = "";
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`);

    setRepositories(repositories.filter(repository => repository.id !== id));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => 
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
          )}
      </ul>

      <fieldset className="fields">
        <input name="title" id="title" placeholder="Título" onChange={handleInputChange} />
        <input name="url" id="url" placeholder="URL" onChange={handleInputChange}/>
        <input name="techs" id="techs" placeholder="Tecnologias" onChange={handleInputChange}/>

        <button onClick={handleAddRepository}>Adicionar</button>
      </fieldset>
      
    </div>
  );
}

export default App;
