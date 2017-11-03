(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBjmzIcmR2XI8L3FED2-55lGBzjb7lZk1w",
    authDomain: "citophoneapp.firebaseapp.com",
    databaseURL: "https://citophoneapp.firebaseio.com",
    projectId: "citophoneapp",
    storageBucket: "citophoneapp.appspot.com",
    messagingSenderId: "1037780883091"
  };

  firebase.initializeApp(config);

  let dbRef = firebase.database().ref();
  let controller = new Controller(firebase);

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      dbRef
        .child('trabajadores').on('value', snap => {
          if(snap.child(firebaseUser.uid).val() == null) {
            firebase.auth().signOut();
            alert("No tiene autorización.");
          } else {
            controller.clearView();
            controller.paneView();
          }
      });
    } else {
      controller.clearView();
      controller.loginView();
    }
  });
}());
