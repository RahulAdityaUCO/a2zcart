const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const Constant = require('./constant.js')

exports.admin_addProduct = functions.https.onCall(addProduct)
exports.admin_updateProduct = functions.https.onCall(updateProduct)
exports.admin_deleteProduct = functions.https.onCall(deleteProduct)
exports.admin_getProductById = functions.https.onCall(getProductById)


function isAdmin(email) {
    return Constant.adminEmails.includes(email)
}

async function deleteProduct(docId, context) {
  if(!isAdmin(context.auth.token.email)) {
      if (Constant.DEV) console.log('not admin: ',context.auth.token.email)
      throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function')
  }
  try {
      await admin.firestore().collection(Constant.collectionName.PRODUCTS)
                  .doc(docId).delete()
  } catch (e) {
      if (Constant.DEV) console.log(e)
      throw new functions.https.HttpsError('internal', 'deleteproduct failed')
  }
}


async function updateProduct(productInfo, context) {
  if(!isAdmin(context.auth.token.email)) {
      if (Constant.DEV) console.log('not admin: ',context.auth.token.email)
      throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function')
  }
  try{
      await admin.firestore().collection(Constant.collectionName.PRODUCTS)
                  .doc(productInfo.docId).update(productInfo.data)
  } catch (e) {
      if (Constant.DEV) console.log(e)
      throw new functions.https.HttpsError('internal', 'updateProduct failed')
  }
}

async function getProductById(docId, context) {
  if(!isAdmin(context.auth.token.email)) {
      if(Constant.DEV) console.log('not admin: ', context.auth.token.email)
      throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function')
  }
  try {
      const doc = await admin.firestore().collection(Constant.collectionName.PRODUCTS)
                              .doc(docId).get()
      if (doc.exists) {
              const {name, summary, price, imageName, imageURL} = doc.data()
              const p = {name, price, summary, imageName, imageURL}
              p.docId = doc.id
              return p
      }
      else {
          return null
      }

  } catch (e) {
      if (Constant.DEV) console.log(e)
      throw new functions.https.HttpsError('internal', 'getProductById failed')
  }
}

async function addProduct(data, context) {

    if(!isAdmin(context.auth.token.email)) {
        if(Constant.DEV) console.log('not admin: ', context.auth.token.email)
        throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function')
    }
    // data : { } // product info
    try {
        await admin.firestore().collection(Constant.collectionName.PRODUCTS).add(data)
    } catch (e) {
        if (Constant.DEV) console.log(e)
        throw new functions.https.HttpsError('internal', 'addProduct failed')
    }


}