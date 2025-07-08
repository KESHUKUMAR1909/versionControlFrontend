import React from 'react';
import './Search.css';
const Search = ({ title, handleClick, btnTitle = "Find", value, setValue }) => {
  return (
    <div className='search-component'>
      <div className="top-part">
        {title && <h2>{title}</h2>}
        {btnTitle && <button>{btnTitle}</button>}
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Find a Repository"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleClick}>{btnTitle}</button>
      </div>
    </div>
  );
};

export default Search;
