/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import NoPoster from '../../public/No-Poster.png'
import StarIcon from '../../public/star.svg'

function MovieCard({movie : {title, poster_path, vote_average, release_date, original_language}}) {
  return (
    <div className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : NoPoster} alt={title} />

        <div className="mt-4">
            <h3>{title}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src={StarIcon} alt="Star Icon" />
                    <p>{vote_average? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span>•</span>
                <p className="lang">{original_language}</p>
                <span>•</span>
                <p className='year'>
                    {release_date ? release_date : 'N/A'}
                </p>
            </div>
        </div>

    </div>
  )
}

export default MovieCard
