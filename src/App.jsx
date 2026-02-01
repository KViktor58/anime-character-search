import React, { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchCharacter = async () => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    setLoading(true);
    setHasSearched(false);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/characters?q=${cleanQuery}&order_by=favorites&sort=desc&limit=25`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const filteredAndSorted = data.data
          .filter((char) => (char.favorites || 0) > 0)
          .sort((a, b) => (b.favorites || 0) - (a.favorites || 0));

        setCharacters(filteredAndSorted.slice(0, 10));
      } else {
        setCharacters([]);
      }
    } catch (error) {
      console.error('Something went wrong:', error);
      setCharacters([]);
    }
    setLoading(false);
    setHasSearched(true);
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        backgroundColor: '#fdfbfb',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ color: '#333' }}>Anime Character Search 🌸</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHasSearched(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && searchCharacter()}
          placeholder="Who are you looking for?"
          style={{
            padding: '12px',
            width: '250px',
            borderRadius: '25px',
            border: '2px solid #ffb6c1',
            outline: 'none',
            backgroundColor: 'white',
            color: '#333',
          }}
        />
        <button
          onClick={searchCharacter}
          style={{
            marginLeft: '10px',
            padding: '12px 25px',
            cursor: 'pointer',
            backgroundColor: '#ffb6c1',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
          }}
        >
          {loading ? '...' : 'Show Me'}
        </button>
      </div>

      {loading && <p>Summoning, please wait... ✨</p>}

      {hasSearched && !loading && characters.length === 0 && (
        <p style={{ color: '#888' }}>
          Oops! We couldn't find that character. 😢
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {characters.map((char) => (
          <div
            key={char.mal_id}
            style={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '15px',
              width: '220px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            }}
          >
            <img
              src={char.images.jpg.image_url}
              alt={char.name}
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
                borderRadius: '15px',
              }}
            />
            <h3
              style={{ fontSize: '18px', margin: '15px 0 10px', color: '#444' }}
            >
              {char.name}
            </h3>
            <p
              style={{ fontSize: '14px', color: '#e91e63', fontWeight: 'bold' }}
            >
              ❤️ {char.favorites.toLocaleString()} favorites
            </p>

            {char.about && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#666',
                  textAlign: 'left',
                  margin: '15px 0',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  paddingRight: '5px',
                }}
              >
                {char.about.replace(/\[.*?\]/g, '')}
              </p>
            )}

            <a
              href={char.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
                color: '#999',
                textDecoration: 'none',
                fontSize: '13px',
              }}
            >
              <img
                src="src/assets/MyAnimeList_Logo.png"
                alt="MAL"
                style={{ width: '16px', height: '16px', objectFit: 'contain' }}
              />
              View on MAL
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
