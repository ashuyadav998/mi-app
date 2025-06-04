import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <form className="d-flex ms-3 justify-content-center align-items-center gap-3" onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Buscar productos..."
    value={searchTerm}
    onChange={handleInputChange}
    className="form-control rounded-start"
    aria-label="Buscar productos"
    style={{ maxWidth: '300px' }} // O ajusta el ancho máximo según necesites
  />
  <button
    type="submit"
    className="btn btn-primary rounded-end"
  >
    Buscar
  </button>
</form>
  );
}

export default SearchBar;
