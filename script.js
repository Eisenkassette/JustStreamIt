"use strict";

async function fetchMovies(score) {
    const response = await fetch(`http://localhost:8000/api/v1/titles/?imdb_score=${score}`);
    const data = await response.json();
    return data.results;
}

async function getTopMovies() {
    let movies = [];
    let score = 10;

    while (movies.length < 7 && score >= 0) {
        const results = await fetchMovies(score.toFixed(1));
        movies = movies.concat(results);
        score -= 0.1;
    }

    // Sort movies by IMDb score and votes in descending order
    movies.sort((a, b) => {
        if (a.imdb_score !== b.imdb_score) {
            return b.imdb_score - a.imdb_score;
        } else {
            return b.votes - a.votes;
        }
    });

    return movies.slice(0, 7);
}


getTopMovies().then(topMovies => {
    console.log(topMovies);
    // ------------ BEST MOVIE UPDATE SECTION ------------
    const bestMoviePoster = document.getElementById('best_movie_poster');
    const bestMovieTitle = document.getElementById('best_movie_title_content');
    if (bestMovieTitle) {
        bestMovieTitle.textContent = topMovies[0].title;
    } else {
        console.log('Could not find best movie title element.');
    }
    if (bestMoviePoster) {
        bestMoviePoster.src = topMovies[0].image_url;
    } else {
        console.log('Could not find the best movie image element.');
    }
    // ------------ TOP RATED MOVIES UPDATE SECTION ------------
    for (let i = 1; i <= 6; i++) {
        const bestMovieBlock = document.getElementById(`best_movie_block_${i}`);
        const bestMovieName = document.getElementById(`best_movie_name_${i}`);

        // Check if the elements exist before updating them
        if (bestMovieBlock && bestMovieName) {
            bestMovieBlock.style.backgroundImage = `url('${topMovies[i].image_url}')`;
            bestMovieName.textContent = topMovies[i].title;
        } else {
            console.log(`Could not find elements for index ${i}`);
        }
    }
}).catch(error => {
    console.error('Error fetching movies:', error);
});