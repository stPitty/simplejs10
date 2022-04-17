const products = document.querySelectorAll('.product');
const basket = document.querySelector('.cart');

function getProductFromStorage(productId) {
  return JSON.parse(localStorage.getItem(productId));
}

function saveProductToStorage(product) {
  localStorage.setItem(product.id, JSON.stringify(product));
  return true
}

function delProductFromStorage(productId) {
  localStorage.removeItem(productId)
  return true
}

function addOrUpdateProduct(product) {
  const oldProduct = getProductFromStorage(product.id)
  if (oldProduct) {
    product.count = Number(oldProduct.count) + Number(product.count);
  }
  saveProductToStorage(product);
  return true
}

function renderProduct(product) {
 return `
<div class="cart__product" data-id="${product.id}">
    <button class="cart__product-remove">Удалить</button>
    <img class="cart__product-image" src=${product.img} alt=" ">
    <div class="cart__product-count">${product.count}</div>
</div>
`
}

function renderBasket() {
  if (basketIsHidden()) {
    return
  }

  let products = ''

  for (let productId in localStorage) {
    if (localStorage.hasOwnProperty(productId)) {
      const product = getProductFromStorage(productId);
      products += renderProduct(product);
    }
  }
  const basket = document.querySelector('.cart__products');
  basket.innerHTML = products

  const removeButtons = basket.querySelectorAll('.cart__product-remove')

  for (let button of removeButtons) {
    button.addEventListener('click', () => {
      const productId = button.closest('.cart__product').dataset.id;

      delProductFromStorage(productId)
      renderBasket()
    })
  }
}

function basketIsHidden() {
  if (!localStorage.length) {
    basket.remove();
    return true
  } else {
    const header = document.querySelector('.header');
    header.insertAdjacentElement('afterend', basket);
    return false
  }
}

function renderFakeProduct(img) {
  const fakeImg = img.cloneNode(true);
  const isBasket = document.querySelector('.cart');
  let hidden = false;

  if (!isBasket) {
    const header = document.querySelector('.header');
    header.insertAdjacentElement('afterend', basket);
    hidden = true;
  }

  const products = basket.querySelector('.cart__products');
  products.insertAdjacentElement('beforeend', fakeImg)
  const position = fakeImg.getBoundingClientRect();

  if (hidden) {
    basket.remove();
  }
  fakeImg.remove();
  return position
}

function moveImage(img) {
  let imgFinalPosition
  const imgProducts = Array.from(basket.querySelectorAll('.cart__product-image'));
  const imgInBasket = imgProducts.filter((element) => element.src === img.src)[0];

  if (imgInBasket) {
    imgFinalPosition = imgInBasket.getBoundingClientRect();
  } else {
    imgFinalPosition = renderFakeProduct(img);
  }
  const imgStartPosition = img.getBoundingClientRect();
  const moveCoordinates = {
    top: imgStartPosition.top - imgFinalPosition.top,
    left: imgFinalPosition.left - imgStartPosition.left,
  }

  const imgCopy = img.cloneNode(true);
  imgCopy.style.position = 'absolute';
  document.body.insertAdjacentElement('afterbegin', imgCopy);
  imgCopy.style.top = img.offsetTop + 'px';
  imgCopy.style.left = img.offsetLeft + 'px';
  imgCopy.style.zIndex = '100';


  let i = 0
  const mover = setInterval(() => {
    if (i === 9) {
      clearInterval(mover);
      imgCopy.remove();
      renderBasket();
    }
    imgCopy.style.top = imgCopy.offsetTop -moveCoordinates.top/10 + 'px';
    imgCopy.style.left = imgCopy.offsetLeft + moveCoordinates.left/10 + 'px';
    i++
  }, 20)
}

renderBasket()

for (let product of products) {
  const increase = product.querySelector('.product__quantity-control_inc');
  const decrease = product.querySelector('.product__quantity-control_dec');
  const count = product.querySelector('.product__quantity-value');
  const addToBasket = product.querySelector('.product__add');

  increase.addEventListener('click', () => {
    count.textContent++;
  });

  decrease.addEventListener('click', () => {
    if (count.textContent > 1) {
      count.textContent--;
    }
  });

  addToBasket.addEventListener('click', () => {
    const img = product.querySelector('.product__image')
    const productInfo = {
      id: product.dataset.id,
      img: img.src,
      count: count.innerText,
    }
    addOrUpdateProduct(productInfo);
    moveImage(img);
  })
}

