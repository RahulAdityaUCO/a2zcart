import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js"
import { ShoppingCart } from "../model/shoppingcart.js";

export function addEventListeners() {
  Element.menuButtonWishList.addEventListener("click", async () => {

		
    history.pushState(null, null, Routes.routePathname.WISHLIST);
    const label = Util.disableButton(Element.menuButtonWishList)
	await wishlist_page();
	Util.enableButton(Element.menuButtonWishList,label)
  });
}

let products;
export let cart
export async function wishlist_page() {
  let html = `<h1>Mywishlist Page</h1>`;
 
const uid = Auth.currentUser.uid;
  try {
    products = await FirebaseController.getwishlist(uid);
	if(cart && cart.items){
		cart.items.forEach(item =>{
			const product = products.find(p => {
				return item.docId == p.docId
			})
			product.qty = item.qty
		})
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

  


  const removefromWishList = document.getElementsByClassName("form-remove-wishlist");
    for (let i = 0; i < removefromWishList.length; i++) {
      removefromWishList[i].addEventListener("submit", async (e) => {
        e.preventDefault();
        const button = e.target.getElementsByTagName("button")[0];
        const label = Util.disableButton(button);
          try {
            const docId = e.target.docId.value;
            await FirebaseController.deleteWishList(docId)
            Util.enableButton(button, label);
			const card = document.getElementById(`card-${docId}`)
         	card.remove()
         	Util.popupInfo('Deleted', `${docId} has been successfully deleted`)
          } catch (e) {
            if (Constant.DEV) console.log(e);
          Util.popupInfo("Delete wihlist Error", JSON.stringify(e));
          return;
          }
      })
	}

}

function buildProductCard(product,index) {
  return `
		
		<div id="card-${
			product.docId
		  }" class="card" style="width: 18rem; display: inline-block;">
			<img src="${product.imageURL}" class="card-img-top">
			<div class="card-body">
		 	 <h5 class="card-title">${product.name}</h5>
		 	 <p class="card-text">
			 	${Util.currency(product.price)} <br> 
				 ${product.summary} 
			  </p>
		 	  <div class="container pt-3 bg-light ${Auth.currentUser ? 'd-block' : 'd-none'}">
			<form class="form-remove-wishlist float-left" method="post">
        	<input type="hidden" name="docId" value="${product.docId}">
        	<button class="btn btn-outline-primary" type="submit">Remove from Wishlist</button>
        	</form>
			  </div>
			</div>
	  </div>
		
		`;
}
export function	getShoppingCartFromLocalStorage(){

	const cartStr = window.localStorage.getItem(`cart-${Auth.currentUser.uid}`)
	
	
		cart = ShoppingCart.parse(cartStr);
		if(!cart || !cart.isValid() || Auth.currentUser.uid != cart.uid){
			window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`)
			cart = new ShoppingCart(Auth.currentUser.uid)
		}

	Element.shoppingcartCount.innerHTML = cart.getTotalQty()
}