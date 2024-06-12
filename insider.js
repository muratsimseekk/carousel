(() => {
  const self = {
    init: () => {
      const storedProducts = localStorage.getItem("products");
      // check Local Storage if there is/are product
      if (storedProducts) {
        const products = JSON.parse(storedProducts);
        self.htmlPage(products);
        self.setEvents(products);
      }
      //If not , fetch products from URL . (!!! There is a problem fetching product on browser . Content Security Policy error !!! )
      //Codes work on local succesfully .
      else {
        fetch(
          "http://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
        )
          .then((resp) => resp.json())
          .then((products) => {
            self.htmlPage(products);
            self.setEvents(products);
            localStorage.setItem("productList", JSON.stringify(products));
          })
          .catch((error) =>
            console.log("Error while fetching products", error)
          );
      }

      self.styling();
    },

    htmlPage: (products) => {
      let favList = [];

      const storedFavorites = localStorage.getItem("favorites");
      //check Local Storage if there is/are favorites product .
      if (storedFavorites) {
        favList = JSON.parse(storedFavorites);
        console.log(favList);
      }

      // Product html structure .
      const productItems = products
        .map(
          (item, index) => `
              <div key=${index} class="carousel-item ">
                <div class="fav-btn passive">&#9825;</div>
                <div class="fav-btn active" style="display: none;">&#9829;</div>
                <a href="${item.url}" target="_blank">
                    <img src="${item.img}" alt="${item.name}" />
                </a>
                <div class="carousel-info">
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                </div>

              </div>
            `
        )
        .join("");
      //main structure . product-detail wraps it .
      const html = `
            <h2>You might also like</h2>
            <div class="container">
                <button class="carousel-button left">&lt;</button>
                <div class="carousel">${productItems}</div>
                <button class="carousel-button right">&gt;</button>
            </div>

          
        `;
      // Adds .product-detail class div to wrap html structure .!!
      const productDetailElement = document.querySelector(".product-detail");
      if (productDetailElement) {
        productDetailElement.insertAdjacentHTML("beforeend", html);
      } else {
        console.error(".product-detail element not found!");
      }
    },

    // Styling CSS codes for tags . Also responsive design has given below .
    styling: () => {
      console.log("css calisiyor");
      const css = `
                .product-detail {
                    width:100wh;
                    height:100vh;
                    display:flex;
                    flex-direction: column;
                    justify-content:center;
                    
                }
                .product-detail h2{
                    padding-left:40px;
                }
                .container {
                    display: flex;
                    justify-content : center;
                    align-items:center;
                    
                    overflow: hidden;
                }
                .carousel {
                    
                    display: flex;
                    gap: 10px;
                    overflow:hidden;
                    padding-top:10px;
                    padding-bottom:10px;
                    
                }
                .carousel-button {
                    transform: translateY(-50%);
                    border: none;
                    cursor: pointer;
                    font-size:40px;
                    color:rgb(51, 51, 51);
                    background-color : white ;
                    font-weight:100;
                }

                .carousel img{
                    width:100%;
                }
                .carousel-item {
                    position:relative;
                    flex : 0 0 calc((100% - (15px *6) )/6.5 );
                    box-sizing: border-box;
                    display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                    transition: transform 0.4s ease-in-out;
                    background-color:white;
                    
                }
                .fav-btn{
                    position:absolute;
                    z-index:50;
                    right: 7%;
                    top: 1.5%;
                    font-size: 22px;
                    cursor:pointer;
                }
                .carousel-item h3 {
                    font-size : 13px;
                    color:#302e2b;
                }
                .carousel-info {
                    padding:5px;
                }
                .carousel-item p {
                    color:#193db0;
                    font-size : 16px;
                }
                .active{
                    font-size: 30px;
                    color:blue;
                }
                @media (max-width: 768px) {
                    .carousel-item a img {
                        width: 120px;
                        
                    }
                    .carousel-item h3 {
                        font-size: 8px;
                        
                    }
                    .carousel-item p {
                        font-size: 11px;
                    }
                    h2 {
                        font-size:12px;
                    }
                }
                @media (min-width: 768px) {
                    .carousel-item a img {
                        width: 150px;
                        
                    }
                    h2 {
                        font-size:16px;
                    }    
                    .carousel-item h3 {
                        font-size: 10px;
                        
                    }
                    .carousel-item p {
                        font-size: 13px;
                    }
                }
                @media (min-width: 1200px) {
                    .carousel-item a img {
                        width: 200px;
                    }
                    h2 {
                        font-size:20px;
                    }
                    .carousel-item h3 {
                        font-size: 14px;
                        
                    }
                    .carousel-item p {
                        font-size: 16px;
                    }
            }
            `;
      const style = document.createElement("style");
      style.classList.add("carousel-style");
      style.textContent = css;
      document.head.appendChild(style);
    },

    setEvents: (products) => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      const favButtons = document.querySelectorAll(".fav-btn");

      //Favorite process when click to Fav Icon (Heart)

      function favButtonHandler(event) {
        const target = event.target;
        const carouselItem = target.closest(".carousel-item");
        const key = carouselItem.getAttribute("key");

        const passiveBtn = carouselItem.querySelector(".fav-btn.passive");
        const activeBtn = carouselItem.querySelector(".fav-btn.active");

        //passiveBtn has default CSS
        //activeBtn has Blue Heart CSS color .

        if (passiveBtn.style.display === "none") {
          passiveBtn.style.display = "block";
          activeBtn.style.display = "none";

          //Remove from favorites array if there is a product with same key when clicks on it .
          favorites = favorites.filter((id) => id !== key);
        } else {
          passiveBtn.style.display = "none";
          activeBtn.style.display = "block";

          // Add key to favorites if it's not already in it .

          if (!favorites.includes(key)) {
            favorites.push(key);
          }
        }

        // Save updated favorites to localStorage
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }

      favButtons.forEach((button) => {
        button.addEventListener("click", favButtonHandler);
      });

      // Set initial state of fav buttons based on localStorage
      favButtons.forEach((button) => {
        //used closest attribute to find Product Key which is clicked .
        const carouselItem = button.closest(".carousel-item");
        const key = carouselItem.getAttribute("key");

        if (favorites.includes(key)) {
          const passiveBtn = carouselItem.querySelector(".fav-btn.passive");
          const activeBtn = carouselItem.querySelector(".fav-btn.active");
          passiveBtn.style.display = "none";
          activeBtn.style.display = "block";
        }
      });

      //Chooses left and right Buttons
      const leftButton = document.querySelector(".carousel-button.left");
      const rightButton = document.querySelector(".carousel-button.right");

      //currentIndex starts 0 to begin from first element in productList .
      let currentIndex = 0;

      let totalSlides = products.length;

      leftButton.addEventListener("click", leftButtonClickHandler);

      function leftButtonClickHandler() {
        //When page renders , currentIndex is 0 but if we press left button it becomes 9 after 291.line code . So i wrote it to make it 1 in initial
        //so it cant goes on left side because it will be 0 .
        if (currentIndex == 0) {
          currentIndex = 1;
        }
        console.log("sola basildi");
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        console.log(currentIndex);
        showSlide(currentIndex);
        rightButton.addEventListener("click", rightButtonClickHandler);

        //Check index to disable pressing left arrow when it becomes 0.
        if (currentIndex == 0) {
          leftButton.removeEventListener("click", leftButtonClickHandler);
        }
      }

      rightButton.addEventListener("click", rightButtonClickHandler);

      function rightButtonClickHandler() {
        currentIndex = (currentIndex + 1) % totalSlides;

        console.log(currentIndex);

        //Its required 6.5 product in carousel so i checked with this logic to stop right arrow .
        //For example : totalSlides=10 , 10%6 = 4 . currentIndex 5 makes gap on the right side of carousel container.
        //This check avoid it and stops iterate.
        if (totalSlides % 6 === currentIndex) {
          finishSlides(currentIndex);
          rightButton.removeEventListener("click", rightButtonClickHandler);
        } else {
          showSlide(currentIndex);
        }
        if (currentIndex !== 0) {
          leftButton.addEventListener("click", leftButtonClickHandler);
        }
      }

      function showSlide(currentIndex) {
        const carouselItems = document.querySelectorAll(".carousel-item");
        const product = document.querySelector(".carousel-item");
        const itemWidth = product.offsetWidth + 15;

        const transformValue = -currentIndex * itemWidth;
        carouselItems.forEach((carouselItem) => {
          // Iterate items with their offsetWidths and gaps that between them .
          carouselItem.style.transform = `translateX(${transformValue}px)`; // Apply the transform to each carousel item
        });
      }

      function finishSlides(currentIndex) {
        const carouselItems = document.querySelectorAll(".carousel-item");
        const product = document.querySelector(".carousel-item");
        const itemWidth = product.offsetWidth + 15;

        const transformValue = -currentIndex * itemWidth + itemWidth / 2 + 8; // 207
        carouselItems.forEach((carouselItem) => {
          // Iterate through each carousel item
          carouselItem.style.transform = `translateX(${transformValue}px)`;
          // Apply the transform to each carousel item
        });
      }
    },
  };

  self.init();
})();
