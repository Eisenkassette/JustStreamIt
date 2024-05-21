"use strict";

async function fetchMovies(score, genre = "") {
    const url = genre
        ? `http://localhost:8000/api/v1/titles/?imdb_score=${score}&genre_contains=${genre}`
        : `http://localhost:8000/api/v1/titles/?imdb_score=${score}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

async function getTopMoviesByGenre(genre) {
    let movies = [];
    let score = 10;

    while (movies.length < 6 && score >= 0) {
        const results = await fetchMovies(score.toFixed(1), genre);
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

async function getBestMovie() {
    const bestMovie = await getTopMoviesByGenre("");
    return bestMovie[0];
}

getBestMovie().then(bestMovie => {
    // Update best movie
    const bestMoviePoster = document.getElementById('best_movie_poster');
    const bestMovieTitle = document.getElementById('best_movie_title_content');
    if (bestMovieTitle && bestMoviePoster) {
        bestMovieTitle.textContent = bestMovie.title;
        bestMoviePoster.src = bestMovie.image_url;
    } else {
        console.log('Could not find elements for best movie.');
    }
}).catch(error => {
    console.error('Error fetching movies:', error);
});

getTopMoviesByGenre("").then(topMovies => {
    topMovies.shift()
    for (let i = 0; i <= 6; i++) {
        const bestMovieBlock = document.getElementById(`best_movie_block_${i}`);
        const bestMovieName = document.getElementById(`best_movie_name_${i}`);
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

getTopMoviesByGenre("thriller").then(genreOneMovies => {
    for (let i = 0; i <= 6; i++) {
        const genreOneMovieBlock = document.getElementById(`genre_1_movie_block_${i}`);
        const genreOneMovieName = document.getElementById(`genre_1_movie_name_${i}`);
        if (genreOneMovieBlock && genreOneMovieName) {
            genreOneMovieBlock.style.backgroundImage = `url('${genreOneMovies[i].image_url}')`;
            genreOneMovieName.textContent = genreOneMovies[i].title;
        } else {
            console.log(`Could not find elements for index ${i}`);
        }
    }
}).catch(error => {
    console.error('Error fetching movies:', error);
});

getTopMoviesByGenre("drama").then(genreTwoMovies => {
    console.log(genreTwoMovies);
    for (let i = 0; i <= 6; i++) {
        const genreOneMovieBlock = document.getElementById(`genre_2_movie_block_${i}`);
        const genreOneMovieName = document.getElementById(`genre_2_movie_name_${i}`);
        if (genreOneMovieBlock && genreOneMovieName) {
            genreOneMovieBlock.style.backgroundImage = `url('${genreTwoMovies[i].image_url}')`;
            genreOneMovieName.textContent = genreTwoMovies[i].title;
        } else {
            console.log(`Could not find elements for index ${i}`);
        }
    }
}).catch(error => {
    console.error('Error fetching movies:', error);
});


const genreSelect = document.getElementById('genre_1_select');
genreSelect.addEventListener('change', () => {
    // Get the value of the selected option
    const selectedGenre = genreSelect.value;

    getTopMoviesByGenre(selectedGenre).then(custOneMovies => {
    console.log(custOneMovies);
    for (let i = 0; i <= 6; i++) {
        const genreOneMovieBlock = document.getElementById(`custom_1_movie_block_${i}`);
        const genreOneMovieName = document.getElementById(`custom_1_movie_name_${i}`);
        if (genreOneMovieBlock && genreOneMovieName) {
            genreOneMovieBlock.style.backgroundImage = `url('${custOneMovies[i].image_url}')`;
            genreOneMovieName.textContent = custOneMovies[i].title;
        } else {
            console.log(`Could not find elements for index ${i}`);
        }
    }
}).catch(error => {
    console.error('Error fetching movies:', error);
});

});
