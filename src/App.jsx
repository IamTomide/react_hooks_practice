import { useEffect, useReducer, useCallback, useState } from 'react'
import './App.css'
import SelectField from './components/Select'
import genreOptions from './data/genre.json'
import moodOptions from './data/mood.json'

function selectInput(state, action) {
  switch(action.type) {
    case "SELECT_GENRE":
      return {
        ...state, genre: action.payload
      };

    case "SELECT_MOOD":
      return {
        ...state, mood:action.payload
      };

    case "SELECT_LEVEL": 
    return {
      ...state, level: action.payload
    };

    
    case "FETCH_DONE": 
    return {
      ...state, shouldFetch: false
    };
  }
}

function App() {

  const [recommenderInput, dispatch] = useReducer(selectInput, {
    genre: "",
    mood: "",
    level: "",
    shouldFetch: false
  })

  const { genre, mood, level, shouldFetch } = recommenderInput;

  const [aiResponses, setAiResponses] = useState([])

  const availableMood = moodOptions[recommenderInput.genre];

  // const getRecommendation = async () => {
  //   setAiResponses([
  //     ...aiResponses,
  //     `Genre: ${recommenderInput.genre}, Mood: ${recommenderInput.mood}, and level: ${recommenderInput.level}`
  //   ])
  // }

  const fetchRecommendations = useCallback(async () => {
  if (!genre || !mood || !level) return;

  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method:"POST",
        headers:{"content-Type":"application/json"},
        body: JSON.stringify({
          contents: [{parts:[{text: `Recommend 6 books for a ${level} ${genre} reader feeling ${mood}. Explain why.`}]}]
        })
      }
    )
    const data = await response.json();
    console.log(data);
    setAiResponses(prev => [...prev, ...data.candidates]);
  } catch(err){
    console.log(err)
  }
  }, [genre, mood, level])

  useEffect(() => {
    if (!shouldFetch) return;

    CONST runFetch = async () => {
      await fetchRecommendations();
      dispatch({type: "FETCH_DONE"});
    }
    runFetch();
  }, [shouldFetch, fetchRecommendations])

  

  return (
    <>
      <p>Select your preference for better recommendation</p>
      <SelectField 
       id="genre" 
       value={recommenderInput.genre}
       options={genreOptions}
       placeholder={"Please select a genre"}
       onSelect= {(value) => dispatch({type: 'SELECT_GENRE', payload: value})}
     />
      <SelectField 
       id="mood" 
       value={recommenderInput.mood}
       options={availableMood || []}
       placeholder={"Please select a mood"}
       onSelect =  {(value) => dispatch({type: 'SELECT_MOOD', payload: value})}
     />
      <SelectField 
       id="level" 
       value={recommenderInput.level}
       options={["Advanced", "Intermediate", "Beginner"]}
       placeholder={"Please select a Level"}
       onSelect =  {(value) => dispatch({type: 'SELECT_LEVEL', payload: value})}
     />


     <button onClick={() => dispatch({type: 'FETCH_RECOMMENDATION'})}>Get recommendation</button>

     {
      aiResponses.map((recommend, index) => {
        return (
          <details key={index} name="recommendation">
            <summary>Recommendation {index + 1}</summary>
            <p> {recommend?.content?.[0]?.text}</p>
          </details>
        )
      })
    }

    </>
  )
}


export default App;
