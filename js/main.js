"use strict";

let myhttp = new XMLHttpRequest();
let row = document.querySelector("#recipeRow");
let selected = document.querySelector("#categorySelect");
let searchInput = document.querySelector("#searchInput");
let recipes = [];

getdata(`pizza`);

selected.addEventListener("change", function() {
    getdata(this.value);
});
searchInput.addEventListener("input", function() {
    search(this.value);
});
function getdata(query) {
    myhttp.open("GET", `https://forkify-api.herokuapp.com/api/search?q=${query}`);
    myhttp.send();
    myhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4) {
            let alldata = JSON.parse(myhttp.response);
            recipes = alldata.recipes;
            showdata(recipes); 
        }
    });
}
function showdata(arr) {
    let cartona = ``;
    for (let i = 0; i < arr.length; i++) {
        cartona += `
            <div class="col-md-4">
                <img class="mb-2" src="${arr[i].image_url}" alt="">
                <p><b>Title:</b>${arr[i].title}</p>
                <p><b>Recipe Id:</b>${arr[i].recipe_id}</p>
                <p><b>Publisher:</b>${arr[i].publisher}</p>
                <p><b>Social Rank:</b>${arr[i].social_rank}</p>
            </div>`;
    }
    row.innerHTML = cartona;
}
function search(query) {
    if (!query) {
        showdata(recipes);
        return;
    }

    let filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase())
    );

    let highlightedRecipes = filteredRecipes.map(recipe =>{
        let highlightedTitle = recipe.title.toLowerCase().replaceAll(
            query.toLowerCase(),
            `<span class="text-warning">${query.toLowerCase()}</span>`
        );
        return { ...recipe, title: highlightedTitle };
    });

    showdata(highlightedRecipes);
}
