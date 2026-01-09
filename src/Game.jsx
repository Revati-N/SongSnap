import { useState, useRef, useEffect } from 'react';

const difficulties = [
  { time: 1000, points: 1000, label: '1s ⚡' },
  { time: 3000, points: 600, label: '3s 🔥' },
  { time: 5000, points: 300, label: '5s 💥' },
  { time: 10000, points: 100, label: '10s 🎯' }
];

function Game({ token, tracks, loadTracks, loading, highScore, setHighScore }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [answered, setAnswered] = useState(false);
  const audioRef = useRef(null);

  const startRound = () => {
    if (!tracks.length) {
      loadTracks();
      return;
    }
    
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    setCurrentTrack(randomTrack);
    setCurrentDifficulty(0);
    setAnswered(false);
    setGameActive(true);
    setCountdown(difficulties[0].time);
    
    // Preload 30s preview
    if (audioRef.current) {
      audioRef.current.src = randomTrack.preview_url;
    }
  };

  useEffect(() => {
    if (!gameActive || !currentTrack) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          setGameActive(false);
          setAnswered(true);
          return 0;
        }
        return prev - 50;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameActive, currentTrack]);

  const handleGuess = (selectedTrack) => {
    if (!gameActive || answered) return;
    
    const diff = difficulties[currentDifficulty];
    const timeBonus = Math.max(0, diff.points * (countdown / diff.time));
    const roundScore = answered ? 0 : timeBonus;
    
    setScore(prev => prev + roundScore);
    setAnswered(true);
    setGameActive(false);
    
    if (roundScore > 0) {
      setCurrentDifficulty(prev => Math.min(3, prev + 1));
    }
  };

  const nextRound = () => {
    startRound();
  };

  const resetGame = () => {
    setScore(0);
    setCurrentDifficulty(0);
    setGameActive(false);
  };

  // Get 4 options (1 correct + 3 random)
  const getOptions = () => {
    if (!currentTrack) return [];
    const options = [currentTrack];
    while (options.length < 4) {
      const random = tracks[Math.floor(Math.random() * tracks.length)];
      if (!options.includes(random)) options.push(random);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  if (loading) return <div className="loading">Loading your tracks...</div>;

  return (
    <div className="game-container">
      <div className="score-header">
        <div>Score: {score}</div>
        <div>High: {highScore}</div>
        {currentDifficulty > 0 && (
          <div>Streak: {currentDifficulty}/4</div>
        )}
      </div>

      <div className="game-area">
        {!gameActive && !answered && (
          <button className="start-btn" onClick={startRound}>
            🎵 New Round
          </button>
        )}

        {gameActive && (
          <>
            <div className="countdown-ring">
              <div className="countdown-fill" style={{ 
                '--progress': `${(countdown / difficulties[currentDifficulty].time) * 100}%`
              }} />
              <span>{Math.ceil(countdown/1000)}s</span>
            </div>
            <div className="difficulty-label">
              {difficulties[currentDifficulty].label}
            </div>
            <audio 
              ref={audioRef}
              preload="auto"
              onTimeUpdate={(e) => {
                if (e.target.currentTime >= difficulties[currentDifficulty].time / 1000) {
                  e.target.pause();
                  e.target.currentTime = 0;
                }
              }}
              autoPlay
            />
          </>
        )}

        {answered && (
          <div className="result-screen">
            <h2>{answered ? '⏰ Time\'s up!' : '🎉 Correct!'}</h2>
            <p>{currentTrack?.name} - {currentTrack?.artists[0]?.name}</p>
            <div className="action-buttons">
              <button onClick={nextRound}>Next Round</button>
              <button onClick={resetGame}>New Game</button>
            </div>
          </div>
        )}

        {(gameActive || answered) && (
          <div className="options-grid">
            {getOptions().map((track, i) => (
              <button
                key={i}
                className="track-option"
                onClick={() => handleGuess(track)}
                disabled={!gameActive}
              >
                <img src={track.album.images[2]?.url} alt="cover" />
                <div>
                  <strong>{track.name}</strong>
                  <span>{track.artists[0]?.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
