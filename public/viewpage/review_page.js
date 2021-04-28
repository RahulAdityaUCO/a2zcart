import * as Element from "./element.js";
import * as Auth from "../controller/auth.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constants from '../model/constant.js'
import * as Home from './home_page.js'

let reviews;
let len;
let prodSummary;
let avgRating;
let actionBtn;

export async function review_page(productId) {
  if (!Auth.currentUser) {
    Element.mainContent.innerHTML = "<h1>Protected Page</h1>";
    return;
  }
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
   
    if 
    (Auth.currentUser &&
    Constants.adminEmails.includes(Auth.currentUser.email)
  ) {
    actionBtn = `
      <button class="btn btn-warning delete-adminreview" value="${reviews[index].id}">Delete</button>
      
    `;
  
    if(reviews[index].mail == Auth.currentUser.email) {
      actionBtn = `
      <button class="btn btn-primary edit-review" value="${reviews[index].id}" data-price="${prodSummary.price}">Edit</button>
      <button class="btn btn-warning delete-review" value="${reviews[index].id}">Delete</button>
    `;

    }
  }
  
  else if(reviews[index].mail == Auth.currentUser.email) {
    actionBtn = `
      <button class="btn btn-primary edit-review" value="${reviews[index].id}" data-price="${prodSummary.price}">Edit</button>
      <button class="btn btn-warning delete-review" value="${reviews[index].id}">Delete</button>
    `;
  }
   
   
   
   
   if (reviews[index].mail == Auth.currentUser.email) {
      actionBtn = `
        <button class="btn btn-primary edit-review" value="${reviews[index].id}" data-price="${prodSummary.price}">Edit</button>
        <button class="btn btn-warning delete-review" value="${reviews[index].id}">Delete</button>
      `;
    } else {
      actionBtn = "";
    }

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

  Element.mainContent.innerHTML = html;

  // Delete action
  const deleteBtn = document.getElementsByClassName("delete-review");

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", function () {
      let tmpid = this.getAttribute("value");
      let ch = confirm("Are you sure ?");
      if (!ch) {
        return;
      }
      FirebaseController.deleteReview(tmpid).then((result) => {
        alert(result.msg);
        window.location.reload();
      });
    });
  }

  // Edit Action
  const editBtn = document.getElementsByClassName("edit-review");

  for (let i = 0; i < editBtn.length; i++) {
    editBtn[i].addEventListener("click", function () {
      let tmpid = this.getAttribute("value");
      let price = this.getAttribute("data-price");

      FirebaseController.getReviewById(tmpid).then((result) => {
        Element.modalReviewTitle.innerHTML = `
        <img src="${result.imageURL}" width="150px">
        <h5>Review For the ${result.imageName}</h5> 
        <h5> Price : ${price}</h5>
        `;
        $("#ratingval").val(result.rating);
        for (let ij = 0; ij < parseInt(result.rating); ij++) {
          document.querySelectorAll('#ratingstars span')[ij].classList.add('mark-color')
        }
        $("#reviewid").val(tmpid);
        $("#content-review").val(result.content);
        $("#modal-review-product").modal("show");
          
      });
      
    });
      
  }
}
