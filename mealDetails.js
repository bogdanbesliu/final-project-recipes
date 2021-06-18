const ingredients = [];
const measures = [];
const favMeals = [];
const shoppingItems = [];
const recipe = [];
const container = document.querySelector('.container');
const headerDiv = document.querySelector('.header');
const nutritionDiv = document.querySelector('.nutritionValues');
const ingredientDiv = document.querySelector('.ingredient-list');
const instructionsDiv = document.querySelector('.instructions');
const shoppingList = document.querySelector('.shopping-list');
const shoppingCart = document.querySelector('.sc');
const modal = document.querySelector('#modal');
const closeModal = document.querySelector('.close');
const nutritionModal = document.querySelector('#nutrition-modal');
const closeNutritionModal = document.querySelector('.close-nutrition');
const nutritionValues = document.querySelector('.nutritional-list');
const calorieArea = document.querySelector('.calorie-count');
const calories = document.querySelector('.calories');
const nutritionBtn = document.querySelector('.nutrition');
const removeAllItems = document.querySelector('.remove-all');
const NutritionUrl =
  'https://api.edamam.com/api/nutrition-details?app_id=f802b508&app_key=4c0ca319659b29ee846b94193850f060';
let shoppingListItems = [];
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
      recipe.push(meal[`strMeasure${i}`] + ' ' + meal[`strIngredient${i}`]);
    } else {
      break;
    }
  }

  ingredients.forEach(() => {
    g++;
    let x = document.createElement('p');
    x.classList.add('add-to-list');
    x.innerHTML = `<i class="fas fa-plus-circle plus" data-ingredient="${ingredients[g]}" data-measure="${measures[g]}"></i>`;
    x.setAttribute('title', 'Add item to shopping-list');
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
    <i class="favorite ${favStar} fa-star" title="Set recipe as favorite"></i>
    <a href="index.html"><i class="fas fa-home" title="Back to home page"></i></a>
    </div>
    </div>
    <p class="meal-category">Category: ${meal.strCategory}</p>
    <p class="meal-area">Food culture of origin: ${meal.strArea}</p>`;
  generatedHTML2 = `
    <h2 class="instructions-title">Cooking instructions</h2>
    <p class="meal-instructions">${meal.strInstructions}</p>
  </main>
  `;

  let iT = document.createElement('h2');
  iT.innerText = 'Ingredients';
  iT.classList.add('instructions-title', 'innerTitle');

  headerDiv.innerHTML = generatedHTML1;
  container.appendChild(headerDiv);
  container.appendChild(calorieArea);
  container.appendChild(iT);
  container.appendChild(ingredientDiv);
  instructionsDiv.innerHTML = generatedHTML2;
  container.appendChild(instructionsDiv);
  getNutritionValues(meal);
}
getMealDetails();

const addSelector = '.plus';
ingredientDiv.addEventListener('click', (e) => {
  let el = e.target;
  if (el.matches(addSelector)) {
    let item = e.target.dataset.ingredient;
    addToShoppingList(item);
  }
});

function addToShoppingList(item) {
  shoppingItems.push(item);
  let y = document.createElement('div');
  let w = document.createElement('i');
  w.setAttribute('title', 'Remove item from shopping-list');
  w.classList.add('fas', 'fa-minus-circle', 'minus');
  y.appendChild(w);
  let x = document.createElement('p');
  x.classList.add('shopping-item');
  shoppingCart.dataset.nrItems = shoppingList.children.length += 1;
  x.innerText = item;
  y.appendChild(x);
  shoppingList.appendChild(y);
  saveData(item);
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

closeModal.onclick = function (e) {
  modal.style.display = 'none';
};

document.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
};

closeNutritionModal.onclick = function () {
  nutritionModal.style.display = 'none';
};

window.onclick = function (e) {
  if (e.target == nutritionModal) {
    nutritionModal.style.display = 'none';
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

window.addEventListener('load', function () {
  loadData();
});

removeAllItems.addEventListener('click', () => {
  shoppingList.innerHTML = '';
  shoppingCart.dataset.nrItems = 0;
  saveData();
});

nutritionBtn.addEventListener('click', () => {
  nutritionModal.style.display = 'block';
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

function removeIngredientFromList(item) {
  const retrieveMeals = localStorage.getItem('ingredients');
  const meals = JSON.parse(retrieveMeals);
  localStorage.setItem('ingredients', JSON.stringify(removeMeal(meals, item)));
}

function removeMealFromFavorites(item) {
  const retrieveMeals = localStorage.getItem('mealUrl');
  const meals = JSON.parse(retrieveMeals);
  localStorage.setItem('mealUrl', JSON.stringify(removeMeal(meals, item)));
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

async function getNutritionValues(meal) {
  const recipeBody = {
    title: meal.StrMeal,
    ingr: recipe,
  };
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeBody),
  };
  try {
    const fetchResponse = await fetch(NutritionUrl, settings);
    const data = await fetchResponse.json();
    console.log(data);
    calories.innerText = `${data.calories} cal`;
    nutritionDiv.innerHTML = `
    <div class="nutrition-facts">
    <div class="nutrition-item">
    <span class="nutrition-item-label">Calories</span>
    <span class="nutrition-item-content">${data.calories}</span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
    ${
      data.totalNutrients.CHOCDF.label
    }</span><span class="nutrition-item-content">${data.totalNutrients.CHOCDF.quantity.toFixed(
      2
    )} ${data.totalNutrients.CHOCDF.unit} </span>
</div>
<div class="nutrition-item">
<span class="nutrition-item-label">
  ${
    data.totalNutrients.SUGAR.label
  }</span><span class="nutrition-item-content">${data.totalNutrients.SUGAR.quantity.toFixed(
      2
    )} ${data.totalNutrients.SUGAR.unit} </span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
  ${
    data.totalNutrients.FAT.label
  }</span><span class="nutrition-item-content">${data.totalNutrients.FAT.quantity.toFixed(
      2
    )} ${data.totalNutrients.FAT.unit} </span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
  ${
    data.totalNutrients.FAMS.label
  } fats</span><span class="nutrition-item-content">${data.totalNutrients.FAMS.quantity.toFixed(
      2
    )} ${data.totalNutrients.FAMS.unit} </span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
  ${
    data.totalNutrients.FASAT.label
  } fats</span><span class="nutrition-item-content">${data.totalNutrients.FASAT.quantity.toFixed(
      2
    )} ${data.totalNutrients.FASAT.unit} </span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
  ${
    data.totalNutrients.FATRN.label
  } fats</span><span class="nutrition-item-content">${data.totalNutrients.FATRN.quantity.toFixed(
      2
    )} ${data.totalNutrients.FATRN.unit} </span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
  ${
    data.totalNutrients.FIBTG.label
  }</span><span class="nutrition-item-content">${data.totalNutrients.FIBTG.quantity.toFixed(
      2
    )} ${data.totalNutrients.FIBTG.unit} </span>
    </div>
    <div class="nutrition-item">
    <span class="nutrition-item-label">
  ${
    data.totalNutrients.PROCNT.label
  }</span><span class="nutrition-item-content">${data.totalNutrients.PROCNT.quantity.toFixed(
      2
    )} ${data.totalNutrients.PROCNT.unit} </span>
    </div>
    </div>
    `;
  } catch (e) {
    console.log('error:', e);
  }
}

nutritionValues.appendChild(nutritionDiv);
