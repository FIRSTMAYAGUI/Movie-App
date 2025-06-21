/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import {updateSearchCount, getTrendingMovies} from './appwrite.js'

const API_BASE_URL = "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY 

const API_OPTIONS = {
  method: "GET", 
  headers: {
    accept : "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [movieList, setMovieList] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  useDebounce(() => setDebounceSearchTerm(searchTerm), 700, [searchTerm])

const loadtrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending movies:${error}`)
    }
}

const FetchMovies = async (query = "") => {
  setIsLoading(true) // setting the loading to be true before fetching for anything
  setError("") // setting the error to an empty string
  try {
    const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc` // desc means descending order
    
    const response = await fetch(endpoint, API_OPTIONS)

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json()
    // console.log(data)
    // console.log(data.results)
    if(query && data.results.length > 0){
      await updateSearchCount(query, data.results[0])
    }

    // Check if data.results
    if (data.results) { //include this "&& Array.isArray(data.results)" in the condition to chack if the data comming from the API is an array  
      setMovieList(data.results); // Set the actual movie list
      setError(""); // Clear any previous errors if successful
    } else {
      setError(data.Error || 'Failed to fetch movies');
      setMovieList([]); //empty the movie list
    }

  } 
  catch (error) {
    console.log(`Error while searching movie: ${error}`)
    setError("Error while fetching movies. Please try again later")
  } finally {
    setIsLoading(false); // Stop loading after fetching
  }

}

  useEffect( () =>{
    FetchMovies(debounceSearchTerm)
  }, [debounceSearchTerm]) // calling the fetchMovie function

  useEffect(()=>{
    loadtrendingMovies()
  }, [])

  return(
    <main>
      <div className="pattern"/>

      <div className ="wrapper">

        <header>
          <img src="./hero-img.png" alt="hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> you will Enjoy!</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {
          trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending Movies</h2>
              <ul>
                {
                  trendingMovies.map((movie, index) => {
                    return (
                      <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <img src={movie.poster_url} alt={movie.title} />
                      </li>
                    )
                  })
                }
              </ul>
            </section>
          )
        }

        <section className='all-movies'>
          <h2 className='mt-4'>All movies</h2>

          { isLoading ? (
              <p className='text-white'>Loading....</p>
            ) : error ? (
              <p className='text-red-500'>{error}</p>
            ) : (
              <ul>
                {
                  movieList.map((movie) => 
                    (<MovieCard key={movie.id} movie={movie}/>)
                  )
                }
              </ul>
            )
          }
        </section>
      </div>
    </main>
  )
}

export default App