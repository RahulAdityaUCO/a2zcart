import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Util from "./util.js";
import * as Constant from "../model/constant.js";
import { Review } from "../model/review.js";

let GlobalproductName;

export function addEventListeners() {
  Element.menuButtonPurchase.addEventListener("click", async () => {
    history.pushState(null, null, Routes.routePathname.PURCHASES);
    purchase_page();
  });
  Element.formWriteReview.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = Element.formWriteReview.getElementsByTagName("button");
    const label = Util.disableButton(button[0]);
    try {
      const prodId = e.target.prodId.value;
      const content = e.target.content.value;
      const mail = Auth.currentUser.email;
      const imageURL = e.target.productImageURL.value;
      const imageName = e.target.productName.value;
      const rating = e.target.ratingval.value;
      const reviewId = e.target.reviewid.value;

      const review = new Review({
        prodId: prodId,
        content: content,
        mail: mail,
        imageURL: imageURL,
        imageName: imageName,
        rating: rating,
      });
      if (reviewId) {
        let dataUpdate = {
          content: content,
          rating: rating,
        };
        FirebaseController.updateReview(reviewId, dataUpdate).then((result) => {
          window.location.reload();
        });
      } else {
        await FirebaseController.addReview(review);
      }

      Util.enableButton(button[0], label);
      $("#modal-review-product").modal("hide");
      Element.formWriteReview.reset();
      Util.popupInfo(
        `${GlobalproductName} Review has beeen posted`,
        "Content: " + content
      );
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo("Post Review Error", JSON.stringify(e));
      return;
    }
  });
}

let carts;

export async function purchase_page() {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = `<h1>Protected</h1>`;
    return;
  }

  try {
    carts = await FirebaseController.getPurchaseHistroy(Auth.currentUser.uid);
    if (!carts || carts.length == 0) {
      Element.mainContent.innerHTML = "No Purchase History Found";
      return;
    }
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Purchase History Error", JSON.stringify(e));
    return;
  }
  let html = `<h1>Purchase History</h1>`;

  html += `
		<table class="table table-striped">
		<thead>
		<tbody>
	`;
  for (let index = 0; index < carts.length; index++) {
    html += `
				<tr><td>
					<form class="purchase-history" method="post">
						<input type="hidden" name="index" value="${index}">
						<button class="btn btn-outline-secondary" type="submit">
							${new Date(carts[index].timestamp).toString()}
						</button> 
					</form>
				</td></tr>
			`;
  }

  html += `</tbody> </thead>`;

  Element.mainContent.innerHTML = html;

  const historyForms = document.getElementsByClassName("purchase-history");
  for (let i = 0; i < historyForms.length; i++) {
    historyForms[i].addEventListener("submit", (e) => {
      e.preventDefault();
      const index = e.target.index.value;
      Element.modalTransactionTitle.innerHTML = `Purchases at: ${new Date(
        carts[index].timestamp
      ).toString()}`;
      Element.modalTransactionBody.innerHTML = buildTransactionDetail(
        carts[index]
      );
      $("#modal-transaction").modal("show");

      let ReviewButton = document.getElementsByClassName("form-write-review");

      for (let k = 0; k < ReviewButton.length; k++) {
        ReviewButton[k].addEventListener("submit", async (e) => {
          e.preventDefault();
          const button = e.target.getElementsByTagName("button")[0];
          const prodId = e.target.prodId.value;
          const productPrice = e.target.productPrice.value;
          const productImageURL = e.target.productImageURL.value;
          const productName = e.target.productName.value;
          $("#reviewid").val("");
          GlobalproductName = productName;
          $("#modal-transaction").modal("hide");
          Element.modalReviewTitle.innerHTML = `
					<img src="${productImageURL}" width="150px">
					<h5>Review For the ${productName}</h5> 
					<h5> Price : ${productPrice}</h5>
					`;
          Element.formWriteReviewProductId.value = prodId;
          Element.ProductImageURL.value = productImageURL;
          Element.ProductImageName.value = productName;
          $("#modal-review-product").modal("show");
        });
      }
    });
  }
}

function buildTransactionDetail(cart) {
  let html = `
		<table class="table table-striped">
			<thead>
				<tr>
					<th scope="col">Image</th>
					<th scope="col">Name</th>
					<th scope="col">Price</th>
					<th scope="col">Qty</th>
					<th scope="col">Subtotal</th>
					<th scope="col" width="50%">Summary</th>
				</tr>
			</thead>
		<tbody>
	`;
  cart.items.forEach((item) => {
    html += `
			<tr>
				<td><img src="${item.imageURL}" width="150px"></td>
				<td>${item.name}</td>
				<td>${Util.currency(item.price)}</td>
				<td>${item.qty}</td>
				<td>${Util.currency(item.price * item.qty)}</td>
				<td>${item.summary}</td>	
				<td> 
				<form class="form-write-review">
				<input type="hidden" name="prodId" value="${item.docId}">
				<input type="hidden" name="productName" value="${item.name}">
				<input type="hidden" name="productPrice" value="${item.price}">
				<input type="hidden" name="productImageURL" value="${item.imageURL}">
				<button type="submit" class="btn btn-outline-danger">Write a review</button>
			  </form>
		  	</td>
				</tr>

			`;
  });

  html += `</tbody></table>`;
  html += `<div style="font-size: 150%;">Total: $${cart.getTotalPrice()}</div>`;

  return html;
}
