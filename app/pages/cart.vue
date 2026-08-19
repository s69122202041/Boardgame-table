<script setup>
import {
  computed,
  ref
} from 'vue'

const {
  cart,
  cartCount,
  cartTotal,
  discountTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  calculateFinalPrice
} = useCart()

/*
|--------------------------------------------------------------------------
| Mock Checkout
|--------------------------------------------------------------------------
*/

const shipping = computed(() => {
  if (cart.value.length === 0) {
    return 0
  }

  if (cartTotal.value >= 2000) {
    return 0
  }

  return 80
})

const grandTotal = computed(() => {
  return (
    cartTotal.value +
    shipping.value
  )
})

/*
|--------------------------------------------------------------------------
| Mock Coupon
|--------------------------------------------------------------------------
*/

const coupon = ref('')

const couponDiscount = ref(0)

const couponMessage = ref('')

const applyCoupon = () => {
  const code =
    coupon.value
      .trim()
      .toUpperCase()

  if (code === 'BOARD10') {
    couponDiscount.value =
      Math.round(
        cartTotal.value * 0.1
      )

    couponMessage.value =
      'ใช้โค้ด BOARD10 สำเร็จ ลด 10%'
  } else if (code === '') {
    couponDiscount.value = 0

    couponMessage.value =
      ''
  } else {
    couponDiscount.value = 0

    couponMessage.value =
      'ไม่พบโค้ดส่วนลดนี้'
  }
}

const finalGrandTotal = computed(() => {
  return Math.max(
    0,
    grandTotal.value -
      couponDiscount.value
  )
})

/*
|--------------------------------------------------------------------------
| Mock Checkout
|--------------------------------------------------------------------------
*/

const isCheckout = ref(false)

const checkout = () => {
  if (cart.value.length === 0) {
    return
  }

  isCheckout.value = true
}

const finishCheckout = () => {
  alert(
    'จำลองการสั่งซื้อสำเร็จแล้ว 🎉'
  )

  clearCart()

  isCheckout.value = false

  coupon.value = ''

  couponDiscount.value = 0

  couponMessage.value = ''
}

/*
|--------------------------------------------------------------------------
| Format
|--------------------------------------------------------------------------
*/

const formatPrice = price => {
  return Number(price || 0)
    .toLocaleString('th-TH')
}
</script>


<template>
  <div class="cart-page">

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <section class="cart-hero">

      <div class="container">

        <div class="eyebrow">
          YOUR TABLE
        </div>

        <h1>
          ตะกร้าสินค้า
        </h1>

        <p>
          ตรวจสอบเกมที่คุณเลือก
          ก่อนเริ่มเกมบนโต๊ะของคุณ
        </p>

      </div>

    </section>


    <!-- =====================================================
         EMPTY CART
    ====================================================== -->

    <section
      v-if="cart.length === 0"
      class="empty-cart"
    >

      <div class="container">

        <div class="empty-icon">
          🛒
        </div>

        <h2>
          ตะกร้าของคุณยังว่าง
        </h2>

        <p>
          ยังไม่มีบอร์ดเกมในตะกร้า
        </p>

        <NuxtLink
          to="/"
          class="shop-button"
        >
          🎲 เลือกบอร์ดเกม
        </NuxtLink>

      </div>

    </section>


    <!-- =====================================================
         CART
    ====================================================== -->

    <section
      v-else
      class="cart-section"
    >

      <div class="container">

        <div class="cart-layout">

          <!-- ===============================================
               ITEMS
          ================================================ -->

          <div class="cart-items">

            <div class="cart-heading">

              <div>

                <span>
                  BOARDGAME COLLECTION
                </span>

                <h2>
                  สินค้าในตะกร้า
                </h2>

              </div>

              <strong>
                {{ cartCount }} ชิ้น
              </strong>

            </div>


            <!-- ITEM -->

            <article
              v-for="item in cart"
              :key="item.id"
              class="cart-item"
            >

              <!-- IMAGE -->

              <NuxtLink
                :to="`/products/${item.id}`"
                class="item-image"
              >

                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                >

                <span v-else>
                  🎲
                </span>

              </NuxtLink>


              <!-- INFO -->

              <div class="item-info">

                <NuxtLink
                  :to="`/products/${item.id}`"
                  class="item-name"
                >
                  {{ item.name }}
                </NuxtLink>

                <div class="item-meta">

                  <span
                    v-if="item.discount > 0"
                    class="discount"
                  >
                    -{{ item.discount }}%
                  </span>

                  <span
                    v-if="item.discount > 0"
                    class="old-price"
                  >
                    ฿{{ formatPrice(item.price) }}
                  </span>

                </div>


                <div class="item-bottom">

                  <div class="quantity">

                    <button
                      type="button"
                      @click="
                        decreaseQuantity(item.id)
                      "
                    >
                      −
                    </button>

                    <span>
                      {{ item.quantity }}
                    </span>

                    <button
                      type="button"
                      @click="
                        increaseQuantity(item.id)
                      "
                    >
                      +
                    </button>

                  </div>


                  <strong class="item-price">
                    ฿{{
                      formatPrice(
                        calculateFinalPrice(
                          item.price,
                          item.discount
                        ) *
                          item.quantity
                      )
                    }}
                  </strong>

                </div>

              </div>


              <!-- REMOVE -->

              <button
                type="button"
                class="remove-button"
                title="ลบสินค้า"
                @click="
                  removeFromCart(item.id)
                "
              >
                ×
              </button>

            </article>


            <!-- CLEAR -->

            <button
              type="button"
              class="clear-button"
              @click="clearCart"
            >
              ล้างตะกร้าทั้งหมด
            </button>

          </div>


          <!-- ===============================================
               SUMMARY
          ================================================ -->

          <aside class="summary">

            <div class="summary-heading">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                สรุปคำสั่งซื้อ
              </h2>

            </div>


            <!-- PRICE -->

            <div class="summary-row">

              <span>
                ราคาสินค้า
              </span>

              <strong>
                ฿{{ formatPrice(cartTotal) }}
              </strong>

            </div>


            <div class="summary-row discount-row">

              <span>
                ส่วนลดสินค้า
              </span>

              <strong>
                -฿{{
                  formatPrice(
                    discountTotal
                  )
                }}
              </strong>

            </div>


            <div class="summary-row">

              <span>
                ค่าจัดส่ง
              </span>

              <strong
                :class="{
                  free:
                    shipping === 0
                }"
              >
                {{
                  shipping === 0
                    ? 'ฟรี'
                    : `฿${formatPrice(shipping)}`
                }}
              </strong>

            </div>


            <!-- FREE SHIPPING -->

            <div
              v-if="cartTotal < 2000"
              class="shipping-message"
            >
              ซื้อเพิ่มอีก
              <strong>
                ฿{{
                  formatPrice(
                    2000 -
                      cartTotal
                  )
                }}
              </strong>
              เพื่อรับส่งฟรี
            </div>

            <div
              v-else
              class="shipping-message success"
            >
              ✓ คุณได้รับสิทธิ์ส่งฟรี
            </div>


            <!-- COUPON -->

            <div class="coupon">

              <label>
                Coupon Code
              </label>

              <div class="coupon-input">

                <input
                  v-model="coupon"
                  type="text"
                  placeholder="BOARD10"
                >

                <button
                  type="button"
                  @click="applyCoupon"
                >
                  ใช้
                </button>

              </div>

              <p
                v-if="couponMessage"
                :class="{
                  success:
                    couponDiscount > 0,
                  error:
                    couponDiscount === 0
                }"
              >
                {{ couponMessage }}
              </p>

            </div>


            <!-- COUPON DISCOUNT -->

            <div
              v-if="couponDiscount > 0"
              class="summary-row coupon-row"
            >

              <span>
                ส่วนลด Coupon
              </span>

              <strong>
                -฿{{
                  formatPrice(
                    couponDiscount
                  )
                }}
              </strong>

            </div>


            <!-- TOTAL -->

            <div class="total-row">

              <span>
                ยอดสุทธิ
              </span>

              <strong>
                ฿{{
                  formatPrice(
                    finalGrandTotal
                  )
                }}
              </strong>

            </div>


            <!-- CHECKOUT -->

            <button
              type="button"
              class="checkout-button"
              @click="checkout"
            >
              ดำเนินการสั่งซื้อ →
            </button>


            <NuxtLink
              to="/"
              class="continue-shopping"
            >
              ← เลือกซื้อสินค้าเพิ่มเติม
            </NuxtLink>


            <!-- NOTE -->

            <div class="mock-note">

              <strong>
                DEMO MODE
              </strong>

              <p>
                ระบบนี้เป็น Frontend Mockup
                ยังไม่มี Payment,
                API หรือ Backend
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>


    <!-- =====================================================
         CHECKOUT MODAL
    ====================================================== -->

    <div
      v-if="isCheckout"
      class="modal-overlay"
      @click.self="
        isCheckout = false
      "
    >

      <div class="checkout-modal">

        <button
          type="button"
          class="modal-close"
          @click="
            isCheckout = false
          "
        >
          ×
        </button>

        <div class="checkout-icon">
          🎲
        </div>

        <span class="eyebrow">
          DEMO CHECKOUT
        </span>

        <h2>
          ยืนยันคำสั่งซื้อ
        </h2>

        <p>
          นี่เป็นการจำลองระบบ Checkout
          สำหรับ Frontend เท่านั้น
        </p>


        <div class="checkout-total">

          <span>
            ยอดชำระ
          </span>

          <strong>
            ฿{{
              formatPrice(
                finalGrandTotal
              )
            }}
          </strong>

        </div>


        <button
          type="button"
          class="confirm-button"
          @click="finishCheckout"
        >
          ✓ ยืนยันการสั่งซื้อ
        </button>

        <button
          type="button"
          class="cancel-button"
          @click="
            isCheckout = false
          "
        >
          ยกเลิก
        </button>

      </div>

    </div>

  </div>
</template>


<style scoped>
/* =========================================================
   GENERAL
========================================================= */

.cart-page {
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
   HERO
========================================================= */

.cart-hero {
  padding:
    65px 0;

  background:
    linear-gradient(
      135deg,
      #eee5d8,
      #faf8f4
    );
}

.eyebrow {
  color: #9b5b28;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.16em;
}

.cart-hero h1 {
  margin:
    10px 0;

  font-size:
    clamp(
      3rem,
      7vw,
      5rem
    );

  line-height: 0.95;

  letter-spacing: -0.05em;
}

.cart-hero p {
  margin: 0;

  color: #756e66;
}


/* =========================================================
   EMPTY
========================================================= */

.empty-cart {
  min-height: 500px;

  display: grid;

  place-items: center;

  text-align: center;
}

.empty-icon {
  font-size: 5rem;
}

.empty-cart h2 {
  margin:
    20px 0 8px;
}

.empty-cart p {
  margin:
    0 0 25px;

  color: #817970;
}

.shop-button {
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
   CART
========================================================= */

.cart-section {
  padding:
    60px 0 100px;
}

.cart-layout {
  display: grid;

  grid-template-columns:
    minmax(0, 1.5fr)
    minmax(330px, 0.7fr);

  gap: 40px;

  align-items: start;
}


/* =========================================================
   CART HEADING
========================================================= */

.cart-heading {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 25px;
}

.cart-heading span,
.summary-heading span {
  color: #9b5b28;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.15em;
}

.cart-heading h2,
.summary-heading h2 {
  margin:
    7px 0 0;

  font-size: 2rem;

  letter-spacing: -0.03em;
}

.cart-heading > strong {
  color: #817970;

  font-size: 0.9rem;
}


/* =========================================================
   ITEM
========================================================= */

.cart-item {
  position: relative;

  display: grid;

  grid-template-columns:
    120px
    1fr
    30px;

  gap: 20px;

  padding:
    20px 0;

  border-top:
    1px solid #e4dcd2;
}

.item-image {
  width: 120px;

  aspect-ratio: 1;

  overflow: hidden;

  display: grid;

  place-items: center;

  border-radius: 13px;

  background: #eae3d9;
}

.item-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.item-image span {
  font-size: 3rem;
}

.item-info {
  min-width: 0;
}

.item-name {
  display: block;

  color: #29251f;

  font-size: 1.1rem;

  font-weight: 900;
}

.item-meta {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 8px;

  font-size: 0.75rem;
}

.discount {
  color: #c84e4e;

  font-weight: 900;
}

.old-price {
  color: #aaa29a;

  text-decoration:
    line-through;
}

.item-bottom {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-top: 25px;
}

.quantity {
  display: flex;

  align-items: center;

  overflow: hidden;

  border:
    1px solid #dcd4ca;

  border-radius: 9px;

  background: white;
}

.quantity button {
  width: 34px;
  height: 34px;

  border: 0;

  background: transparent;

  cursor: pointer;

  font-size: 1rem;
}

.quantity button:hover {
  background: #eee8df;
}

.quantity span {
  width: 35px;

  text-align: center;

  font-size: 0.85rem;

  font-weight: 800;
}

.item-price {
  color: #9b5b28;

  font-size: 1.05rem;
}

.remove-button {
  width: 28px;
  height: 28px;

  border: 0;

  border-radius: 50%;

  background: transparent;

  color: #aaa29a;

  font-size: 1.4rem;

  cursor: pointer;
}

.remove-button:hover {
  background: #f1e8e2;

  color: #c84e4e;
}

.clear-button {
  margin-top: 20px;

  padding:
    9px 0;

  border: 0;

  background: transparent;

  color: #a08f7e;

  font-size: 0.8rem;

  cursor: pointer;
}

.clear-button:hover {
  color: #c84e4e;
}


/* =========================================================
   SUMMARY
========================================================= */

.summary {
  position: sticky;

  top: 25px;

  padding: 28px;

  border:
    1px solid #e4dcd2;

  border-radius: 18px;

  background: white;

  box-shadow:
    0 15px 40px
    rgba(50,40,30,0.06);
}

.summary-row {
  display: flex;

  justify-content: space-between;

  gap: 20px;

  padding:
    12px 0;

  color: #766e66;

  font-size: 0.85rem;
}

.summary-row strong {
  color: #29251f;
}

.discount-row strong,
.coupon-row strong {
  color: #c84e4e;
}

.free {
  color: #4e8060 !important;
}


/* SHIPPING */

.shipping-message {
  margin:
    10px 0 20px;

  padding: 12px;

  border-radius: 9px;

  background: #f4eee6;

  color: #8a7866;

  font-size: 0.75rem;

  line-height: 1.5;
}

.shipping-message strong {
  color: #9b5b28;
}

.shipping-message.success {
  background: #e9f1eb;

  color: #4e8060;
}


/* COUPON */

.coupon {
  padding:
    20px 0;

  border-top:
    1px solid #eee7df;

  border-bottom:
    1px solid #eee7df;
}

.coupon label {
  display: block;

  margin-bottom: 8px;

  font-size: 0.75rem;

  font-weight: 800;
}

.coupon-input {
  display: flex;

  overflow: hidden;

  border:
    1px solid #ddd4ca;

  border-radius: 9px;
}

.coupon-input input {
  width: 100%;

  min-width: 0;

  height: 40px;

  padding:
    0 10px;

  border: 0;

  outline: 0;

  background: transparent;

  font-size: 0.8rem;
}

.coupon-input button {
  padding:
    0 15px;

  border: 0;

  background: #29251f;

  color: white;

  cursor: pointer;

  font-weight: 800;
}

.coupon p {
  margin:
    8px 0 0;

  font-size: 0.72rem;
}

.coupon p.success {
  color: #4e8060;
}

.coupon p.error {
  color: #c84e4e;
}


/* TOTAL */

.total-row {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-top: 20px;

  padding-top: 20px;

  border-top:
    2px solid #29251f;
}

.total-row span {
  font-weight: 800;
}

.total-row strong {
  color: #9b5b28;

  font-size: 1.5rem;
}


/* CHECKOUT */

.checkout-button {
  width: 100%;

  min-height: 52px;

  margin-top: 20px;

  border: 0;

  border-radius: 10px;

  background: #29251f;

  color: white;

  font-weight: 900;

  cursor: pointer;

  transition:
    background 0.2s ease;
}

.checkout-button:hover {
  background: #9b5b28;
}

.continue-shopping {
  display: block;

  margin-top: 15px;

  text-align: center;

  color: #9b5b28;

  font-size: 0.8rem;

  font-weight: 800;
}


/* NOTE */

.mock-note {
  margin-top: 25px;

  padding: 15px;

  border-radius: 10px;

  background: #f7f3ee;
}

.mock-note strong {
  color: #9b5b28;

  font-size: 0.65rem;

  letter-spacing: 0.12em;
}

.mock-note p {
  margin:
    7px 0 0;

  color: #817970;

  font-size: 0.7rem;

  line-height: 1.6;
}


/* =========================================================
   MODAL
========================================================= */

.modal-overlay {
  position: fixed;

  inset: 0;

  z-index: 500;

  display: grid;

  place-items: center;

  padding: 20px;

  background:
    rgba(30,25,20,0.65);
}

.checkout-modal {
  position: relative;

  width: min(
    450px,
    100%
  );

  padding: 40px;

  border-radius: 20px;

  background: #faf8f4;

  text-align: center;

  box-shadow:
    0 30px 80px
    rgba(0,0,0,0.3);
}

.modal-close {
  position: absolute;

  top: 15px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: 0;

  border-radius: 50%;

  background: #eee8df;

  font-size: 1.3rem;

  cursor: pointer;
}

.checkout-icon {
  margin-bottom: 15px;

  font-size: 4rem;
}

.checkout-modal h2 {
  margin:
    10px 0;
}

.checkout-modal > p {
  color: #817970;

  font-size: 0.85rem;

  line-height: 1.7;
}

.checkout-total {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin:
    25px 0;

  padding:
    18px;

  border-radius: 10px;

  background: white;
}

.checkout-total strong {
  color: #9b5b28;

  font-size: 1.4rem;
}

.confirm-button,
.cancel-button {
  width: 100%;

  min-height: 48px;

  border-radius: 10px;

  font-weight: 800;

  cursor: pointer;
}

.confirm-button {
  border: 0;

  background: #29251f;

  color: white;
}

.cancel-button {
  margin-top: 8px;

  border:
    1px solid #ddd4ca;

  background: transparent;

  color: #5f5851;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {

  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }

}

@media (max-width: 600px) {

  .container {
    width:
      calc(100% - 28px);
  }

  .cart-hero {
    padding:
      50px 0;
  }

  .cart-hero h1 {
    font-size: 3.2rem;
  }

  .cart-item {
    grid-template-columns:
      85px
      1fr
      25px;

    gap: 12px;
  }

  .item-image {
    width: 85px;
  }

  .item-name {
    font-size: 0.95rem;
  }

  .item-bottom {
    margin-top: 15px;
  }

  .item-price {
    font-size: 0.9rem;
  }

  .summary {
    padding: 20px;
  }

}

@media (max-width: 400px) {

  .cart-item {
    grid-template-columns:
      70px
      1fr
      22px;
  }

  .item-image {
    width: 70px;
  }

  .item-bottom {
    flex-direction: column;

    align-items: flex-start;
  }

}
</style>