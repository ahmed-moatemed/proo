import { useState } from 'react';
import Fuse from 'fuse.js';
import db from '../db';
import '../styles/SearchBar.css';

function SearchBar({ setSearchResults, userid }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    const lectures = await db.lectures.where({ userid }).toArray();
    const tasks = await db.tasks.where({ userid }).toArray();
    const materials = await db.materials.where({ userid }).toArray();

    const items = [...lectures, ...tasks, ...materials];
    const fuse = new Fuse(items, {
      keys: ['subject', 'title'],
      threshold: 0.3,
    });

    const results = fuse.search(query).map((result) => result.item);
    setSearchResults(results);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="ابحث في المهام أو المواد..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value) handleSearch();
          else setSearchResults([]);
        }}
      />
    </div>
  );
}

export default SearchBar;