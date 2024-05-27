/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Cooper Kuglin
 */


/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.FB_COLLECTION_ENDINGS = "Endings"; // PHOTOBUCKET
rhit.FB_KEY_TAG = "tag";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_IMAGE_URL = "imageURL";
// rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.FB_KEY_DISCOVERED_BY = "discoveredBy"; //AUTHOR
rhit.fbPhotoBucketsManager = null;
rhit.fbSinglePhotoManager = null;
rhit.fbAuthManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#menuShowAllPhotos").addEventListener("click", (event) => {
			window.location.href = `main.html`;
		});

		// document.querySelector("#menuShowMyPhotos").addEventListener("click", (event) => {
		// 	window.location.href = `list.html?uid=${rhit.fbAuthManager.uid}`;
		// });

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});



		// document.querySelector("#submitAddPhoto").addEventListener("click", (event) => {
		// 	const caption = document.querySelector("#inputCaption").value;
		// 	const imageUrl = document.querySelector("#inputImageURL").value;

		// 	rhit.fbPhotoBucketsManager.add(caption, imageUrl);


		// });

		$("#addCaptionDialog").on("show.bs.modal", (event) => {
			document.querySelector("#inputCaption").value = "";
		});

		$("#addCaptionDialog").on("shown.bs.modal", (event) => {
			console.log("dialog visible?");
			document.querySelector("#inputCaption").focus();
		});

		rhit.fbPhotoBucketsManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="photoListContainer"></div>');
		for (let c = 0; c < rhit.fbPhotoBucketsManager.length; c++) {
			const pb = rhit.fbPhotoBucketsManager.getPhotoAtIndex(c);
			console.log(`!rhit.fbPhotoBucketsManager.includesEndingByTag(${pb.tag}): ${!rhit.fbPhotoBucketsManager.includesEndingByTag(pb.tag)}`);
			if (pb.discoveredBy == rhit.fbAuthManager.uid && !rhit.fbPhotoBucketsManager.includesEndingByTag(pb.tag)) {
				const newCard = this._createCard(pb);

				newCard.onclick = (event) => {
					console.log(`You clicked on ${pb.id}`);
					window.location.href = `/photobucket.html?id=${pb.id}`;
				}

				newList.appendChild(newCard);
			}
		}
		const oldList = document.querySelector("#photoListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);
	}

	_createCard(photoBucket) {
		return htmlToElement(`<div class="card">
        <div class="card-body">
          <img src = ${photoBucket.imageURL} alt = ${photoBucket.tag} class = "card-image"></img>
          <p class="card-text">${photoBucket.tag}</p>
        </div>
      </div>`);
	}
}

rhit.PhotoBucket = class {
	constructor(id, tag, imageURL, discoveredBy) {
		this.id = id;
		this.tag = tag;
		this.imageURL = imageURL;
		this.discoveredBy = discoveredBy;
	}
}

rhit.FbPhotoBucketsManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_ENDINGS);
		this._unsubscribe = null;
		this._endingList = [];
	}

	add(tag, imageURL) {

		console.log(`added title ${tag}`);
		console.log(`added photo ${imageURL}`);

		this._ref.add({
			[rhit.FB_KEY_TAG]: tag,
			[rhit.FB_KEY_IMAGE_URL]: imageURL,
			// [rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			[rhit.FB_KEY_DISCOVERED_BY]: rhit.fbAuthManager.uid
		}).then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		}).catch(function (error) {
			console.log("Error adding document: ", error);
		});
		console.log(`tag: ${tag}`);
		this._endingList.push({
			tag
		});
	}

	beginListening(changeListener) {
		let query = this._ref.limit(50);

		if (this._uid)
			query = query.where(rhit.FB_KEY_DISCOVERED_BY, "== ", this._uid);

		this._unsubscribe = query.onSnapshot((querySnapshot) => {

			this._documentSnapshots = querySnapshot.docs;

			querySnapshot.forEach((doc) => {
				console.log(doc.data());
			});
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getPhotoAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const pb = new rhit.PhotoBucket(docSnapshot.id, docSnapshot.get(rhit.FB_KEY_TAG), docSnapshot.get(rhit.FB_KEY_IMAGE_URL), docSnapshot.get(rhit.FB_KEY_DISCOVERED_BY));
		return pb;
	}

	includesEndingByTag(tag) {
		console.log(`includesEndingByTag: ${tag}, ${this._endingList.includes(tag, 0)}`);
		return this._endingList.includes(tag, 0);
	}
}

rhit.DetailPageController = class {
	constructor() {

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});

		document.querySelector("#submitEditCaption").addEventListener("click", (event) => {
			const caption = document.querySelector("#inputCaptionEdit").value;
			rhit.fbSinglePhotoManager.update(caption);
		});

		$("#editCaptionDialog").on("show.bs.modal", (event) => {
			if (rhit.fbSinglePhotoManager.caption)
				document.querySelector("#inputCaptionEdit").value = rhit.fbSinglePhotoManager.caption;
			else
				document.querySelector("#inputCaptionEdit").value = "";
		});

		$("#editCaptionDialog").on("shown.bs.modal", (event) => {
			console.log("dialog visible?");
			document.querySelector("#inputCaptionEdit").focus();
		});

		document.querySelector("#submitDeleteCaption").addEventListener("click", (event) => {
			rhit.fbSinglePhotoManager.delete().then(function () {
				console.log("Photo deleted.");
				window.location.href = "/list.html";
			}).catch(function (error) {
				console.error("Error deleting photo:", error)
			});
		});


		rhit.fbSinglePhotoManager.beginListening(this.updateView.bind(this));
	}

	updateView() {
		document.querySelector("#cardImage").setAttribute("src", rhit.fbSinglePhotoManager.imageURL);
		document.querySelector("#cardImage").setAttribute("alt", rhit.fbSinglePhotoManager.tag);
		if (rhit.fbSinglePhotoManager.caption)
			document.querySelector("#cardCaption").innerHTML = rhit.fbSinglePhotoManager.caption;

		// if (rhit.fbSinglePhotoManager.author == rhit.fbAuthManager.uid) {
		// 	document.querySelector("#menuEdit").style.display = "flex";
		// 	document.querySelector("#menuDelete").style.display = "flex";
		// }
	}
}


rhit.FbSinglePhotoManager = class {
	constructor(photoBucketId) {
		console.log('photoBucketId :>> ', photoBucketId);
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_ENDINGS).doc(photoBucketId);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else
				console.log("No doc found.");
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	update(caption) {
		console.log(`updated photo ${caption}`);
		this._ref.update({
			[rhit.FB_KEY_CAPTION]: caption
		}).then(() => {
			console.log("Document upodated.");
		}).catch(function (error) {
			console.log("Error updating document: ", error);
		});
	}

	delete() {
		return this._ref.delete();
	}

	get tag() {
		return this._documentSnapshot.get(rhit.FB_KEY_TAG);
	}

	get caption() {
		return this._documentSnapshot.get(rhit.FB_KEY_CAPTION);
	}

	get imageURL() {
		return this._documentSnapshot.get(rhit.FB_KEY_IMAGE_URL);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_DISCOVERED_BY);
	}
}


rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#rosefireLogin").onclick = (event) => {
			console.log("Attempt sign in with Rosefire.");
			rhit.fbAuthManager.signIn();
		};
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {

			this._user = user;
			changeListener();

			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/v8/firebase.User
				const displayName = user.displayName;
				const email = user.email;
				const emailVerified = user.emailVerified;
				const photoURL = user.photoURL;
				const isAnonymous = user.isAnonymous;
				const uid = user.uid;
				const providerData = user.providerData;
				const phoneNumber = user.phoneNumber;

				console.log("The user has signed in:", uid);
				console.log('displayName :>> ', displayName);
				console.log('email :>> ', email);
				console.log('photoURL :>> ', photoURL);
				console.log('phoneNumber :>> ', phoneNumber);
				console.log('isAnonymous :>> ', isAnonymous);
				console.log('uid :>> ', uid);
				// ...
			} else {
				// User is signed out
				// ...
				console.log("No user signed in.");
			}
		});
	}

	signIn() {
		console.log("Sign in through Rosefire");
		Rosefire.signIn("373d28ea-a288-4ee3-81fc-9a01c18c0512", (err, rfUser) => { // TODO: change key 
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			// Next use the Rosefire token with Firebase auth.
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				if (error.code === 'auth/invalid-custom-token') {
					console.log("The token you provided is not valid.");
				} else {
					console.log("signInWithCustomToken error", error.message);
				}
			}); // Note: Success should be handled by an onAuthStateChanged listener.

			console.log("isSignedIn:", this.isSignedIn);
		});

	}

	signOut() {
		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log("Sign out successful.");
		}).catch((error) => {
			// An error happened.
			console.log(`ERROR: ${error} ocurred attempting sign out.`);
		});
	}

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid
	}

}

rhit.MainPageController = class {
	constructor() {
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
	}
}

rhit.OtherPageController = class {
	constructor() {
		console.log(document.querySelector(".ending") + ": " + document.querySelector(".ending").getAttribute("id"));
		if (document.querySelector(".ending")) {
			let tag = document.querySelector(".ending").getAttribute("id");
			let imageURL = `\\images\\${tag}.png`;
			console.log(tag);
			console.log(`!rhit.fbPhotoBucketsManager.includesEndingByTag(tag): ${!rhit.fbPhotoBucketsManager.includesEndingByTag(tag)}`);
			if (!rhit.fbPhotoBucketsManager.includesEndingByTag(tag))
				rhit.fbPhotoBucketsManager.add(tag, imageURL);
		}
	}
}

rhit.startFirebaseUI = function () { // FirebaseUI config.
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			// firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			// firebase.auth.TwitterAuthProvider.PROVIDER_ID,
			// firebase.auth.GithubAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			// firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
		// tosUrl and privacyPolicyUrl accept either url string or a callback
		// function.
		// Terms of service url/callback.

		// tosUrl: '<your-tos-url>',

		// Privacy policy url/callback.

		// privacyPolicyUrl: function () {
		// 	window.location.assign('<your-privacy-policy-url>');
		// }
	};

	// Initialize the FirebaseUI Widget using Firebase.
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	// The start method will wait until the DOM is loaded. 	
	ui.start('#firebaseui-auth-container', uiConfig);
}

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn)
		window.location.href = "/main.html";
	else if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn)
		window.location.href = "/";
};

rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);

	if (document.querySelector("#listPage")) {
		const uid = urlParams.get("uid");
		rhit.fbPhotoBucketsManager = new rhit.FbPhotoBucketsManager(uid);
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")) {
		const photoBucketId = urlParams.get("id");
		console.log(photoBucketId);
		if (!photoBucketId)
			console.log(`Error: No photo bucket found for given id: ${photoBucketId}.`);
		rhit.fbSinglePhotoManager = new rhit.FbSinglePhotoManager(photoBucketId);
		new rhit.DetailPageController();
	}

	if (document.querySelector("#loginPage")) {
		new rhit.LoginPageController();
		console.log("isSignedIn:", rhit.fbAuthManager.isSignedIn);
	}

	if (document.querySelector("#mainPage")) {
		new rhit.MainPageController();
		console.log("isSignedIn:", rhit.fbAuthManager.isSignedIn);
	}

	if (document.querySelector(".ending")) {
		const uid = urlParams.get("uid");
		rhit.fbPhotoBucketsManager = new rhit.FbPhotoBucketsManager(uid);
		console.log("Page:", document.querySelector(".ending").getAttribute("id"));
		new rhit.OtherPageController();
	}
};


/* Main */
/** function and class syntax examples */
rhit.main = function () {

	console.log("Ready");

	var w = window.innerWidth;
	var h = window.innerHeight;
	if (document.querySelector("#img-well")) {

	}

	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("Auth change callback fired.");
		console.log("isSignedIn:", rhit.fbAuthManager.isSignedIn);


		// check for redirects
		rhit.checkForRedirects();

		//Page initialization
		rhit.initializePage();
	});

	rhit.startFirebaseUI();
};

rhit.main();