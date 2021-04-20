import * as Element from "../viewpage/element.js"
import * as FirebaseController from "./firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Util from "../viewpage/util.js"
import * as Routes from "../controller/routes.js"
import * as HomePage from "../viewpage/home_page.js"
import * as ProfilePage from "../viewpage/profile_page.js"


export let currentUser

export async function addEventListeners(){

    Element.formSignIn.addEventListener("submit", async e=>{
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;


        try{
            await FirebaseController.signIn(email,password);
            $('#modal-form-signin').modal("hide")
        }catch(e){
            if(Constant.DEV) console.log(e)
            Util.popupInfo("Sign In Error", JSON.stringify(e), 'modal-form-signin')
        }

    })


    Element.formChangePassword.addEventListener("submit", async e => {

        const password = e.target.password.value;
        const passwordConfirm = e.target.passwordConfirm.value;

        Element.formConfirmPasswordError.innerHTML = ''

        if(passwordConfirm != password){
            Element.formConfirmPasswordError.innerHTML = 'Passwords do not match'
            return
        }

        try {
            await FirebaseController.updatePassword(password)
            $('#modal-form-changepassword').modal("hide")
        }
        catch {

            if(Constant.DEV) console.log(e)
		Util.popupInfo('Error',JSON.stringify(e),'modal-form-changepassword')
        }
    })

    Element.menuButtonSignout.addEventListener("click", async ()=>{


        try{
            await FirebaseController.signOut()
        }catch(e){
            if(Constant.DEV) console.log(e)
            Util.popupInfo("Signout Error", JSON.stringify(e))
        }   
    
    })

    Element.googleSignInButton.addEventListener('click', async () => {
        try {
         await FirebaseController.googlesignin()
         $('#modal-form-signin').modal("hide")
        }
        catch(e) {
            if(Constant.DEV) console.log(e)
            Util.popupInfo("googlesignin Error", JSON.stringify(e))
        }
    })

    firebase.auth().onAuthStateChanged(async user =>{
        if(user){
            currentUser = user;
			HomePage.getShoppingCartFromLocalStorage();

			const accountInfo = await FirebaseController.getAccountInfo(user.uid)
			ProfilePage.setProfileIcon(accountInfo.photoURL)

            let ele = document.getElementsByClassName("modal-pre-auth")
            for(let i =0;i <ele.length;i++)
                ele[i].style.display = 'none'
             ele = document.getElementsByClassName("modal-post-auth")
                for(let i =0;i <ele.length;i++)
                    ele[i].style.display = 'block'

            const path = window.location.pathname
            Routes.routing(path);
        }else{
            currentUser = null;
            
            let ele = document.getElementsByClassName("modal-pre-auth")
            for(let i =0;i <ele.length;i++)
                ele[i].style.display = 'block'
             ele = document.getElementsByClassName("modal-post-auth")
                for(let i =0;i <ele.length;i++)
                    ele[i].style.display = 'none'    
				
			history.pushState(null,null,Routes.routePathname.HOME)
			const path = window.location.pathname
			Routes.routing(path)		
        }
    })

	Element.buttonSignUp.addEventListener("click", ()=>{
		//show sign up modal
		$('#modal-form-signin').modal('hide')
		Element.formSignUp.reset()
		$('#modal-form-signup').modal('show')

	})

	Element.formSignUp.addEventListener("submit", e =>{
		e.preventDefault()
		sign_up(e.target)
		

		

	})
}

async function sign_up(form){
	const email = form.email.value
	const password = form.password.value
	const confirmPassword = form.passwordConfirm.value

	Element.formSignUpPasswordError.innerHTML = ''
	if(confirmPassword != password){
		Element.formSignUpPasswordError.innerHTML = 'Passwords do not match'
		return
	}
	try{
		await FirebaseController.createUser(email,password)
		Util.popupInfo('Account Creation Success', 'You are now signed in','modal-form-signup')
	}catch(e){
		if(Constant.DEV) console.log(e)
		Util.popupInfo('Error',JSON.stringify(e),'modal-form-signup')
	}
	console.log('created success')
}