import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const Card = ({ planet }) => {
  const { name, climate, population, terrain, residents } = planet;
  const [residentNames, setResidentNames] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      const residentNames = await Promise.all(residents.map(async (residentUrl) => {
        const response = await axios.get(residentUrl);
        return response.data.name;
      }));
      setResidentNames(residentNames);
    };

    fetchResidents();
  }, [residents]);

  return (
    <div className="card">
      <h2>{name}</h2>
      <p><strong>Climate:</strong> {climate}</p>
      <p><strong>Population:</strong> {population}</p>
      <p><strong>Terrain:</strong> {terrain}</p>
      <p><strong>Residents:</strong></p>
      <ul>
        {residentNames.map((residentName, index) => (
          <li key={index}>{residentName}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPlanets = async () => {
      const response = await axios.get(`https://swapi.dev/api/planets/?page=${currentPage}`);
      setPlanets(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 planets per page
    };

    fetchPlanets();
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="App">
      <h1>Star Wars Planets</h1>
      <div className="container">
        {planets.map((planet, index) => (
          <Card key={index} planet={planet} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default App;
