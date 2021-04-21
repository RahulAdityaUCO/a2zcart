import { Product } from "../model/product.js";
import * as Constant from "../model/constant.js";
import { ShoppingCart } from "../model/shoppingcart.js";
import { AccountInfo } from "../model/account_info.js";



export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}


export async function addReview(review) {
  const data = review.serialize(Date.now());
  await firebase
    .firestore()
    .collection(Constant.collectionName.REVIEWS)
    .add(data);
}

export async function addWishList(wishlist) {
  const data = wishlist.serialize();
  await firebase.firestore().collection(Constant.collectionName.WISHLIST).add(data)
}


export async function getwishlist(uid) {

  let products = [];

  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.WISHLIST)
    .where("uid", "==", uid)
    .orderBy("name")
    .get();

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;



}

export async function getProductList() {
  let products = [];

  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .orderBy("name")
    .get();

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}

export async function getProductHigh() {
  let products = [];

  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .orderBy('timestamp', 'desc')
    .get();

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}

export async function getProductHighPrice() {
  let products = [];

  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .orderBy('price', 'desc')
    .get();

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}

export async function getProductLowPrice() {
  let products = [];

  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .orderBy('price', 'asc')
    .get();

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}


export async function getProductLow() {
  let products = [];

  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PRODUCTS)
    .orderBy('price', 'asc')
    .get()

  snapShot.forEach((doc) => {
    const p = new Product(doc.data());
    p.docId = doc.id;
    products.push(p);
  });
  return products;
}



export async function searchProduct(keywordsArray){

  let products = []
    const snapShot = await firebase.firestore().collection(Constant.collectionName.PRODUCTS)
                    .get()
    snapShot.forEach(doc => {
        const t = new Product(doc.data())
        t.docId = doc.id
   
        if(t.name.includes(keywordsArray))
        {
            products.push(t)
        }
    })
    return products

}

export async function checkOut(cart) {
  const data = cart.serialize(Date.now());
  await firebase
    .firestore()
    .collection(Constant.collectionName.PURCHASE_HISTORY)
    .add(data);
}



export async function getPurchaseHistroy(uid) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PURCHASE_HISTORY)
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc")
    .get();
  const carts = [];
  snapShot.forEach((doc) => {
    const sc = ShoppingCart.deserialize(doc.data());
    carts.push(sc);
  });
  return carts;
}

export async function createUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function googlesignin() {

  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

}


export async function getAccountInfo(uid) {
  const doc = await firebase.firestore()
    .collection(Constant.collectionName.ACCOUNT_INFO)
    .doc(uid)
    .get();

  if (doc.exists) {
    return new AccountInfo(doc.data());
  } else {
    const defualtInfo = AccountInfo.instance();
    await firebase.firestore()
      .collection(Constant.collectionName.ACCOUNT_INFO)
      .doc(uid)
      .set(defualtInfo.serialize());

	  return defualtInfo
  }
}


export async function updateAccountInfo(uid,updateInfo){
	await firebase.firestore().collection(Constant.collectionName.ACCOUNT_INFO).doc(uid).update(updateInfo)
}
export async function uploadProfilePhoto(photoFile,imageName){
	const ref = firebase.storage().ref().child(Constant.storageFolderName.PROFILE_PHOTOS + imageName)
	const taskSnapShot = await ref.put(photoFile)
	const photoURL = await taskSnapShot.ref.getDownloadURL()

	return photoURL
}

const cf_deleteProduct = firebase.functions().httpsCallable('admin_deleteProduct')
export async function deleteProduct(docId, imageName) {
  await cf_deleteProduct(docId)
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName)

  await ref.delete()
}

const cf_updateProduct = firebase.functions().httpsCallable('admin_updateProduct')
export async function updateProduct(product) {
  const docId = product.docId
  const data = product.serializeForUpdate()
  await cf_updateProduct({ docId, data })
}



export async function uploadImage(imageFile, imageName) {
  if (!imageName) {
    imageName = Date.now() + imageFile.name
  }
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName)

  const taskSnapShot = await ref.put(imageFile)
  const imageURL = await taskSnapShot.ref.getDownloadURL()

  return { imageName, imageURL }
}

const cf_getProductById = firebase.functions().httpsCallable('admin_getProductById')
export async function getProductById(docId) {
  const result = await cf_getProductById(docId)
  if (result.data) {
    const product = new Product(result.data)
    product.docId = result.data.docId
    return product
  } else {
    return null
  }
}

const cf_addProduct = firebase.functions().httpsCallable('admin_addProduct')
export async function addProduct(product) {
  await cf_addProduct(product.serialize())
}

export async function updatePassword(password) {
  await firebase.auth().currentUser.updatePassword(password);
}