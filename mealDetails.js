const ingredients = [];
const measures = [];
const container = document.querySelector('.container');
const headerDiv = document.querySelector('.header');
const ingredientDiv = document.querySelector('.ingredient-list');
const instructionsDiv = document.querySelector('.instructions');
const shoppingList = document.querySelector('.shopping-list');
const shoppingCart = document.querySelector('.sc');
const modal = document.querySelector('#modal');
const closeModal = document.querySelector('.close');
const removeAllItems = document.querySelector('.remove-all');
const favMeals = [];
const shoppingItems = [];
let favStatus = false;
let g = -1;

function getId() {
  const search = location.search.substr(1);
  const id = search.split('=');
  return id[1];
}

const url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + getId();

async function getMealDetails() {
  let response = await fetch(url);
  let data = await response.json();
  const meal = data.meals[0];
  document.title = meal.strMeal;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]}`);
      measures.push(`${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  ingredients.forEach(() => {
    g++;
    let x = document.createElement('p');
    x.classList.add('add-to-list');
    x.innerHTML = `<i class="fas fa-plus-circle plus" data-ingredient="${ingredients[g]}" data-measure="${measures[g]}"></i>`;
    let y = document.createElement('div');
    let z = document.createElement('span');
    let w = document.createElement('span');
    w.innerHTML = ingredients[g];
    z.innerHTML = measures[g];
    y.appendChild(x);
    y.appendChild(w);
    y.appendChild(z);
    ingredientDiv.appendChild(y);
  });
  let generatedHTML1 = '';
  let generatedHTML2 = '';
  let favStar = '';
  if (checkLocalStorage(url)) {
    favStar = 'fas';
  } else {
    favStar = 'far';
  }
  generatedHTML1 = `
  <img src="${meal.strMealThumb}" alt="Meal photo" class="meal-img" />
  <main class="meal-container">
  <div class="top-line">
    <h1 class="meal-title">${meal.strMeal}</h1>
    <div class="buttons">
    <i class="favorite ${favStar} fa-star"></i>
    <a href="index.html"><i class="fas fa-home"></i></a>
    </div>
    </div>
    <p class="meal-category">Category: ${meal.strCategory}</p>
    <p class="meal-area">Food culture of origin: ${meal.strArea}</p>`;
  generatedHTML2 = `
    <p class="meal-instructions">${meal.strInstructions}</p>
  </main>
  `;
  headerDiv.innerHTML = generatedHTML1;
  container.appendChild(headerDiv);
  container.appendChild(ingredientDiv);
  instructionsDiv.innerHTML = generatedHTML2;
  container.appendChild(instructionsDiv);
}
getMealDetails();

const addSelector = '.plus';
ingredientDiv.addEventListener('click', (e) => {
  let el = e.target;
  if (el.matches(addSelector)) {
    let item = e.target.dataset.ingredient;
    //    el.classList.add('disable');
    addToShoppingList(item);
  }
});

function addToShoppingList(item) {
  shoppingItems.push(item);
  let y = document.createElement('div');
  let w = document.createElement('i');
  w.classList.add('fas', 'fa-minus-circle', 'minus');
  y.appendChild(w);
  let x = document.createElement('p');
  x.classList.add('shopping-item');
  console.log(shoppingCart.dataset.nrItems);
  console.log(shoppingList.children);
  console.log(shoppingList.children.length);
  shoppingCart.dataset.nrItems = shoppingList.children.length += 1;
  x.innerText = item;
  y.appendChild(x);
  shoppingList.appendChild(y);
  saveData();
}

const extractSelector = '.minus';
shoppingList.addEventListener('click', (e) => {
  let el = e.target;
  if (el.matches(extractSelector)) {
    let item = e.target.parentElement;
    removeFromShoppingList(item);
  }
});

function removeFromShoppingList(item) {
  shoppingList.removeChild(item);
  shoppingCart.dataset.nrItems = shoppingList.children.length--;

  saveData();
}

//Modal

shoppingCart.onclick = function () {
  modal.style.display = 'block';
};

closeModal.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
};

function saveData() {
  localStorage.setItem('shoppinglist', shoppingList.innerHTML);
  localStorage.setItem('itemsNr', shoppingCart.dataset.nrItems);
}

function loadData() {
  if (localStorage.getItem('itemsNr') === null) {
    localStorage.setItem('itemsNr', 0);
  }
  shoppingList.innerHTML = localStorage.getItem('shoppinglist');
  shoppingCart.dataset.nrItems = localStorage.getItem('itemsNr');
}

// function clearData() {
//   shoppingList.innerHTML = '';
//   shoppingCart.dataset.nrItems = 0;
// }

window.addEventListener('load', function () {
  loadData();
});

removeAllItems.addEventListener('click', () => {
  shoppingList.innerHTML = '';
  shoppingCart.dataset.nrItems = 0;
  saveData();
});

const favSelector = '.favorite';
headerDiv.addEventListener('click', (e) => {
  let el = e.target;
  if (el.matches(favSelector)) {
    if (el.classList.contains('far')) {
      addMealToFavorites(url);
      el.classList.remove('far');
      el.classList.add('fas');
    } else {
      removeMealFromFavorites(url);
      el.classList.remove('fas');
      el.classList.add('far');
    }
  }
});

function addMealToFavorites(item) {
  if (localStorage.getItem('mealUrl') === null) {
    localStorage.setItem('mealUrl', '[]');
  }
  const meals = JSON.parse(localStorage.getItem('mealUrl' || '[]'));
  if (!meals.includes(item)) {
    meals.push(item);
    localStorage.setItem('mealUrl', JSON.stringify(meals));
  } else {
    console.log(item + ' already exists');
  }
}

function removeMealFromFavorites(item) {
  const retrieveMeals = localStorage.getItem('mealUrl');
  const meals = JSON.parse(retrieveMeals);
  localStorage.setItem('mealUrl', JSON.stringify(removeMeal(meals, item)));
  console.log(meals);
  // localStorage.setItem('mealUrl', favMeals);
}

function removeMeal(array, value) {
  return array.filter(function (ele) {
    return ele != value;
  });
}

function checkLocalStorage(item) {
  if (localStorage.getItem('mealUrl') === null) {
    localStorage.setItem('mealUrl', '[]');
  }
  const meals = JSON.parse(localStorage.getItem('mealUrl' || '[]'));
  if (meals.includes(item)) {
    favStatus = true;
  }
  return favStatus;
}
