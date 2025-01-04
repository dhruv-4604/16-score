import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.codetabs.com/v1/proxy/?quest=https://16score.com/data.json');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        setTeams(prevTeams => {
          const newTeams = data.data.main;
          if (JSON.stringify(prevTeams) !== JSON.stringify(newTeams)) {
            return newTeams;
          }
          return prevTeams;
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      }
    };

    // Fetch data every 3 seconds instead of 100ms
    const interval = setInterval(fetchData, 1000);
    
    // Initial fetch
    fetchData();

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="App">
      <table className="teams-table">
        <thead>
          <tr>
            <th>Team Logo</th>
            <th>Team Name</th>
            <th>Kills</th>
            <th>Player Status</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td>
                <img 
                  src={`/team-logos/${team.team.toLowerCase()}.png`} 
                  alt={`${team.team} logo`}
                  className="team-logo"
                />
              </td>
              <td>{team.team}</td>
              <td>{team.kills}</td>
              <td className="player-status">
                {[...Array(4)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`status-indicator ${i < team.team_alive_count ? 'alive' : 'dead'}`}
                  />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
