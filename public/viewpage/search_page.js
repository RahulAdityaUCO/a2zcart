import * as Element from './element.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from "../model/constant.js"
import * as Home from "./home_page.js"
import * as Routes from '../controller/routes.js'

export function addEventListeners() {

    Element.formSearch.addEventListener('submit', e => {
        e.preventDefault()
         const keywords = e.target.searchKeywords.value.trim()

         if (keywords.length == 0) {
            Util.popupInfo("No search keyword", "Enter search keywords separated by a space")
            return
        }
        const keywordsArray = keywords.toLowerCase().match(/\S+/g)
        const joinedSearchKeys = keywordsArray.join('+')
        history.pushState(null, null, Routes.routePathname.SEARCH + '?query='+joinedSearchKeys)
       
        search_page(keywordsArray)
    })

}

export let cart;
export async function search_page(keywordsArray) {
    let html = '';
    if (!Auth.currentUser) {
        Element.mainContent.innerHTML = '<h1>Protected Page</h1>'
        return
    }

    let products
    try {
        products = await FirebaseController.searchProduct(keywordsArray)
        if (cart && cart.items) {
            cart.items.forEach((item) => {
              const product = products.find((p) => {
                return item.docId == p.docId;
              });
              product.qty = item.qty;
            });
          }
      
          let index = 0;
          products.forEach((product) => {
            html += buildProductCard(product, index);
            ++index;
          });
        } catch (e) {
          if (Constant.DEV) console.log(e);
          Util.popupInfo("get product list error", JSON.stringify(e));
          return;
        }
      
        Element.mainContent.innerHTML = html;
      
        //event listeners
      
        const plusForms = document.getElementsByClassName("form-increase-qty");
        for (let i = 0; i < plusForms.length; i++) {
          plusForms[i].addEventListener("submit", (e) => {
            e.preventDefault();
      
            const p = products[e.target.index.value];
            cart.addItem(p);
            document.getElementById(`qty-${p.docId}`).innerHTML = p.qty;
      
            Element.shoppingcartCount.innerHTML = cart.getTotalQty();
          });
        }
      
        const minusForms = document.getElementsByClassName("form-decrease-qty");
        for (let i = 0; i < minusForms.length; i++) {
          minusForms[i].addEventListener("submit", (e) => {
            e.preventDefault();
      
            const p = products[e.target.index.value];
            cart.removeItem(p);
            document.getElementById(`qty-${p.docId}`).innerHTML =
              p.qty == null || p.qty == 0 ? "Add" : p.qty;
      
            Element.shoppingcartCount.innerHTML = cart.getTotalQty();
          });
        }
      
      
      
      
      
      }
        //if signed in make a new cart
        //if(Auth.currentUser){
        //	  cart = new ShoppingCart(Auth.currentUser.uid);
        //}
      
      export function buildProductCard(product, index) {
        if (
          Auth.currentUser &&
          Constant.adminEmails.includes(Auth.currentUser.email)
        ) {
          return `
              
              <div id="card-${product.docId}" class="card" style="width: 18rem; display: inline-block;">
                  <img src="${product.imageURL}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">
                       ${Util.currency(product.price)} <br> 
                       ${product.summary} 
                    </p>
                     <div class="container pt-3 bg-light ${
                Auth.currentUser ? "d-block" : "d-none"
              }">
                      <form method="post" class="d-inline form-decrease-qty">
                          <input type="hidden" name="index" value="${index}">
                          <button class="btn btn-outline-danger" type="submit">&minus;</button>
                      </form>
                      <div id="qty-${
                product.docId
              }" class="container rounded text-center text-white bg-primary d-inline-block w-50"> 
                          ${product.qty == null || product.qty == 0 ? "Add" : product.qty}
                      </div>
                      <form method="post" class="d-inline form-increase-qty">
                          <input type="hidden" name="index" value="${index}">
                          <button class="btn btn-outline-danger" type="submit">&plus;</button>
                      </form>
                    </div>
                  </div>
                  <form class="form-edit-product float-left" metohd="post">
                          <input type="hidden" name="docId" value="${product.docId}">
                      <button class="btn btn-outline-primary" type="submit">Edit</button>
                    </form>
                    <form class="form-delete-product float-right" metohd="post">
                    <input type="hidden" name="docId" value="${product.docId}">
                    <input type="hidden" name="imageName" value="${product.imageName}">
                    <button class="btn btn-outline-danger" type="submit">Delete</button>
              </form>
            </div>
              
              `;
        } else {
          return `
              
              <div id="card-${product.docId}" class="card" style="width: 18rem; display: inline-block;">
                  <img src="${product.imageURL}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">
                       ${Util.currency(product.price)} <br> 
                       ${product.summary} 
                    </p>
                     <div class="container pt-3 bg-light ${
                Auth.currentUser ? "d-block" : "d-none"
              }">
                      <form method="post" class="d-inline form-decrease-qty">
                          <input type="hidden" name="index" value="${index}">
                          <button class="btn btn-outline-danger" type="submit">&minus;</button>
                      </form>
                      <div id="qty-${
                product.docId
              }" class="container rounded text-center text-white bg-primary d-inline-block w-50"> 
                          ${product.qty == null || product.qty == 0 ? "Add" : product.qty}
                      </div>
                      <form method="post" class="d-inline form-increase-qty">
                          <input type="hidden" name="index" value="${index}">
                          <button class="btn btn-outline-danger" type="submit">&plus;</button>
                      </form>
                    </div>
                  </div>
            </div>
              
              `;
        }
      }
      export function getShoppingCartFromLocalStorage() {
        const cartStr = window.localStorage.getItem(`cart-${Auth.currentUser.uid}`);
      
        cart = ShoppingCart.parse(cartStr);
        if (!cart || !cart.isValid() || Auth.currentUser.uid != cart.uid) {
          window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`);
          cart = new ShoppingCart(Auth.currentUser.uid);
        }
      
        Element.shoppingcartCount.innerHTML = cart.getTotalQty();
      }
      