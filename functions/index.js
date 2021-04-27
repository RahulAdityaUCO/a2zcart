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
exports.admin_deleteReview = functions.https.onCall(deleteReview)
exports.admin_getUserList = functions.https.onCall(getUserList)
exports.admin_updateUser = functions.https.onCall(updateUser)
exports.admin_deleteUser = functions.https.onCall(deleteUser)


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

async function deleteReview(uid, context) {

    if(!isAdmin(context.auth.token.email)) {
        if(Constant.DEV) console.log('not admin: ', context.auth.token.email)
        throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function')
    }

    try {
         await admin.firestore().collection(Constant.collectionName.REVIEWS).doc(uid).delete()
    } catch (e) {
        if (Constant.DEV) console.log(e)
        throw new functions.https.HttpsError('internal', 'deleteReview failed')
    }
}

async function deleteUser(uid, context) {
    if (!isAdmin(context.auth.token.email)) {
      if (Constant.DEV) console.log('not admin: ', context.auth.token.email)
      throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function.')
    }
  
    try {
      await admin.auth().deleteUser(uid)
    } catch (e) {
      if (Constant.DEV) console.log(e)
      throw new functions.https.HttpsError('internal', 'deleteUser failed')
    }
  }
  
  async function updateUser(data, context) {
    // data = {uid, update} => update = {key: value,}
    if (!isAdmin(context.auth.token.email)) {
      if (Constant.DEV) console.log('not admin: ', context.auth.token.email)
      throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function.')
    }
  
    try {
      const uid = data.uid
      const update = data.update
      await admin.auth().updateUser(uid, update)
    } catch (e) {
      if (Constant.DEV) console.log(e)
      throw new functions.https.HttpsError('internal', 'updateUser failed')
    }
  }

async function getUserList(data, context) {
    if(!isAdmin(context.auth.token.email)) {
        if (Constant.DEV) console.log('not admin: ',context.auth.token.email)
        throw new functions.https.HttpsError('unauthenticated', 'Only admin can invoke this function')
    }
    const userList = []
    try {
        let userRecord = await admin.auth().listUsers(1000)
        userList.push(...userRecord.users) //...spread operator
        let nextPageToken = userRecord.pageToken
        while (nextPageToken) {
            userRecord = await admin.auth().listUsers(1000, nextPageToken)
            userList.push(...userRecord.users)
            nextPageToken = userRecord.pageToken
        }
        return userList
    } catch (e) {
        if (Constant.DEV) console.log(e)
        throw new functions.https.HttpsError('internal', 'deleteProduct failed')
    }
}