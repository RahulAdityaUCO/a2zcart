import * as Element from "./element.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constants from "../model/constant.js";
import * as Home from "./home_page.js";
import * as Routes from "../controller/routes.js";

let reviews;
let len;
let prodSummary;
let avgRating;
let actionBtn;
export async function productreview_page(productId) {
 
  try {
    reviews = await FirebaseController.getReviews(productId);
    if (!reviews.review || reviews.review.length == 0) {
      Element.mainContent.innerHTML = "No Reviews Found";
      return;
    }
  } catch (err) {}
  len = reviews.len;
  prodSummary = reviews.prodSummary;
  avgRating = reviews.avgRating;
  reviews = reviews.review;
  let html = `<h1>Reviews</h1>`;

  html += `
		<div class="row">
	`;

  for (let index = 0; index < reviews.length; index++) {
    let rate = "";
    let dt = new Date(reviews[index].timeStamp);
    

    if (index == 0) {
      html += `
            <div class="col-12">
              <img src="${prodSummary.imageURL}" style="width: 100%;max-width: 400px;">
              <p>Name : ${prodSummary.name}</p>
              <p>Price : ${prodSummary.price}</p>
              <p>Summary : ${prodSummary.summary}</p>
              <p>Rating : ${avgRating} out of 5</p>
              <div class="progress">
              <div class="progress-bar bg-warning" role="progressbar" style="width: ${parseInt((avgRating * 100)/5)}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          `;
    }
    let tmp = parseInt(reviews[index].rating);
    for (let i2 = 0; i2 < tmp; i2++) {
      rate += `  <span class="starrating fa fa-star" style="color:yellow;"></span>`;
    }

    html += `
                   <div class="col-12" style="
                   background-color: #fff;
                   margin: 8px 0;
                   padding: 1em;">
                   ${actionBtn}
                   <h3>Rating :  ${rate}</h3>
                     <p>${reviews[index].content}</p>
                     <span style="
                        font-size: 14px;
                        margin-right: 20px;">${reviews[index].mail}</span>
                     <span style="
                     font-size: 14px;
                     ">${dt.toLocaleString()}</span>
                   </div>
                `;
  }

  if (len != undefined) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let pdid = url.searchParams.get("id");
    let pg = url.searchParams.get("page");

    if (pg == null) {
      pg = 1;
    }
    html += `<div><ul style="list-style: none;display: inline-flex">`;

    for (let j = 0; j <= len; j++) {
      let activePg = "btn-primary";
      if (pg == j + 1) {
        activePg = "btn-success";
      }
      html += `<li><a href="${window.location.origin}/reviews?id=${pdid}&page=${
        j + 1
      }" class="btn ${activePg}">${j + 1}<a/></li>`;
    }
    html += `</ul></div>`;
  }
  html += `</div>`;

 
}
