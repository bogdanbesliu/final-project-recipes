// Targeting the HTML elements and declaring variables

const searchBtn = document.querySelector('.search-btn');
const searchForm = document.querySelector('.search');
const searchContainer = document.querySelector('.search-meals');
const randomMeal = document.querySelector('.main-container');
const ingSearch = document.querySelectorAll('[data-ingredient]');
const btt = document.querySelector('.btt');
const favoriteMeals = JSON.parse(localStorage.getItem('mealUrl'));
const favoriteMealsContainer = document.querySelector(
  '.favorite-meals-container'
);
let recipeUrl = [];
let searchQuerry = '';

// Event listener for the search bar

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.querySelector('input').value === '') {
    return 0;
  }
  searchQuerry = e.target.querySelector('input').value;
  sendApiRequest();
});

// The search function that uses The Meal DP API

async function sendApiRequest() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuerry}`
  );
  let data = await response.json();
  useApiData(data);
}

// Using the data to populate the search container

function useApiData(results) {
  let generatedHTML = '';
  if (results.meals === null) {
    generatedHTML += `<p>No meals found</p>`;
  } else {
    results.meals.map((result) => {
      generatedHTML += `
  <a href="mealDetails.html?id=${result.idMeal}">   
  <div class="cardfav">
  <img src="${result.strMealThumb}" alt="" class="meal-img">
  <h2 class="meal-title">${result.strMeal}</h2>
  </div>
  </a>
  `;
    });
  }
  searchContainer.innerHTML = generatedHTML;
  searchForm[0].value = '';
  document.getElementById('search-container').scrollIntoView();
}

// Random meal from The Meal DP API

async function getRandomMeal() {
  let response = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php'
  );
  let data = await response.json();
  let mealId = data.meals[0].idMeal;
  let generatedHTML = '';
  generatedHTML += `
  <a href="mealDetails.html?i=${mealId}">
  <div class="random-meal">
  <img src="${data.meals[0].strMealThumb}" alt="Meal photo" class="meal-photo">
  <div class="title-box">
  <h2 class="random-meal-title">${data.meals[0].strMeal}</h2>
  </div>
  </div>
  </a>`;
  randomMeal.innerHTML = generatedHTML;
  return mealId;
}

getRandomMeal();

// Preset ingredient sugestions

ingSearch.forEach(function (button) {
  button.addEventListener('click', () => {
    searchForm[0].value = button.value;
    console.log(button.value);
  });
});

// Grabing favorite meals from Local Storage & using them on index in the dedicated section

favoriteMeals.forEach(async (elem) => {
  let response = await fetch(elem);
  let data = await response.json();
  let favDiv = document.createElement('div');
  favDiv.classList.add('fav-card');
  favDiv.innerHTML = `
  <a href="mealDetails.html?i=${data.meals[0].idMeal}">
  <img src="${data.meals[0].strMealThumb}" class="fav-img" />
  <h2>${data.meals[0].strMeal}</h2>
  </a>
  `;
  favoriteMealsContainer.appendChild(favDiv);
});

// Scroll to top button

btt.addEventListener('click', topFunction);

function topFunction() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0; // For Safari
}
