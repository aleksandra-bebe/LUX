
//uzimanje vrednosti
const cartBtn = document.querySelector(".cart-btn");
const userBtn = document.querySelector(".user-btn");
const registrationBtn = document.querySelector(".registration-btn");
const closeCartBtn = document.querySelector(".close-cart");
const closeUserMenuBtn = document.querySelector(".close-user-menu");
const closeProfileBtn = document.querySelector(".close-profile-page");
const closeRegistrationMenuBtn = document.querySelector(".close-registration-menu");
const closeArticlePageBtn = document.querySelector(".close-article-page");
const clearCartBtn = document.querySelector(".clear-cart");
const buyCartBtn=document.querySelector(".buy-cart");
const loginBtn = document.querySelector(".login-btn");
const cartDOM = document.querySelector(".cart");
const userDOM = document.querySelector(".user");
const registrationDOM = document.querySelector(".registration");
const articleDOM = document.querySelector(".article");
const cartOverlay = document.querySelector(".cart-overlay");
const userOverlay = document.querySelector(".user-menu-overlay");
const registrationOverlay = document.querySelector(".registration-overlay");
const articleOverlay = document.querySelector(".article-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const userMenuContent = document.querySelector(".user-menu-content");
const profileOverlay = document.querySelector(".profile-overlay");
const profileDOM = document.querySelector(".profile");


// meni togler
const selectElement = function (element) {
  return document.querySelector(element);
};

let menuToggler = selectElement(".menu-toggle");
let body = selectElement("body");

menuToggler.addEventListener("click", function () {
  body.classList.toggle("open");
});

// korpa
let cart = [];
// buttons
let buttonsDOM = [];

let user = [];

let ui_global;
// uzimanje proizvoda
class Products {
  async getProducts(ui) {
    try {
      fetch("https://localhost:5001/Artikal/GetNajprodavanije").then(p => {
        p.json().then(data => {
          Storage.saveProducts(data);
          ui.displayProducts(data, ui);
        });
      });
    }
    catch (error) {
      console.log(error);
    }
  }
}

function StarRating(host, prosecnaOcena) {
  for (let i = 1; i <= 5; i++) {
    var star = document.createElement("span");
    star.classList.add("fa");
    star.classList.add("fa-star");
    if (prosecnaOcena + 0.5 >= i) star.classList.add("checkedStar");
    host.appendChild(star);
  }
  host.innerHTML += " " + prosecnaOcena;
}

function RateProduct(host) {
  for (let i = 1; i <= 5; i++) {
    var star = document.createElement("li");
    var span = document.createElement("i");
    star.classList.add("fa");
    star.classList.add("fa-star");
    star.title = "Rate " + (6 - i);
    star.onclick = (e) => { alert("ocena: " + (6 - i)); };
    host.appendChild(star);
  }
}
// Prikazivanje svih komentara za dati artikal
function ShowArticleComments(host, articleId) {
  host.innerHTML = "";
  for (let index = 0; index < 5; index++) {
    var div = document.createElement("div");
    div.innerHTML = "komentar" + index;
    host.appendChild(div);
  }
}
var attempt = 3;
function login() {
  var username = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;
  var errorLabel = document.getElementById("loginErrorText");
  if (!username || !password) {
    errorLabel.innerHTML = "Unesite korisničko ime i šifru";
    return;
  }
  if (username == "admin" && password == "admin") {
    alert("Uspesno ste se ulogovali kao admin");
    //window.location = "/admin/index.html";
    window.location = "./admin/index.html";
    return false;
  }
  else {
    try {
      fetch("https://localhost:5001/Korisnik/UlogujSe/" + username + "/" + password).then(p => {
        if (p.ok) {
          p.json().then(data => {
            if (data) {
              alert("Uspesno ste se ulogovali");
              Storage.saveUser(data);
              ProfilePage();
            }
          });
        }
        else {
          p.text().then(errorText => { errorLabel.innerHTML = errorText });
          setTimeout(() => {
            errorLabel.innerHTML = ""
          }, 7000);
        }
      });
    }
    catch (error) {
      console.log(error);
    }
  }
}
//Kupovina proizvoda provera !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function check() {
  var errorLabel=document.getElementById("ErrorText");
  if (Storage.getUser('status') != null) {
    if(Storage.getCart()[0] !=null)
    {
    var user = Storage.getUser();
    console.log("user", user);
    let cart = Storage.getCart();
    console.log("cart", cart);
    var kol=document.getElementById("amount").innerHTML;
    cart.forEach((product) => {
      fetch("https://localhost:5001/Transakcija/PostTransakcija/" + user.korisnikId + "/" + product.artikalId + "/" + kol, {method: 'POST'}).then(p => {
        if (!p.ok) {
          p.json().then(data => {
            if (data) {
              p.text().then(errorText => { errorLabel.innerHTML = errorText });
              setTimeout(() => {
                errorLabel.innerHTML = ""
              }, 7000);
          }
         });
        }
        else
         {
          alert("Proizvod je kupljen!");
          Storage.removeCart();
          window.location='./profil.html';
        // Storage.getUser();
          }
        });
      })
  }
  else{
    alert("Morate izabrati proizvod!");
    }
}
  else {
  alert("Morate se prvo ulogovati!");
       }
}


//END
function ProfilePage() {
  userOverlay.classList.remove("transparentBcg");
  userDOM.classList.remove("showUser");
  registrationOverlay.classList.remove("transparentBcg");
  registrationOverlay.classList.remove("showUser");
  profileOverlay.classList.add("transparentBcg");
  profileDOM.classList.add("showUser");
  body.style.overflowY = "hidden";

  var user = Storage.getUser();

  profileInformation = document.querySelector(".profileInformation");
  profileInformation.innerHTML = "";
  var basicInormation = document.createElement("div");
  basicInormation.className = "basicInfor";
  profileInformation.appendChild(basicInormation);

  var header = document.createElement("h2");
  header.classList.add("user-menu-header");
  header.innerHTML = user.ime + " " + user.prezime;
  basicInormation.appendChild(header);

  const em = document.createElement("label");
  em.innerHTML = user.email;
  var br3 = document.createElement("br");
  basicInormation.appendChild(em);
  basicInormation.appendChild(br3);



  let dugme = document.createElement("button");
  var br = document.createElement("br");
  dugme.innerHTML = "Moj profil";
  dugme.className = "banner-btn";
  basicInormation.appendChild(dugme);
  basicInormation.appendChild(br);

  dugme.onclick = (event) => {
    window.location = "profil.html";
  }
  let dugme2 = document.createElement("button");
  var br1 = document.createElement("br");

  dugme2.innerHTML = "Podesavanja";
  dugme2.className = "banner-btn";
  basicInormation.appendChild(dugme2);
  basicInormation.appendChild(br1);

  dugme2.onclick = (event) => {

    window.location = "podesavanja.html";
  }
  let dugme3 = document.createElement("button");
  var br2 = document.createElement("br");

  dugme3.innerHTML = "Odjavi se";
  dugme3.className = "login-btn banner-btn ";
  basicInormation.appendChild(dugme3);
  basicInormation.appendChild(br2);

  dugme3.onclick = (event) => {
    let confirmAction = confirm("Da li zelite da se odjavite?");
    if (confirmAction) {
      Storage.removeUser();
      window.location = "index.html";
    }
  }
}
//Registracija provera 
let ime = document.getElementById("ime");
let Prezime = document.getElementById("prezime");
let korisnickoIme = document.getElementById("korisnickoIme");
let email = document.getElementById("email");
let password = document.getElementById("password");
let password_confirm = document.getElementById("password_confirm");
let adresa = document.getElementById("adresa");
let broj = document.getElementById("broj");

var ime_error = document.getElementById('ime_error');
var prezime_error = document.getElementById('prezime_error');
var korisnickoIme_error = document.getElementById('korisnickoIme_error');
var email_error = document.getElementById('email_error');
var password_error = document.getElementById('password_error');
var password_error1 = document.getElementById('password_error1');
var adresa_error = document.getElementById('adresa_error');
var broj_error = document.getElementById('broj_error');

var pwd_expression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
var letters = /^[A-Za-z]+$/;
var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


ime.addEventListener('blur', imeVerify, true);
prezime.addEventListener('blur', prezimeVerify, true);
korisnickoIme.addEventListener('blur', korisnickoImeVerify, true);
email.addEventListener('blur', emailVerify, true);
password.addEventListener('blur', passwordVerify, true);
adresa.addEventListener('blur', adresaVerify, true);
broj.addEventListener('blur', brojVerify, true);

function Validate() {
  console.log("password: ", password);
  console.log("password value: ", password.value);
  console.log("password_confirm: ", password_confirm);
  console.log("password_confirm value: ", password_confirm.value);
  if (ime.value == "") {
    ime.style.border = "1px solid red";
    document.getElementById('ime_div').style.color = "red";
    ime_error.textContent = "Ime je obavezno!";
    ime.focus();
    return false;
  }
  else if (!letters.test(ime.value)) {
    ime.style.border = "1px solid red";
    document.getElementById('ime_div').style.color = "red";
    ime_error.textContent = "Ime mora da sazdrzi samo slova!";
    ime.focus();
    return false;
  }
  else if (prezime.value == "") {
    prezime.style.border = "1px solid red";
    document.getElementById('prezime_div').style.color = "red";
    prezime_error.textContent = "Prezime je obavezno!";
    prezime.focus();
    return false;
  }
  else if (!letters.test(prezime.value)) {
    prezime.style.border = "1px solid red";
    document.getElementById('ime_div').style.color = "red";
    prezime_error.textContent = "Prezime mora da sazdrzi samo slova!";
    prezime.focus();
    return false;
  }
  else if (korisnickoIme.value == "") {
    korisnickoIme.style.border = "1px solid red";
    document.getElementById('korisnickoIme_div').style.color = "red";
    korisnickoIme_error.textContent = "Korisnicko ime je obavezno!";
    korisnickoIme.focus();
    return false;
  }
  else if (!letters.test(korisnickoIme.value)) {
    korisnickoIme.style.border = "1px solid red";
    document.getElementById('korisnickoIme_div').style.color = "red";
    korisnickoIme_error.textContent = "Korisnicko ime mora sadrzati samo slova!";
    korisnickoIme.focus();
    return false;
  }
  else if (korisnickoIme.value.length < 3) {
    korisnickoIme.style.border = "1px solid red";
    document.getElementById('korisnickoIme_div').style.color = "red";
    korisnickoIme_error.textContent = "Korisnicko ime mora imati najmanje 3 slova!";
    korisnickoIme.focus();
    return false;
  }
  else if (email.value == "") {
    email.style.border = "1px solid red";
    document.getElementById('email_div').style.color = "red";
    email_error.textContent = "Email je obavezan!";
    email.focus();
    return false;
  }
  else if (!filter.test(email.value)) {
    email.style.border = "1px solid red";
    document.getElementById('email_div').style.color = "red";
    email_error.textContent = "Nevalidan email!";
    email.focus();
    return false;
  }

  else if (password.value == "") {
    password.style.border = "1px solid red";
    document.getElementById('password_div').style.color = "red";
    password_error1.textContent = "Sifra  je obavezna!";
    password.focus();
    return false;
  }
  else if (!pwd_expression.test(password.value)) {
    password.style.border = "1px solid red";
    document.getElementById('password_div').style.color = "red";
    password_error1.textContent = "Sifra mora sadrzati velika slova, mala slova, specijalni karakter i broj!";
    password.focus();
    return false;
  }
  else if (password.value != password_confirm.value) {
    password.style.border = "1px solid red";
    document.getElementById('pass_confirm_div').style.color = "red";
    password_confirm.style.border = "1px solid red";
    password_error.innerHTML = "Sifre se ne slazu!";
    return false;
  }
  else if (password.value.length < 8) {
    password.style.border = "1px solid red";
    document.getElementById('password_div').style.color = "red";
    password_error1.textContent = "Sifra mora sadrzati minimum 8 karaktera!";
    password.focus();
    return false;
  }
  else if (adresa.value == "") {
    adresa.style.border = "1px solid red";
    document.getElementById('adresa_div').style.color = "red";
    adresa_error.textContent = "Adresa je obavezan!";
    adresa.focus();
    return false;
  }
  else if (broj.value == "") {
    broj.style.border = "1px solid red";
    document.getElementById('broj_div').style.color = "red";
    broj_error.textContent = "Broj telefona je obavezan!";
    broj.focus();
    return false;
  }
  else {
    return true;
  }
}
function imeVerify() {
  if (ime.value != "") {
    ime.style.border = "1px solid #5e6e66";
    document.getElementById('ime_div').style.color = "#5e6e66";
    ime_error.innerHTML = "";
    return true;
  }
}
function prezimeVerify() {
  if (prezime.value != "") {
    prezime.style.border = "1px solid #5e6e66";
    document.getElementById('prezime_div').style.color = "#5e6e66";
    prezime_error.innerHTML = "";
    return true;
  }
}
function korisnickoImeVerify() {
  if (korisnickoIme.value != "") {
    korisnickoIme.style.border = "1px solid #5e6e66";
    document.getElementById('korisnickoIme_div').style.color = "#5e6e66";
    korisnickoIme_error.innerHTML = "";
    return true;
  }
}
function emailVerify() {
  if (email.value != "") {
    email.style.border = "1px solid #5e6e66";
    document.getElementById('email_div').style.color = "#5e6e66";
    email_error.innerHTML = "";
    return true;
  }
}
function passwordVerify() {
  if (password.value != "") {
    password.style.border = "1px solid #5e6e66";
    document.getElementById('pass_confirm_div').style.color = "#5e6e66";
    document.getElementById('password_div').style.color = "#5e6e66";
    password_error.innerHTML = "";
    return true;
  }
  else if (password.value === password_confirm.value) {
    password.style.border = "1px solid #5e6e66";
    document.getElementById('pass_confirm_div').style.color = "#5e6e66";
    password_error.innerHTML = "";
    return true;
  }
}
function adresaVerify() {
  if (adresa.value != "") {
    adresa.style.border = "1px solid #5e6e66";
    document.getElementById('adresa_div').style.color = "#5e6e66";
    adresa_error.innerHTML = "";
    return true;
  }
}
function brojVerify() {
  if (broj.value != "") {
    broj.style.border = "1px solid #5e6e66";
    document.getElementById('broj_div').style.color = "#5e6e66";
    broj_error.innerHTML = "";
    return true;
  }
}
//END registracija provera

//Registruj se fetchon
function registracija() {
  if (!Validate()) {
    return;
  }
  var profilnaSlika = document.getElementById("profilnaSlika").files[0];
  let ime = document.getElementById("ime").value;
  let prezime = document.getElementById("prezime").value;
  let korisnickoIme = document.getElementById("korisnickoIme").value;
  let email = document.getElementById("email").value;
  let sifra = document.getElementById("password").value;
  let adresa = document.getElementById("adresa").value;
  let broj = document.getElementById("broj").value;

  let user = JSON.stringify({
    "korisnickoIme": korisnickoIme,
    "email": email,
    "ime": ime,
    "prezime": prezime,
    "telefon": broj,
    "adresa": adresa,
    "sifra": sifra,
  });

  if (profilnaSlika) {
    var reader = new FileReader();
    reader.readAsDataURL(profilnaSlika);

    reader.onload = function () {
      var codedFile = reader.result;
      var byteString = codedFile.split(',')[1];

      fetch("https://localhost:5001/Korisnik/RegistrujSe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: user
      }).then(r => {
        if (r.ok) {
          r.text().then(id => {
              fetch("https://localhost:5001/Korisnik/PromeniSlikuKorisnika/" + id, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(byteString)
              }).then(r => {
                if (r.ok) {
                  alert("Uspeno ste se registrovali!");
                  window.location.reload();
                }
                else {
                  r.text().then(errorText => { alert(errorText); });
                }
              });
          });
        }
        else {
          r.text().then(errorText => { alert(errorText); });
        }
      });
    }
  }
  else{
    fetch("https://localhost:5001/Korisnik/RegistrujSe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: user
      }).then(r => {
        if (r.ok) {
          alert("Uspesno ste se registrovali!");
          window.location.reload();
        }
        else {
          r.text().then(errorText => { alert(errorText); });
        }
      });
    }
}
//END registracija



// prikazivanje proizvoda
function showArticlePage(productId) {
  userOverlay.classList.remove("transparentBcg");
  userDOM.classList.remove("showUser");
  registrationOverlay.classList.remove("transparentBcg");
  registrationOverlay.classList.remove("showUser");
  articleOverlay.classList.add("transparentBcg");
  articleDOM.classList.add("showUser");
  body.style.overflowY = "hidden";

  articleInformation = document.querySelector(".articleInformation");
  var product = Storage.getProduct(productId);
  var basicInormation = document.createElement("div");
  articleInformation.appendChild(basicInormation);

  var header = document.createElement("h2");
  header.classList.add("user-menu-header");
  header.classList.add("article-header");
  header.innerHTML = product.naziv;
  basicInormation.appendChild(header);

  var articleImg = document.createElement("img");
  articleImg.classList.add("product-img");
  articleImg.classList.add("article-img");
  articleImg.src = product.image;
  basicInormation.appendChild(articleImg);

  var articleDescription = document.createElement("p");
  articleDescription.className = "articleDescription";
  articleDescription.innerHTML = "Opis proizvoda";
  basicInormation.appendChild(articleDescription);

  var articleRating = document.createElement("div");
  prosecnaOcena = 4.4;
  StarRating(articleRating, prosecnaOcena);
  articleRating.className = "articleRating";
  basicInormation.appendChild(articleRating);

  var articlePrice = document.createElement("div");
  articlePrice.className = "articlePrice";
  articlePrice.innerHTML = "$" + product.cena;
  basicInormation.appendChild(articlePrice);

  var articleRate = document.createElement("div");
  articleRate.className = "rate-article";
  RateProduct(articleRate);
  var h3 = document.createElement("h3");
  h3.innerHTML = "Ocenite proizvod";
  h3.style = "float:right;width:35%;margin-top:40px;";
  basicInormation.appendChild(h3);
  basicInormation.appendChild(articleRate);

  var newCommentDiv = document.createElement("div");
  newCommentDiv.className = "newCommentDiv";
  var newComment = document.createElement("input");
  newComment.placeholder = "Unesite vas komentar...";
  newComment.type = "text";
  newComment.className = "input";
  var unesiteKomentar = document.createElement("h3");
  unesiteKomentar.innerHTML = "Unesite komentar";
  newCommentDiv.appendChild(unesiteKomentar);
  newCommentDiv.appendChild(newComment);

  var commentSendBtn = document.createElement("button");
  commentSendBtn.classList.add("commentSendBtn");
  commentSendBtn.innerHTML = `POSALJI`;
  newCommentDiv.appendChild(commentSendBtn);
  basicInormation.appendChild(newCommentDiv);

  var articleAddToChart = document.createElement("button");
  articleAddToChart.classList.add("bag-btn");
  articleAddToChart.classList.add("articleAddToChart");
  articleAddToChart.setAttribute('data-id', productId);
  articleAddToChart.innerHTML = `<i class="fas fa-shopping-cart"></i> DODAJ U KORPU`;
  let inCart = cart.find((item) => item.artikalId == productId);
  if (inCart) {
    articleAddToChart.innerText = `Vec je u korpi`;
    articleAddToChart.disabled = true;
  }
  articleAddToChart.onclick = (event) => {
    event.stopPropagation();
    event.target.innerText = "Vec je u korpi";
    event.target.disabled = true;
    // uzmi proizvod od proizvoda
    let cartItem = { ...Storage.getProduct(productId), amount: 1 };
    // dodaj u korpu
    cart = [...cart, cartItem];
    // sacuvaj korpu u local storage
    Storage.saveCart(cart);
    // postavimo vrednost korpi
    ui_global.setCartValues(cart);
    // prikazi proizvod korpe
    ui_global.addCartItem(cartItem);
    // prikazi korpu
    ui_global.showCart();
  }

  basicInormation.appendChild(articleAddToChart);

  // Sekcija za komentare
  var commentInformation = document.createElement("div");
  var articleComments = document.createElement("div");
  articleComments.className = "articleComments";
  ShowArticleComments(articleComments, productId);
  var komentari = document.createElement("h3");
  komentari.style = "margin-top:25px;";
  komentari.innerHTML = "Komentari korisnika";
  commentInformation.appendChild(komentari);
  commentInformation.appendChild(articleComments);

  articleInformation.appendChild(commentInformation);
}

class UI {

  displayProducts(products) {
    let result = "";
    ui_global = this;
    products.forEach((product) => {
      result += `
           <!-- single product-->
        <article class="product" onclick="showArticlePage('${product.artikalId}')">
          <div class="img-container">
            <img
              src="${product.image}"
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.artikalId}>
              <i class="fas fa-shopping-cart"></i>
              Dodaj u korpu
            </button>
          </div>
          <h3>${product.naziv} </h3>
          <h4>${product.cena} RSD </h4>
        </article>
        <!-- end single product-->
          `;
    });
    productsDOM.innerHTML = result;
    this.getBagButtons();
    this.cartLogic();
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.cena * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="product" />
            <div>
              <h4>${item.naziv}</h4>
              <h5>${item.cena} RSD </h5>
              <span class="remove-item" data-id=${item.artikalId}>Ukloni</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.artikalId}></i>
              <p id="amount" class="item-amount">${item.amount} </p>
              <i class="fas fa-chevron-down" data-id=${item.artikalId}></i>
            </div>`;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  showUserMenu() {
    var userLogged = Storage.getUser();
    if (userLogged) {
      ProfilePage();
    }
    else {
      userOverlay.classList.add("transparentBcg");
      userDOM.classList.add("showUser");
    }
  }

  showRegistrationPage() {
    userOverlay.classList.remove("transparentBcg");
    userDOM.classList.remove("showUser");
    registrationOverlay.classList.add("transparentBcg");
    registrationDOM.classList.add("showUser");
  }

  hideRegistrationPage() {
    registrationOverlay.classList.remove("transparentBcg");
    registrationDOM.classList.remove("showUser");
  }

  hideArticlePage() {
    articleOverlay.classList.remove("transparentBcg");
    articleDOM.classList.remove("showUser");
    body.style.overflowY = "scroll";

    var articleInformation = document.querySelector(".articleInformation");
    articleInformation.innerHTML = "";
    ui_global.getBagButtons();
  }

  showProfilePage() {
    profileOverlay.classList.add("transparentBcg");
    profileDOM.classList.add("showUser");

  }
  hideProfilePage() {
    profileOverlay.classList.remove("transparentBcg");
    profileDOM.classList.remove("showUser");
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    console.log("buttons:", buttons.length);
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.artikalId == id);
      if (inCart) {
        button.innerText = "Vec je u korpi";
        button.disabled = true;
      }
      else {
        if (button.getAttribute('listener') !== 'true') {
          button.setAttribute('listener', 'true');
          button.addEventListener("click", (event) => {
            event.stopPropagation();
            event.target.innerText = "Vec je u korpi";
            event.target.disabled = true;
            // uzmi proizvod od proizvoda
            let cartItem = { ...Storage.getProduct(id), amount: 1 };
            // dodaj u korpu
            cart = [...cart, cartItem];
            console.log("cart:", cart);
            // sacuvaj korpu u local storage
            Storage.saveCart(cart);
            // postavimo vrednost korpi
            this.setCartValues(cart);
            // prikazi proizvod korpe
            this.addCartItem(cartItem);
            // prikazi korpu
            this.showCart();
          });
        }
      }
    });
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
    closeUserMenuBtn.addEventListener("click", this.hideUserMenu);
    userBtn.addEventListener("click", this.showUserMenu);
    registrationBtn.addEventListener("click", this.showRegistrationPage);
    closeRegistrationMenuBtn.addEventListener("click", this.hideRegistrationPage);
    closeArticlePageBtn.addEventListener("click", this.hideArticlePage);
    closeProfileBtn.addEventListener("click", this.hideProfilePage);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  hideUserMenu() {
    userOverlay.classList.remove("transparentBcg");
    userDOM.classList.remove("showUser");
  }
  cartLogic() {
    // isprazni korpu
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    //funkcionalnost korpe
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.artikalId == id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.artikalId == id);
        tempItem.amount = tempItem.amount - 1;
         if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
   clearCart() {
    let cartItems = cart.map((item) => item.artikalId);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.artikalId != id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>Dodaj u korpu`;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id == id);
  }
}

// localno skladiste


document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // setup app
  ui.setupAPP();
  // uzmi sve proizvode
  products
    .getProducts(ui)
    .then(() => {

    });
});

function PROVERA() {
  alert("Forma je uspesno poslata");
}
// // //validacija formew
// function PROVERA() {
//   let name = document.forms["RegForm"]["name"];
//   let prezime = document.forms["RegForm"]["prezime"];
//   let telefon = document.forms["RegForm"]["telefon"];
//   let naslov = document.forms["RegForm"]["naslov"];
//   let subject = document.forms["RegForm"]["subject"];
//   let nijeBroj = /^\d+$/;
//   let space = /\W+/g;
//   let nameproba = /^\S*$/u;
//   let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   let telefon = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
//   if (name.value.match(nameproba)) {
//     window.alert("Polje ime ne sme da sazdrzi razmak izmedju slova");
//     name.focus();
//     return false;
//   }

//   if (prezime.value.match(space)) {
//     window.alert("Polje prezime ne sme da sazdrzi razmak izmedju slova.");
//     prezime.focus();
//     return false;
//   }

//   if (!telefon.value.match(telefon)) {
//     window.alert("Molimo vas unesite broj telefona.");
//     telefon.focus();
//     return false;
//   }

//   if (naslov.value == "") {
//     window.alert("Molimo vas unesite naslov poruke.");
//     naslov.focus();
//     return false;
//   }

//   if (subject.value == "") {
//     window.alert("Morate uneti poruku");
//     subject.focus();
//     return false;
//   }
//   return window.alert("Uspesno ste poslali poruku, bice vam odgovoreno u najkracem roku");;
// }

