import * as Element from './element.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constants from "../model/constant.js"
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
        history.pushState(null, null, Routes.routePathname.SEARCH + '#'+joinedSearchKeys)
       
        search_page(keywordsArray)
        console.log(keywordsArray)
    })

}

export async function search_page(keywordsArray) {

    if (!Auth.currentUser) {
        Element.mainContent.innerHTML = '<h1>Protected Page</h1>'
        return
    }

    let products
    try {
        products = await FirebaseController.searchProduct(keywordsArray)
    }
    catch (e) {
        if(Constants.DEV) {
            console.log(e)
        return
        }
    }

    Home.buildProductCard(products)
}