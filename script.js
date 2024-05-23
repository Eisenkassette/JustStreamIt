"use strict";

async function fetchMovies(score, genre = "") {
    const url = `http://localhost:8000/api/v1/titles/?imdb_score=${score}&genre_contains=${genre}`
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

async function fetchAllGenreNames(page = 1, allGenreNames = []) {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/genres/?movie_title_contains=&name=+&name_contains=&page=${page}`);
        const data = await response.json();

        const currentGenreNames = data.results.map(genre => genre.name);
        allGenreNames.push(...currentGenreNames);

        if (data.next) {
            return fetchAllGenreNames(page + 1, allGenreNames);
        } else {
            return allGenreNames;
        }
    } catch (error) {
        console.error('Error fetching genre names:', error);
    }
}

async function getTopMoviesByGenre(genre, amount) {
    let movies = [];
    let score = 10;

    while (movies.length < amount && score >= 0) {
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

    return movies.slice(0, amount);
}

async function getBestMovie() {
    const bestMovie = await getTopMoviesByGenre("", 1);
    return bestMovie[0];
}

// Function to handle the movie block click and fetch movie details by title
function handleMovieBlockClick(movieTitle) {
    const apiUrl = `http://localhost:8000/api/v1/titles/?title=${encodeURIComponent(movieTitle)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const movieDetails = data.results[0];

            const modal = document.getElementById('movieModal');
            const modalTitle = document.getElementById('modalMovieTitle');
            const modalPoster = document.getElementById('modalMoviePoster');
            const modalPoster_bottom = document.getElementById('modalMoviePoster_bottom');
            const modalMovieGenre = document.getElementById('modalMovieGenre');
            const modalMovieDate = document.getElementById('modalMovieDate');
            const modalMovieScore = document.getElementById('modalMovieScore');
            const modalMovieDirector = document.getElementById('modalMovieDirector');
            const modalMovieActors = document.getElementById('modalMovieActors');

            //const modalDescription = document.getElementById('modalMovieDescription');

            modalTitle.textContent = movieDetails.title;
            modalPoster.src = movieDetails.image_url;
            modalPoster_bottom.src = movieDetails.image_url;
            modalMovieGenre.innerHTML = "Genres: " + movieDetails.genres;
            modalMovieDate.innerHTML = "Release: " + movieDetails.year;
            modalMovieScore.innerHTML = "Score: " + movieDetails.imdb_score;
            modalMovieDirector.innerHTML = movieDetails.directors;
            modalMovieActors.innerHTML = "<br> Featuring: " + movieDetails.actors;

            //modalDescription.textContent = movieDetails.description;

            modal.style.display = "block";
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('movieModal');
    modal.style.display = "none";
}

document.querySelector('.close').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    const modal = document.getElementById('movieModal');
    if (event.target === modal) {
        const modal = document.getElementById('movieModal');
        modal.style.display = "none";
    }
});


// Select all movie blocks and add click listeners
document.querySelectorAll('.movie_block').forEach(movieBlock => {
    movieBlock.addEventListener('click', () => {
        const movieTitleElement = movieBlock.querySelector('.movie_block_name');
        if (movieTitleElement) {
            const movieTitle = movieTitleElement.textContent;
            handleMovieBlockClick(movieTitle);
        }
    });
});

// best MOVIE detail button
document.getElementById('best_movie_details_button').addEventListener('click', () => {
    const movieTitleElement = document.getElementById('best_movie_title_content');
    if (movieTitleElement) {
        const movieTitle = movieTitleElement.textContent;
        handleMovieBlockClick(movieTitle);
    }
});


// best MOVIE section
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

// best MOVIES section
getTopMoviesByGenre("", 7).then(topMovies => {
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

// Fixed sections
getTopMoviesByGenre("thriller", 6).then(genreOneMovies => {
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

getTopMoviesByGenre("drama", 6).then(genreTwoMovies => {
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


// Custom section
const genreOneSelect = document.getElementById('genre_1_select');
const genreTwoSelect = document.getElementById('genre_2_select');

fetchAllGenreNames().then(genreNames => {
    genreNames.forEach(genreName => {
        genreOneSelect.innerHTML += `<option value="${genreName}">${genreName}</option>`;
        genreTwoSelect.innerHTML += `<option value="${genreName}">${genreName}</option>`;
    })
}).catch(error => {
    console.error('Error:', error);
});

genreOneSelect.addEventListener('change', () => {
    getTopMoviesByGenre(genreOneSelect.value, 6).then(custOneMovies => {
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

genreTwoSelect.addEventListener('change', () => {
    getTopMoviesByGenre(genreTwoSelect.value, 6).then(custTwoMovies => {
    for (let i = 0; i <= 6; i++) {
        const genreOneMovieBlock = document.getElementById(`custom_2_movie_block_${i}`);
        const genreOneMovieName = document.getElementById(`custom_2_movie_name_${i}`);
        if (genreOneMovieBlock && genreOneMovieName) {
            genreOneMovieBlock.style.backgroundImage = `url('${custTwoMovies[i].image_url}')`;
            genreOneMovieName.textContent = custTwoMovies[i].title;
        } else {
            console.log(`Could not find elements for index ${i}`);
        }
    }
    }).catch(error => {
        console.error('Error fetching movies:', error);
    });
});

// Show more button
const showMoreButtons = document.querySelectorAll('.show_more_button');
showMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
        const section = button.closest('.category_section');
        const movieBlocks = section.querySelectorAll('.movie_block');

        movieBlocks.forEach(block => {
            block.style.display = 'block';
        });

        button.style.display = 'none';
    });
});


