(() => {
  function setSigninState(isSignedIn, imgUrl) {
    const signin = document.getElementById('signin');
    const signout = document.getElementById('signout');
    const userIcon = document.getElementById('userIcon');
    if (isSignedIn) {
      signin.style.display = 'none';
      signout.style.display = 'block';
      userIcon.src = imgUrl;
    } else {
      signin.style.display = 'block';
      signout.style.display = 'none';
    }
  }
  
  function onInit(auth) {
    let imgUrl;
    if (auth.isSignedIn.get()) {
      imgUrl = auth.currentUser.get().getBasicProfile().getImageUrl();
    }
    setSigninState(auth.isSignedIn.get(), imgUrl);
    userChanged(auth.currentUser.get());
    auth.currentUser.listen(userChanged);
  }
  
  function onInitError(error) {
    alert(`Error initializing Google Authentication library: ${error.error}. Google signin will not be possible.`);
  }
  
  function onSigninFailure(error) {
    if (error.error === 'popup_closed_by_user') {
      // user intended to cancel; no error
      return;
    }
    alert(`Error signing in: ${error.error}. Some aspects of the application may not function.`);
  }
  
  function userChanged(user) {
    let imgUrl;
    if (user.isSignedIn()) {
      imgUrl = user.getBasicProfile().getImageUrl();
      document.getElementById('mainApp').googleUser = user;
    } else {
      document.getElementById('mainApp').googleUser = null;
    }
    setSigninState(user.isSignedIn(), imgUrl);
  }
  
  function signOut() {
    const result = confirm('Sign out? Some features of Scribe will be unavailable.');
    if (result) {
      gapi.auth2.getAuthInstance().signOut();
    }
  }
  
  function renderButton() {
    gapi.signin2.render('signin', {
      scope: 'profile email',
      width: 22,
      height: 22,
      longtitle: false,
      theme: 'light',
      onfailure: onSigninFailure,
    });
    
    gapi.load('auth2', () => {
      gapi.auth2.init({client_id: '1065221978104-4a14e46o2j5hi1f9g85mou7l3qh7bh1c.apps.googleusercontent.com'})
        .then(onInit, onInitError);
    });
  }
  
  if (document.readyState !== 'loading') renderButton();
  else document.addEventListener('DOMContentLoaded', renderButton);
})();