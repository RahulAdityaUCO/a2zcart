import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import { ShoppingCart } from "../model/shoppingcart.js";
import * as Edit from "../controller/edit_product.js";
import * as Add from "../controller/add_product.js";
import { Wishlist } from "../model/wishlsit.js";
import * as ReviewPage from "./review_page.js"


export function addEventListeners() {
  Element.menuButtonHome.addEventListener("click", async () => {
    history.pushState(null, null, Routes.routePathname.HOME);
    const label = Util.disableButton(Element.menuButtonHome);
    await home_page();
    Util.enableButton(Element.menuButtonHome, label);
  });
}

let products;
export let cart;
export async function home_page() {
  
  if (
    Auth.currentUser &&
    Constant.adminEmails.includes(Auth.currentUser.email)
  ) {
    
    let html = `
    <div>
        <button id="button-add-product" class="btn btn-outline-danger">+ Add Product</button>
    </div>
  `;

   try {
    products = await FirebaseController.getProductList();
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

  document
    .getElementById("button-add-product")
    .addEventListener("click", () => {
      Element.formAddProduct.reset();
      Add.resetImageSelection();
      $("#modal-add-product").modal("show");
    });


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

  const editButtons = document.getElementsByClassName('form-edit-product')
  for (let i = 0; i < editButtons.length; i++) {
	editButtons[i].addEventListener('submit' , async e => {
	  e.preventDefault()
	  const button = e.target.getElementsByTagName('button')[0]
	  const label = Util.disableButton(button)
	  await Edit.editProduct(e.target.docId.value)
	  Util.enableButton(button, label)
	})
  }

const deleteButons = document.getElementsByClassName('form-delete-product')
for (let i=0; i < deleteButons.length; i++) {
  deleteButons[i].addEventListener('submit' , async e => {
    e.preventDefault()
    const button = e.target.getElementsByTagName('button')[0]
    const label = Util.disableButton(button)
    await Edit.deleteProduct(e.target.docId.value, e.target.imageName.value)
    Util.enableButton(button, label)
  
  })
}

const addtolistbuttons = document.getElementsByClassName('form-addto-wishlist')
for(let i=0; i < addtolistbuttons.length; i++) {

  addtolistbuttons[i].addEventListener('submit', async e => {
        e.preventDefault()
        const button = e.target.getElementsByTagName('button')[0]
        const label = Util.disableButton(button)
        try {
          const name = e.target.name.value
          const price = e.target.price.value
          const summary = e.target.summary.value
          const imageName = e.target.imageName.value
          const imageURL = e.target.imageURL.value
          const uid = Auth.currentUser.uid
          const wishlist = new Wishlist({
            name: name,
            price: price,
            summary: summary,
            imageName: imageName,
            imageURL: imageURL,
            uid: uid,
          })
          await FirebaseController.addWishList(wishlist)
          Util.enableButton(button, label)
        } catch (e) {
          if (Constant.DEV) console.log(e);
				Util.popupInfo("Post Review Error", JSON.stringify(e));
				return;
        }
  })

}


const reviewForms = document.getElementsByClassName("form-review");
  for (let i = 0; i < reviewForms.length; i++) {
    reviewForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      const productId = e.target.productId.value;
      history.pushState(
        null,
        null,
        Routes.routePathname.REVIEWS + "#" + productId
      );
     // await ReviewPage.review_page(productId);
      // Util.enableButton(button, label);
    });
  }


 }
  
  else {
  
    let html = `<h1>Home Page</h1>`;
    

  try {
    products = await FirebaseController.getProductList();
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

  const addtolistbuttons = document.getElementsByClassName('form-addto-wishlist')
  for(let i=0; i < addtolistbuttons.length; i++) {
  
    addtolistbuttons[i].addEventListener('submit', async e => {
          e.preventDefault()
          const button = e.target.getElementsByTagName('button')[0]
          const label = Util.disableButton(button)
          try {
            const name = e.target.name.value
            const price = e.target.price.value
            const summary = e.target.summary.value
            const imageName = e.target.imageName.value
            const imageURL = e.target.imageURL.value
            const uid = Auth.currentUser.uid
            const wishlist = new Wishlist({
              name: name,
              price: price,
              summary: summary,
              imageName: imageName,
              imageURL: imageURL,
              uid: uid,
            })
            await FirebaseController.addWishList(wishlist)
            Util.enableButton(button, label)
          } catch (e) {
            if (Constant.DEV) console.log(e);
          Util.popupInfo("Post Review Error", JSON.stringify(e));
          return;
          }
    })
  

  }

  const reviewForms = document.getElementsByClassName("form-review");
  for (let i = 0; i < reviewForms.length; i++) {
    reviewForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      const productId = e.target.productId.value;
      history.pushState(
        null,
        null,
        Routes.routePathname.REVIEWS + "#" + productId
      );
      await ReviewPage.review_page(productId);
      // Util.enableButton(button, label);
    });
  }



}
  //if signed in make a new cart
  //if(Auth.currentUser){
  //	  cart = new ShoppingCart(Auth.currentUser.uid);
  //}
}

export function buildProductCard(product, index) {
  if (
    Auth.currentUser &&
    Constant.adminEmails.includes(Auth.currentUser.email)
  ) {
    return `
		
		<div id="card-${product.docId}" class="card" style="width: 20rem;display: inline-block;">
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
      <div>
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
    <div>
    <form class="form-addto-wishlist" method="post>
          <input type="hidden" name="docId" value="${product.docId}">
          <input type="hidden" name="imageName" value="${product.imageName}">
          <input type="hidden" name="imageURL" value="${product.imageURL}">
          <input type="hidden" name="name" value="${product.name}">
          <input type="hidden" name="price" value="${product.price}">
          <input type="hidden" name="summary" value="${product.summary}">
          <button class="btn btn-outline-primary" type="submit">Add to Wishlist</button>
    </form>
    <form class="form-review float-right" method="post">
        <input type="hidden" name="productId" value="${product.docId}">
        <button type="submit" class="btn btn-outline-success" >Reviews </button> 
    </div>
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
        <div>
        <form class="form-addto-wishlist float-left" method="post">
        <input type="hidden" name="docId" value="${product.docId}">
        <input type="hidden" name="imageName" value="${product.imageName}">
        <input type="hidden" name="imageURL" value="${product.imageURL}">
        <input type="hidden" name="name" value="${product.name}">
        <input type="hidden" name="price" value="${product.price}">
        <input type="hidden" name="summary" value="${product.summary}">
        <button class="btn btn-outline-primary" type="submit">Add to Wishlist</button>
        </form>
        <form class="form-review float-right" method="post">
        <input type="hidden" name="productId" value="${product.docId}">
        <button type="submit" class="btn btn-outline-success" >Reviews </button> 
        </div>
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
