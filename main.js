let apiKey = prompt("Rentre ici ta clée d'API OMDb  🔑");
let URL = `https://www.omdbapi.com/?apikey=${apiKey}&`;

document.getElementById("search-form").onsubmit = (e) => {
  e.preventDefault();
  submitForm();
};

const selector = document.getElementById("movies");

let observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0.1) {
        entry.target.classList.remove("not-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: [0.5],
  }
);

const intersectionObserver = () => {
  let films = document.querySelectorAll(".film");
  films.forEach(function (film) {
    film.classList.add("not-visible");
    observer.observe(film);
  });
};

const submitForm = () => {
  let userSearch = document.getElementById("search");
  selector.innerHTML = "";
  getData(userSearch);
};

const displayFilms = (movies) => {
  movies.forEach((movie) => {
    showFilm(selector, movie.Poster, movie.Title, movie.Year, movie.imdbID);
  });

  intersectionObserver();
  let seeMoreButtons = document.getElementsByClassName(`see-more`);
  for (let i = 0; i < seeMoreButtons.length; i++) {
    seeMoreButtons[i].addEventListener("click", function (event) {
      event.preventDefault();
      seeMore(movies[i].imdbID);
    });
  }
};

const showFilm = (selector, cover, name, releaseDate, id) => {
  selector.innerHTML += `
    <div class="card flex-row flex-wrap p-4 ml-0 mt-5 film">
      <div class="border-0 movie-picture-place">
          <img src="${cover}" alt="movie-picture" class="movie-picture">
      </div>
      <div class="card-block px-2">
        <h4 class="card-title title">${name.toUpperCase()}</h4>
        <p class="card-text">Date de sortie : <strong>${releaseDate}</strong></p>
        <button type="button" class="btn btn-primary see-more mt-3" data-toggle="modal" data-target="#modal">
          Plus d'information
        </button>
      </div>
    </div>
  `;
};

const showMore = (movie) => {
  let modal = document.getElementById(`modal-content`);
  modal.innerHTML = `
    <div class="modal-header">
      <h4 class="modal-title title font-weight-bold">${movie.Title}</h5>
      <button type="button" class="close" id="close-${movie.imdbID}" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true" id="span">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <strong>Genre : </strong>${movie.Genre}<br><br>
      <strong>Réalisateur : </strong>${movie.Director}<br><br>
      <strong>Acteurs : </strong>${movie.Actors}<br><br>
      <strong>Résumé : </strong> ${movie.Plot}<br>
    </div>
  `;
};

// API request to show films
const getData = (userSearch) => {
  fetch(URL + `s=${userSearch.value}`)
    .then((response) => response.json())
    .then((response) => {
      let movies = response.Search;
      displayFilms(movies);
    })
    .catch((error) => {
      selector.innerHTML = `
        <h3 class="text-secondary text-center" id="message">
        🤨<br>
        Dsl aucun résultat ne correspond à votre recherche.</h3>`;
      console.error("error:", error);
    });
};

// API request to show more about the film
const seeMore = (id) => {
  fetch(URL + `i=${id}&plot=full`)
    .then((response) => response.json())
    .then((response) => {
      showMore(response);
    })
    .catch((error) => {
      console.error("error:", error);
    });
};
