import { useCallback, useEffect, useState } from "react";
import "./App.css";
import logo from './logo.svg';
import AutoComplete from "./components/AutoComplete";

interface Species {
  name: string;
}

interface Planet {
  name: string;
}

function App() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [mySpecies, setMySpecies] = useState<Species | null>(null);
  const [myPlanet, setMyPlanet] = useState<Planet | null>(null);

  const handleMySpeciesChanged = useCallback(
    (mySpecies: string) => {
      const myNewSpecies = species.find((s) => s.name === mySpecies);
      if (myNewSpecies) setMySpecies(myNewSpecies);
    },
    [species]
  );

  const handleMyPlanetChanged = useCallback(
    (myPlanet: string) => {
      const myNewPlanet = planets.find((p) => p.name === myPlanet);
      if (myNewPlanet) setMyPlanet(myNewPlanet);
    },
    [planets]
  );

  const loadSpecies = useCallback(async () => {
    const response = await fetch("https://swapi.dev/api/species/");
    const json = await response.json();
    setSpecies(json.results);
  }, []);

  const loadPlanets = useCallback(async () => {
    const response = await fetch("https://swapi.dev/api/planets/");
    const json = await response.json();
    setPlanets(json.results);
  }, []);

  useEffect(() => {
    loadSpecies();
    loadPlanets();
  }, [loadSpecies, loadPlanets]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello Star Wars fan</h1>
        <h2>Enter your race</h2>
        <AutoComplete
          className="Auto-Complete"
          options={species.map(({ name }) => name)}
          value={mySpecies?.name ?? ""}
          onChanged={handleMySpeciesChanged}
        />
        <h2>Enter your planet of residence</h2>
        <AutoComplete
          className="Auto-Complete"
          options={planets.map(({ name }) => name)}
          value={myPlanet?.name ?? ""}
          onChanged={handleMyPlanetChanged}
        />
        {mySpecies && myPlanet && (
          <h1>
            Your species is {mySpecies.name} and you live in {myPlanet.name}
          </h1>
        )}
      </header>
    </div>
  );
}

export default App;
