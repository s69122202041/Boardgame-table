<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { products } from '~/data/products'

const route = useRoute()

const quantity = ref(1)

const addedMessage = ref('')

/*
|--------------------------------------------------------------------------
| FUNCTION
|--------------------------------------------------------------------------
| Function สำหรับคำนวณราคาหลังส่วนลด
|--------------------------------------------------------------------------
*/

const calculateFinalPrice = (price, discount = 0) => {
  const safePrice = Number(price) || 0
  const safeDiscount = Number(discount) || 0

  return Math.round(
    safePrice * (1 - safeDiscount / 100)
  )
}

/*
|--------------------------------------------------------------------------
| FIND PRODUCT
|--------------------------------------------------------------------------
*/

const product = computed(() => {
  return products.find(item => {
    return String(item.id) === String(route.params.id)
  })
})

/*
|--------------------------------------------------------------------------
| FINAL PRICE
|--------------------------------------------------------------------------
*/

const finalPrice = computed(() => {
  if (!product.value) {
    return 0
  }

  return calculateFinalPrice(
    product.value.price,
    product.value.discount
  )
})

/*
|--------------------------------------------------------------------------
| TOTAL PRICE
|--------------------------------------------------------------------------
*/

const totalPrice = computed(() => {
  return finalPrice.value * quantity.value
})

/*
|--------------------------------------------------------------------------
| RELATED PRODUCTS
|--------------------------------------------------------------------------
*/

const relatedProducts = computed(() => {
  if (!product.value) {
    return []
  }

  const currentCategories =
    Array.isArray(product.value.categories)
      ? product.value.categories
      : product.value.category
        ? [product.value.category]
        : []

  return products
    .filter(item => {
      if (item.id === product.value.id) {
        return false
      }

      const itemCategories =
        Array.isArray(item.categories)
          ? item.categories
          : item.category
            ? [item.category]
            : []

      return itemCategories.some(category => {
        return currentCategories.includes(category)
      })
    })
    .slice(0, 4)
})

/*
|--------------------------------------------------------------------------
| ADD TO CART
|--------------------------------------------------------------------------
| เก็บข้อมูลลง localStorage
|--------------------------------------------------------------------------
*/

const addToCart = () => {
  if (!product.value) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  const storageKey = 'boardgame_cart'

  let cart = []

  try {
    const savedCart =
      localStorage.getItem(storageKey)

    if (savedCart) {
      cart = JSON.parse(savedCart)
    }
  } catch (error) {
    console.error(
      'Cannot read cart:',
      error
    )

    cart = []
  }

  const existingItem = cart.find(item => {
    return item.id === product.value.id
  })

  if (existingItem) {
    existingItem.quantity += quantity.value
  } else {
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      discount: product.value.discount || 0,
      image: product.value.image || '',
      quantity: quantity.value
    })
  }

  localStorage.setItem(
    storageKey,
    JSON.stringify(cart)
  )

  window.dispatchEvent(
    new Event('boardgame-cart-updated')
  )

  addedMessage.value =
    `เพิ่ม "${product.value.name}" ลงตะกร้าแล้ว`

  setTimeout(() => {
    addedMessage.value = ''
  }, 2500)
}

/*
|--------------------------------------------------------------------------
| QUANTITY
|--------------------------------------------------------------------------
*/

const increaseQuantity = () => {
  const stock =
    Number(product.value?.stock) || 99

  if (quantity.value < stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div class="detail-page">

    <!-- =====================================================
         NOT FOUND
    ====================================================== -->

    <section
      v-if="!product"
      class="not-found"
    >

      <div class="container">

        <div class="not-found-icon">
          🎲
        </div>

        <h1>
          ไม่พบสินค้านี้
        </h1>

        <p>
          อาจเป็นสินค้าที่ไม่มีอยู่ในระบบ
          หรือ URL ไม่ถูกต้อง
        </p>

        <NuxtLink
          to="/"
          class="primary-button"
        >
          ← กลับหน้าร้าน
        </NuxtLink>

      </div>

    </section>


    <!-- =====================================================
         PRODUCT DETAIL
    ====================================================== -->

    <template v-else>

      <section class="detail-section">

        <div class="container">

          <!-- Breadcrumb -->

          <div class="breadcrumb">

            <NuxtLink to="/">
              Boardgame table
            </NuxtLink>

            <span>
              /
            </span>

            <span>
              Products
            </span>

            <span>
              /
            </span>

            <strong>
              {{ product.name }}
            </strong>

          </div>


          <!-- Main -->

          <div class="detail-grid">

            <!-- IMAGE -->

            <div class="product-image-wrapper">

              <div
                v-if="product.discount > 0"
                class="discount-badge"
              >
                -{{ product.discount }}%
              </div>

              <div class="product-image">

                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                >

                <div
                  v-else
                  class="image-placeholder"
                >
                  🎲
                </div>

              </div>

            </div>


            <!-- INFORMATION -->

            <div class="product-information">

              <div class="product-category">

                {{ product.category || 'BOARD GAME' }}

              </div>

              <h1>
                {{ product.name }}
              </h1>

              <p class="description">
                {{
                  product.description ||
                  'บอร์ดเกมคุณภาพสำหรับการเล่นกับเพื่อนและครอบครัว'
                }}
              </p>


              <!-- PRICE -->

              <div class="price-area">

                <div class="final-price">
                  ฿{{
                    finalPrice.toLocaleString(
                      'th-TH'
                    )
                  }}
                </div>

                <div
                  v-if="product.discount > 0"
                  class="original-price"
                >
                  ฿{{
                    Number(
                      product.price
                    ).toLocaleString(
                      'th-TH'
                    )
                  }}
                </div>

              </div>


              <!-- STOCK -->

              <div class="stock-status">

                <span
                  :class="{
                    available:
                      Number(product.stock) > 0,
                    unavailable:
                      Number(product.stock) <= 0
                  }"
                >
                  {{
                    Number(product.stock) > 0
                      ? '● มีสินค้า'
                      : '● สินค้าหมด'
                  }}
                </span>

                <span
                  v-if="Number(product.stock) > 0"
                >
                  เหลือ {{ product.stock }} ชิ้น
                </span>

              </div>


              <!-- QUANTITY -->

              <div class="purchase-area">

                <div class="quantity-label">
                  จำนวน
                </div>

                <div class="quantity-control">

                  <button
                    type="button"
                    @click="decreaseQuantity"
                  >
                    −
                  </button>

                  <span>
                    {{ quantity }}
                  </span>

                  <button
                    type="button"
                    @click="increaseQuantity"
                  >
                    +
                  </button>

                </div>

              </div>


              <!-- TOTAL -->

              <div class="order-summary">

                <span>
                  รวม
                </span>

                <strong>
                  ฿{{
                    totalPrice.toLocaleString(
                      'th-TH'
                    )
                  }}
                </strong>

              </div>


              <!-- ACTION -->

              <button
                type="button"
                class="add-cart-button"
                :disabled="
                  Number(product.stock) <= 0
                "
                @click="addToCart"
              >
                🛒
                {{
                  Number(product.stock) > 0
                    ? 'เพิ่มลงตะกร้า'
                    : 'สินค้าหมด'
                }}
              </button>


              <!-- FEATURES -->

              <div class="feature-list">

                <div>
                  <span>✓</span>
                  Mock Data สำหรับระบบ Frontend
                </div>

                <div>
                  <span>✓</span>
                  บันทึกตะกร้าด้วย localStorage
                </div>

                <div>
                  <span>✓</span>
                  ไม่มี API / Backend
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           PRODUCT INFORMATION
      ==================================================== -->

      <section class="information-section">

        <div class="container">

          <div class="section-title">

            <span>
              GAME INFORMATION
            </span>

            <h2>
              รายละเอียดเกม
            </h2>

          </div>


          <div class="information-grid">

            <div class="information-card">

              <div class="information-icon">
                👥
              </div>

              <div>

                <span>
                  Players
                </span>

                <strong>
                  {{
                    product.players ||
                    '2–4 คน'
                  }}
                </strong>

              </div>

            </div>


            <div class="information-card">

              <div class="information-icon">
                ⏱️
              </div>

              <div>

                <span>
                  Playing Time
                </span>

                <strong>
                  {{
                    product.playTime ||
                    '30–60 นาที'
                  }}
                </strong>

              </div>

            </div>


            <div class="information-card">

              <div class="information-icon">
                🎯
              </div>

              <div>

                <span>
                  Difficulty
                </span>

                <strong>
                  {{
                    product.difficulty ||
                    'Medium'
                  }}
                </strong>

              </div>

            </div>


            <div class="information-card">

              <div class="information-icon">
                🧠
              </div>

              <div>

                <span>
                  Category
                </span>

                <strong>
                  {{
                    product.category ||
                    'Board Game'
                  }}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ===================================================
           RELATED PRODUCTS
      ==================================================== -->

      <section
        v-if="relatedProducts.length"
        class="related-section"
      >

        <div class="container">

          <div class="section-title">

            <span>
              YOU MAY ALSO LIKE
            </span>

            <h2>
              เกมที่น่าสนใจใกล้เคียงกัน
            </h2>

          </div>


          <div class="related-grid">

            <NuxtLink
              v-for="item in relatedProducts"
              :key="item.id"
              :to="`/products/${item.id}`"
              class="related-card"
            >

              <div class="related-image">

                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                >

                <span v-else>
                  🎲
                </span>

              </div>


              <div class="related-content">

                <h3>
                  {{ item.name }}
                </h3>

                <strong>
                  ฿{{
                    calculateFinalPrice(
                      item.price,
                      item.discount
                    ).toLocaleString(
                      'th-TH'
                    )
                  }}
                </strong>

              </div>

            </NuxtLink>

          </div>

        </div>

      </section>

    </template>


    <!-- =====================================================
         TOAST
    ====================================================== -->

    <Transition name="toast">

      <div
        v-if="addedMessage"
        class="toast"
      >
        ✓
        {{ addedMessage }}
      </div>

    </Transition>

  </div>
</template>


<style scoped>
.detail-page {
  min-height: 100vh;

  background: #faf8f4;

  color: #29251f;
}

.container {
  width: min(
    1180px,
    calc(100% - 40px)
  );

  margin: 0 auto;
}


/* =========================================================
   BREADCRUMB
========================================================= */

.detail-section {
  padding:
    35px 0 80px;
}

.breadcrumb {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 8px;

  margin-bottom: 35px;

  color: #92897e;

  font-size: 0.8rem;
}

.breadcrumb a {
  color: #9b5b28;

  font-weight: 700;
}

.breadcrumb strong {
  color: #29251f;

  font-weight: 600;
}


/* =========================================================
   PRODUCT
========================================================= */

.detail-grid {
  display: grid;

  grid-template-columns:
    1fr
    1fr;

  gap: 70px;

  align-items: start;
}


/* IMAGE */

.product-image-wrapper {
  position: relative;
}

.discount-badge {
  position: absolute;

  top: 18px;
  left: 18px;

  z-index: 2;

  padding:
    8px 12px;

  border-radius: 8px;

  background: #c84e4e;

  color: white;

  font-size: 0.8rem;

  font-weight: 900;
}

.product-image {
  aspect-ratio: 1;

  overflow: hidden;

  display: grid;

  place-items: center;

  border-radius: 25px;

  background:
    linear-gradient(
      145deg,
      #eee5d8,
      #dcd2c4
    );

  box-shadow:
    0 25px 60px
    rgba(50,40,30,0.12);
}

.product-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.image-placeholder {
  font-size: 8rem;
}


/* INFORMATION */

.product-information {
  padding-top: 10px;
}

.product-category {
  color: #9b5b28;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.15em;

  text-transform: uppercase;
}

.product-information h1 {
  margin:
    10px 0 18px;

  font-size:
    clamp(
      2.3rem,
      5vw,
      4.2rem
    );

  line-height: 0.98;

  letter-spacing: -0.045em;
}

.description {
  max-width: 600px;

  color: #746d65;

  line-height: 1.8;
}


/* PRICE */

.price-area {
  display: flex;

  align-items: baseline;

  gap: 14px;

  margin-top: 30px;
}

.final-price {
  color: #9b5b28;

  font-size: 2rem;

  font-weight: 900;
}

.original-price {
  color: #aaa29a;

  font-size: 1rem;

  text-decoration:
    line-through;
}


/* STOCK */

.stock-status {
  display: flex;

  gap: 15px;

  margin-top: 14px;

  color: #8a8278;

  font-size: 0.8rem;
}

.stock-status .available {
  color: #4e8060;

  font-weight: 800;
}

.stock-status .unavailable {
  color: #c84e4e;

  font-weight: 800;
}


/* PURCHASE */

.purchase-area {
  display: flex;

  align-items: center;

  gap: 20px;

  margin-top: 30px;
}

.quantity-label {
  font-size: 0.85rem;

  font-weight: 800;
}

.quantity-control {
  display: flex;

  align-items: center;

  overflow: hidden;

  border:
    1px solid #dcd3c8;

  border-radius: 10px;

  background: white;
}

.quantity-control button {
  width: 40px;
  height: 40px;

  border: 0;

  background: transparent;

  font-size: 1.2rem;

  cursor: pointer;
}

.quantity-control button:hover {
  background: #f0ebe4;
}

.quantity-control span {
  width: 42px;

  text-align: center;

  font-weight: 800;
}


/* SUMMARY */

.order-summary {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 25px;

  padding:
    16px 0;

  border-top:
    1px solid #e4dcd2;

  border-bottom:
    1px solid #e4dcd2;
}

.order-summary span {
  color: #817970;
}

.order-summary strong {
  font-size: 1.3rem;
}


/* BUTTON */

.add-cart-button {
  width: 100%;

  min-height: 55px;

  margin-top: 18px;

  border: 0;

  border-radius: 12px;

  background: #29251f;

  color: white;

  font-size: 1rem;

  font-weight: 900;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.add-cart-button:hover:not(:disabled) {
  background: #9b5b28;

  transform:
    translateY(-2px);
}

.add-cart-button:disabled {
  background: #bcb5ad;

  cursor: not-allowed;
}


/* FEATURES */

.feature-list {
  display: grid;

  gap: 10px;

  margin-top: 25px;

  color: #746d65;

  font-size: 0.8rem;
}

.feature-list span {
  margin-right: 8px;

  color: #4e8060;

  font-weight: 900;
}


/* =========================================================
   INFORMATION
========================================================= */

.information-section {
  padding:
    70px 0;

  background: #29251f;

  color: white;
}

.section-title span {
  color: #d8a76f;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.16em;
}

.section-title h2 {
  margin:
    8px 0 0;

  font-size: 2rem;

  letter-spacing: -0.03em;
}

.information-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 15px;

  margin-top: 30px;
}

.information-card {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 20px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius: 14px;

  background:
    rgba(255,255,255,0.05);
}

.information-icon {
  font-size: 1.7rem;
}

.information-card span {
  display: block;

  margin-bottom: 5px;

  color: #a9a096;

  font-size: 0.7rem;

  text-transform: uppercase;
}

.information-card strong {
  font-size: 0.9rem;
}


/* =========================================================
   RELATED
========================================================= */

.related-section {
  padding:
    80px 0;
}

.related-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 18px;

  margin-top: 30px;
}

.related-card {
  overflow: hidden;

  border:
    1px solid #e5ddd3;

  border-radius: 16px;

  background: white;

  transition:
    transform 0.2s ease;
}

.related-card:hover {
  transform:
    translateY(-4px);
}

.related-image {
  aspect-ratio: 1;

  display: grid;

  place-items: center;

  overflow: hidden;

  background: #eee8df;
}

.related-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.related-image span {
  font-size: 3rem;
}

.related-content {
  padding: 15px;
}

.related-content h3 {
  margin:
    0 0 8px;

  font-size: 0.95rem;
}

.related-content strong {
  color: #9b5b28;
}


/* =========================================================
   NOT FOUND
========================================================= */

.not-found {
  min-height:
    calc(100vh - 100px);

  display: grid;

  place-items: center;

  text-align: center;
}

.not-found-icon {
  font-size: 5rem;
}

.not-found h1 {
  margin:
    20px 0 10px;
}

.not-found p {
  margin-bottom: 25px;

  color: #817970;
}

.primary-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-height: 48px;

  padding:
    0 20px;

  border-radius: 10px;

  background: #29251f;

  color: white;

  font-weight: 800;
}


/* =========================================================
   TOAST
========================================================= */

.toast {
  position: fixed;

  right: 25px;
  bottom: 25px;

  z-index: 100;

  padding:
    14px 20px;

  border-radius: 12px;

  background: #29251f;

  color: white;

  box-shadow:
    0 15px 40px
    rgba(0,0,0,0.2);

  font-weight: 700;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform:
    translateY(10px);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {

  .detail-grid {
    grid-template-columns: 1fr;

    gap: 40px;
  }

  .information-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .related-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

}

@media (max-width: 600px) {

  .container {
    width:
      calc(100% - 28px);
  }

  .detail-section {
    padding-bottom: 50px;
  }

  .product-information h1 {
    font-size: 2.5rem;
  }

  .information-grid {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns:
      1fr 1fr;
  }

  .purchase-area {
    justify-content: space-between;
  }

}

@media (max-width: 430px) {

  .related-grid {
    grid-template-columns: 1fr;
  }

}
</style>