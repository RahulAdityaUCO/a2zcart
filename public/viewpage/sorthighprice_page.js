import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Home from './home_page.js';
import { Wishlist } from "../model/wishlsit.js";
import * as ReviewPage from "./review_page.js";




export function addEventListeners() {
  Element.menuHighPrice.addEventListener("click", async () => {
    history.pushState(null, null, Routes.routePathname.SORTBYHIGHPRICE);
    const label = Util.disableButton(Element.menuHighPrice);
    await sorthighprice_page();
    Util.enableButton(Element.menuHighPrice, label);
  });
}

let productList;

export async function sorthighprice_page() {
    
   

   try {
    productList = await FirebaseController.getProductHighPrice();
      if(productList.length > 0) 
      {
        Element.mainContent.innerHTML=buildHomeScreen(productList)
      }
      else
      {
          Element.mainContent.innerHTML='<h2>No Product Found</h1>'

      }
    }  catch(e)
  {
      if(Constant.DEV) console.log(e)
      return
  }


  const plusForms = document.getElementsByClassName('form-increase-qty')
  for(let i = 0; i < plusForms.length; i++)
  {
  plusForms[i].addEventListener('submit', e => {
  e.preventDefault()
  const p = productList[e.target.index.value]
  Home.cart.addItem(p)
  document.getElementById(`qty-${p.docId}`).innerHTML = p.qty
  Element.shoppingcartCount.innerHTML =Home.cart.getTotalQty()
}
)
}


  const minusForms = document.getElementsByClassName('form-decrease-qty')
  for(let i=0;i<minusForms.length;i++)
  {
      
  minusForms[i].addEventListener('submit', e => {
  e.preventDefault()
  const p = productList[e.target.index.value]
  Home.cart.removeItem(p)
  document.getElementById(`qty-${p.docId}`).innerHTML 
  = (p.qty == null || p.qty == 0) ? 'Add' : p.qty
  Element.shoppingcartCount.innerHTML = Home.cart.getTotalQty()

})
  }



  const addtolistbuttons = document.getElementsByClassName(
    "form-addto-wishlist"
  );
  for (let i = 0; i < addtolistbuttons.length; i++) {
    addtolistbuttons[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = e.target.getElementsByTagName("button")[0];
      const label = Util.disableButton(button);
      try {
        const name = e.target.name.value;
        const price = e.target.price.value;
        const summary = e.target.summary.value;
        const imageName = e.target.imageName.value;
        const imageURL = e.target.imageURL.value;
        const uid = Auth.currentUser.uid;
        const docId = e.target.docId.value;
        const wishlist = new Wishlist({
          name: name,
          price: price,
          summary: summary,
          imageName: imageName,
          imageURL: imageURL,
          uid: uid,
          docId: docId
        });
        await FirebaseController.addWishList(wishlist);
        Util.enableButton(button, label);
      } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.popupInfo("Post Review Error", JSON.stringify(e));
        return;
      }
    });
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


function buildHomeScreen(products)
{
  
  let html = ` 
  <h1>Sortby low price</h1>
  `
 
      if(Home.cart && Home.cart.items)
      {
          Home.cart.items.forEach(item => 
              {
                  const product = products.find(p =>
                      {
                         return item.docId  == p.docId
                      })
                      if(product)
                      {
                          product.qty = item.qty
                      }
              })
      }
      html+=`
     </div>
      `
      let index = 0
      products.forEach(product =>
          {
              html += Home.buildProductCard(product,index)
              ++index
          })
   
  return html
}
