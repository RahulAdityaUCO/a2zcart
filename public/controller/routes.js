import * as HomePage from "../viewpage/home_page.js"
import * as PurchasePage from "../viewpage/purchase_page.js"
import * as ProfilePage from "../viewpage/profile_page.js"
import * as ShoppingCart  from "../viewpage/shoppingcart_page.js"
import * as Searchpage from '../viewpage/search_page.js'
import * as SortyByHigh from '../viewpage/sorthigh_page.js'
import * as SortByLow from '../viewpage/sortlow_page.js'
import * as SortByHighPrice from '../viewpage/sorthighprice_page.js'
import * as SortByLowPrice from '../viewpage/sortlowprice_page.js'

export const routePathname = {
    HOME: '/',
    PURCHASES: '/purchase',
    PROFILE: '/profile',
	SHOPPINGCART: '/shoppingcart',
    REVIEWS: '/reviews',
    SEARCH: '/search',
    SORTBYHIGH: '/sortbyhigh',
    SORTBYLOW: '/sortbylow',
    SORTBYHIGHPRICE: '/sortbyhighprice',
    SORTBYLOWPRICE: '/sortbylowprice'
}

export const routes = [
    {pathname: routePathname.HOME, page:HomePage.home_page},
    {pathname: routePathname.PURCHASES, page:PurchasePage.purchase_page},
    {pathname: routePathname.PROFILE, page:ProfilePage.profile_page},
	{pathname: routePathname.SHOPPINGCART, page:ShoppingCart.shoppingcart_page},
    {pathname: routePathname.SEARCH, page: Searchpage.search_page},  
    {pathname: routePathname.SORTBYHIGH, page: SortyByHigh.sort_page},
    {pathname: routePathname.SORTBYLOW, page: SortByLow.sortlow_page},
    {pathname: routePathname.SORTBYHIGHPRICE, page: SortByHighPrice.sorthighprice_page},
    {pathname: routePathname.SORTBYLOWPRICE, page: SortByLowPrice.sortlowprice_page}

]


export function routing(path){
    const route = routes.find( r=> r.pathname == path)
    if(route) route.page()
    else routes[0].page()

}