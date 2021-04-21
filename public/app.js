
import * as Routes from "./controller/routes.js"
//use cloud function emulator
if(window.location.host.includes("localhost") || window.location.host.includes("127.0.0.1")){
    firebase.functions().useFunctionsEmulator("http://localhost:5001")
}

window.onload = () =>{
    const path = window.location.pathname
    Routes.routing(path);
}

window.addEventListener('popstate', e =>{
    e.preventDefault()
    const pathname = e.target.location.pathname
    Routes.routing(pathname);
})



import * as Auth from "./controller/auth.js"
Auth.addEventListeners();
import * as HomePage from "./viewpage/home_page.js"
HomePage.addEventListeners();

import * as ProfilePage from "./viewpage/profile_page.js"
ProfilePage.addEventListeners();
import * as ShoppingcartPage from "./viewpage/shoppingcart_page.js"
ShoppingcartPage.addEventListeners();
import * as Edit from './controller/edit_product.js'
Edit.addEventListeners()
import * as Add from './controller/add_product.js'
Add.addEventListeners()

import * as Search from './viewpage/search_page.js'
Search.addEventListeners()

import * as SortByLow from './viewpage/sortlow_page.js'
SortByLow.addEventListeners()

import * as SortByHigh from './viewpage/sorthigh_page.js'
SortByHigh.addEventListeners()

import * as SortByHighPrice from './viewpage/sorthighprice_page.js'
SortByHighPrice.addEventListeners()

import * as SortByLowPrice from './viewpage/sortlowprice_page.js'
SortByLowPrice.addEventListeners()

import * as PurchasePage from './viewpage/purchase_page.js'
PurchasePage.addEventListeners()

import * as WishListPage from './viewpage/wishlist_page.js'
WishListPage.addEventListeners()

