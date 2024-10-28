import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [Gameboard, setGameboard] = useState({
    offset: 0,
    loser: 0,
    score: 0,
    ClickHistory: [],
    images: [],
    scoreHistory: 0,
  });

  useEffect(() => {
    console.log('Fetching images because you lost!');
    const fetchImages = async () => {
      try {
        const api1 = 'https://api.giphy.com/v1/gifs/search?api_key=ESAoqXKcsZyA0RAhzcBvlZIgiEmkKDXK&q=dog&limit=9&offset=';
        const api2 = Gameboard.offset;
        const api3 = '&rating=g&lang=en&bundle=messaging_non_clips';
        const apiFinal = api1 + api2 + api3;
        const response = await fetch(apiFinal, { mode: 'cors' });
        const imageData = await response.json();
        const actualData = imageData.data.map(img => img.images.original.url);
        return actualData;
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages().then((data) => {
      if (data) {
        setGameboard(prevState => ({
          ...prevState,
          images: data,
        }));
      }
    });
  }, [Gameboard.loser, Gameboard.offset]);

  const checkClicked = (url) => {
    if (Gameboard.score == 9){
      alert('You clicked all nine unique images!  You win!');
      setGameboard
    }
    if (Gameboard.ClickHistory.includes(url)) {
      alert('You lost!');
      setGameboard({
        ...Gameboard,
        score: 0,
        loser: Gameboard.loser + 1,
        offset: Gameboard.offset + 10,
        ClickHistory: [],
      })
      if(Gameboard.score > Gameboard.scoreHistory){
        setGameboard(prevState => ({
          ...prevState,
          scoreHistory: Gameboard.score
        }))
      };
    } else {
      setGameboard(prevState => ({
        ...prevState,
        ClickHistory: [...prevState.ClickHistory, url],
        score: prevState.score + 1,
        images: shuffleArray(prevState.images),
      }));
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="page">
      <div className="header">
        <div className="current">Current Score: {Gameboard.score}</div>
        <div className="high">High Score: {Gameboard.scoreHistory}</div>
      </div>

      <div className="images">
        {Gameboard.images.map((url, index) => (
          <button key={index} className="image-button" onClick={() => checkClicked(url)}>
            <img src={url} alt={`Dog GIF ${index + 1}`} className="image" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
