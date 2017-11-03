let form_div = document.createElement('div');
form_div.id = "form_div";

class Controller {
  constructor(firebase) {

    this.firebase = firebase;
  }

  clearView() {
    while(canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }

    while(form_div.firstChild) {
      form_div.removeChild(form_div.firstChild);
    }
  }

  loginView() {
    const user_input = document.createElement('input');
    const pass_input = document.createElement('input');
    const log_btn = document.createElement('button');
    const create_btn = document.createElement('button');

    canvas.appendChild(form_div);
    form_div.appendChild(user_input);
    form_div.appendChild(pass_input);
    form_div.appendChild(log_btn);
    form_div.appendChild(create_btn);

    pass_input.type = "password";

    user_input.placeholder = "Usuario";
    pass_input.placeholder = "Contraseña";
    log_btn.innerText = "Ingresar";
    create_btn.innerText = "Crear usuario";

    log_btn.addEventListener('click', e => {
      const user = user_input.value + '@udea.edu.co';
      const pass = pass_input.value;

      const auth = firebase.auth().signInWithEmailAndPassword(user, pass);
      auth.catch(e => alert(e.message));
    });

    create_btn.addEventListener('click', e => {
      this.clearView()
      this._registerUser();
    });
  }

  paneView() {
    const PANE_OPTIONS = ["Agregar administrador", "Manipular BD", "Cerrar sesión"];

    const title = document.createElement('h1');
    const ul = document.createElement('ul');

    canvas.appendChild(title);
    canvas.appendChild(ul);

    ul.id = "menu";

    title.innerText = "Panel Administrativo";

    for (var i = 0; i < PANE_OPTIONS.length; i++) {
      const li = document.createElement('li');

      ul.appendChild(li);

      li.className = "menu";
      li.id = "PANE_OPTIONS_" + i;
      li.innerText = PANE_OPTIONS[i];
    }

    PANE_OPTIONS_0.addEventListener('click', e => {
      this.clearView();
      this.paneView();
      this._createAdmin();
    });

    PANE_OPTIONS_1.addEventListener('click', e => {
      this.clearView();
      this.paneView();
      this._createDB();
    });

    PANE_OPTIONS_2.addEventListener('click', e => {
      firebase.auth().signOut();
      this.clearView();
    });
  }

  _registerUser() {
    const user_input = document.createElement('input');
    const pass_input = document.createElement('input');
    const log_btn = document.createElement('button');

    canvas.appendChild(form_div);
    form_div.appendChild(user_input);
    form_div.appendChild(pass_input);
    form_div.appendChild(log_btn);

    pass_input.type = "password";

    user_input.placeholder = "Usuario";
    pass_input.placeholder = "Contraseña";
    log_btn.innerText = "Crear";

    log_btn.addEventListener('click', e => {
      const dbRef = firebase.database().ref();

      const user = user_input.value;
      const pass = pass_input.value;

      const newUser = firebase.auth().createUserWithEmailAndPassword(user, pass);

      firebase.auth().onAuthStateChanged(_user => {
        alert(_user.uid);
      });

    });
  }

  _createAdmin() {
    const uid_input = document.createElement('input');
    const admin_btn = document.createElement('button');

    canvas.appendChild(form_div);
    form_div.appendChild(uid_input);
    form_div.appendChild(admin_btn);

    uid_input.placeholder = "UID del usuario";
    admin_btn.innerText = "Aceptar";

    admin_btn.addEventListener('click', e => {
      if (uid_input.value != "") {
        const dbRef = firebase.database().ref();
        dbRef
        .child('trabajadores')
        .child(uid_input.value).set("admin");
      } else {
        alert("Ingrese un UID válido");
      }
    });
  }

  _createDB() {
    const dbRef = firebase.database().ref();

    const VAL_INPUT = {"block_input": "Bloque",
      "appart_input": "Apartamento",
      "name_input": "Representante",
      "cell_input": "Celular"};

    const help_span = document.createElement('span');
    const add_modify_btn = document.createElement('button');
    const remove_btn = document.createElement('button');

    help_span.innerHTML = "Para borrar datos escriba la ruta hasta el apartamento.<br>";
    help_span.innerText += "Para modificar y agregar, escribar la ruta.";
    add_modify_btn.innerText = "Agregar / Modificar";
    remove_btn.innerText = "Borrar";

    this._blockDBView();

    canvas.appendChild(form_div);
    form_div.appendChild(help_span);

    for (var i in VAL_INPUT) {
      const input = document.createElement('input');

      input.id = i;
      input.placeholder = VAL_INPUT[i];
      input.className = "input_db";

      form_div.appendChild(input);
    }

    form_div.appendChild(add_modify_btn);
    form_div.appendChild(remove_btn);

    add_modify_btn.addEventListener('click', e => {
      removeChild();
      addChild();
      this.clearView();
      this.paneView();
      this._createDB();
    });

    remove_btn.addEventListener('click', e => {
      removeChild();
      this.clearView();
      this.paneView();
      this._createDB();
    });

    function removeChild() {
      dbRef.child('Bloque')
          .child(block_input.value)
          .child(appart_input.value)
          .remove();
    }

    function addChild() {
      dbRef.child('Bloque')
          .child(block_input.value)
          .child(appart_input.value)
          .child(name_input.value)
          .child('telefono')
          .set(cell_input.value);
    }
  }

  _blockDBView() {
    let dbRef = firebase.database().ref().child('Bloque');
    let container_div = document.createElement('div');
    let container_ul = document.createElement('ul');

    canvas.appendChild(container_div);
    container_div.appendChild(container_ul);

    container_div.id = "container_div";

    dbRef.on('value', ref => {
      ref.forEach(blockSnap => {
        const block_li = document.createElement('li');

        container_ul.appendChild(block_li);
        block_li.innerHTML = "Bloque <b>" + blockSnap.key + "</b>";
        block_li.className = "block_li";

        blockSnap.forEach(appSnap => {
          const appart_ul = document.createElement('ul');
          const appart_li = document.createElement('li');

          block_li.appendChild(appart_ul);
          appart_ul.appendChild(appart_li);
          appart_li.innerHTML = "&darr; " + appSnap.key;
          appart_li.className = "appart_li";

          appSnap.forEach(nameSnap => {
            nameSnap.forEach(cellSnap => {
                const info_ul = document.createElement('ul');
                const info_li = document.createElement('li');

                appart_li.appendChild(info_ul);
                info_ul.appendChild(info_li);
                info_li.innerHTML = "&rarr; " + nameSnap.key + ": " + cellSnap.val();
                info_li.className = "info_li";
            });
          });
        });
      });
    });

    container_div.addEventListener('click', e => {

      if (container_div.style.height == "70%") {
        container_div.style.height = "100%";
      } else {
        container_div.style.height = "70%";
      }
    });
  }
};
