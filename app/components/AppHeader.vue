<script setup>
const {
  cartCount
} = useCart()

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>


<template>
  <header class="site-header">

    <div class="header-container">

      <!-- =================================================
           LOGO
      ================================================== -->

      <NuxtLink
        to="/"
        class="brand"
        @click="closeMenu"
      >

        <span class="brand-icon">
          🎲
        </span>

        <span class="brand-text">

          <strong>
            Boardgame
          </strong>

          <small>
            table
          </small>

        </span>

      </NuxtLink>


      <!-- =================================================
           DESKTOP NAV
      ================================================== -->

      <nav class="desktop-nav">

        <NuxtLink
          to="/"
          class="nav-link"
        >
          หน้าแรก
        </NuxtLink>

        <NuxtLink
          to="/#products"
          class="nav-link"
        >
          บอร์ดเกม
        </NuxtLink>

        <NuxtLink
          to="/#categories"
          class="nav-link"
        >
          หมวดหมู่
        </NuxtLink>

        <NuxtLink
          to="/#discrete"
          class="nav-link"
        >
          Discrete Math
        </NuxtLink>

      </nav>


      <!-- =================================================
           RIGHT SIDE
      ================================================== -->

      <div class="header-actions">

        <!-- CART -->

        <NuxtLink
          to="/cart"
          class="cart-button"
          aria-label="ตะกร้าสินค้า"
        >

          <span class="cart-icon">
            🛒
          </span>

          <span class="cart-label">
            ตะกร้า
          </span>

          <span
            v-if="cartCount > 0"
            class="cart-count"
          >
            {{ cartCount }}
          </span>

        </NuxtLink>


        <!-- MOBILE MENU -->

        <button
          type="button"
          class="menu-button"
          :class="{
            active: isMenuOpen
          }"
          aria-label="เปิดเมนู"
          @click="
            isMenuOpen =
              !isMenuOpen
          "
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>

    </div>


    <!-- =================================================
         MOBILE NAV
    ================================================== -->

    <Transition name="mobile-menu">

      <nav
        v-if="isMenuOpen"
        class="mobile-nav"
      >

        <NuxtLink
          to="/"
          class="mobile-nav-link"
          @click="closeMenu"
        >
          <span>⌂</span>
          หน้าแรก
        </NuxtLink>


        <NuxtLink
          to="/#products"
          class="mobile-nav-link"
          @click="closeMenu"
        >
          <span>🎲</span>
          บอร์ดเกม
        </NuxtLink>


        <NuxtLink
          to="/#categories"
          class="mobile-nav-link"
          @click="closeMenu"
        >
          <span>▦</span>
          หมวดหมู่
        </NuxtLink>


        <NuxtLink
          to="/#discrete"
          class="mobile-nav-link"
          @click="closeMenu"
        >
          <span>∑</span>
          Discrete Mathematics
        </NuxtLink>


        <NuxtLink
          to="/cart"
          class="mobile-nav-link cart-mobile"
          @click="closeMenu"
        >

          <span>🛒</span>

          ตะกร้าสินค้า

          <span
            v-if="cartCount > 0"
            class="mobile-count"
          >
            {{ cartCount }}
          </span>

        </NuxtLink>

      </nav>

    </Transition>

  </header>
</template>


<style scoped>
/* =========================================================
   HEADER
========================================================= */

.site-header {
  position: sticky;

  top: 0;

  z-index: 100;

  width: 100%;

  border-bottom:
    1px solid rgba(
      228,
      220,
      210,
      0.9
    );

  background:
    rgba(
      250,
      248,
      244,
      0.94
    );

  backdrop-filter:
    blur(14px);
}


/* =========================================================
   CONTAINER
========================================================= */

.header-container {
  width: min(
    1180px,
    calc(100% - 40px)
  );

  min-height: 76px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;
}


/* =========================================================
   BRAND
========================================================= */

.brand {
  display: inline-flex;

  align-items: center;

  gap: 10px;

  color: #29251f;

  text-decoration: none;

  flex-shrink: 0;
}

.brand-icon {
  width: 40px;
  height: 40px;

  display: grid;

  place-items: center;

  border-radius: 11px;

  background: #29251f;

  color: white;

  font-size: 1.25rem;

  box-shadow:
    0 5px 15px
    rgba(
      41,
      37,
      31,
      0.15
    );
}

.brand-text {
  display: flex;

  flex-direction: column;

  line-height: 1;
}

.brand-text strong {
  font-size: 1rem;

  letter-spacing:
    -0.03em;
}

.brand-text small {
  margin-top: 5px;

  color: #9b5b28;

  font-size: 0.65rem;

  font-weight: 900;

  letter-spacing:
    0.16em;

  text-transform: uppercase;
}


/* =========================================================
   DESKTOP NAV
========================================================= */

.desktop-nav {
  display: flex;

  align-items: center;

  gap: 28px;

  margin-left: auto;
}

.nav-link {
  position: relative;

  padding:
    8px 0;

  color: #665f58;

  font-size: 0.82rem;

  font-weight: 700;

  text-decoration: none;

  transition:
    color 0.2s ease;
}

.nav-link::after {
  content: '';

  position: absolute;

  left: 0;

  right: 100%;

  bottom: 2px;

  height: 2px;

  border-radius: 10px;

  background: #9b5b28;

  transition:
    right 0.2s ease;
}

.nav-link:hover {
  color: #9b5b28;
}

.nav-link:hover::after {
  right: 0;
}

.nav-link.router-link-active {
  color: #9b5b28;
}

.nav-link.router-link-active::after {
  right: 0;
}


/* =========================================================
   HEADER ACTIONS
========================================================= */

.header-actions {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-shrink: 0;
}


/* =========================================================
   CART BUTTON
========================================================= */

.cart-button {
  position: relative;

  min-height: 42px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  padding:
    0 13px;

  border:
    1px solid #ded6cc;

  border-radius: 10px;

  background: white;

  color: #29251f;

  text-decoration: none;

  font-size: 0.8rem;

  font-weight: 800;

  transition:
    all 0.2s ease;
}

.cart-button:hover {
  border-color: #9b5b28;

  color: #9b5b28;

  transform:
    translateY(-1px);
}

.cart-icon {
  font-size: 1rem;
}

.cart-label {
  white-space: nowrap;
}


/* =========================================================
   CART COUNT
========================================================= */

.cart-count {
  min-width: 21px;
  height: 21px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding:
    0 5px;

  border-radius: 50%;

  background: #9b5b28;

  color: white;

  font-size: 0.65rem;

  font-weight: 900;
}


/* =========================================================
   MOBILE BUTTON
========================================================= */

.menu-button {
  display: none;

  width: 42px;
  height: 42px;

  padding: 10px;

  border:
    1px solid #ded6cc;

  border-radius: 10px;

  background: white;

  cursor: pointer;
}

.menu-button span {
  display: block;

  width: 100%;

  height: 2px;

  margin: 4px 0;

  border-radius: 5px;

  background: #29251f;

  transition:
    all 0.2s ease;
}

.menu-button.active
span:nth-child(1) {
  transform:
    translateY(6px)
    rotate(45deg);
}

.menu-button.active
span:nth-child(2) {
  opacity: 0;
}

.menu-button.active
span:nth-child(3) {
  transform:
    translateY(-6px)
    rotate(-45deg);
}


/* =========================================================
   MOBILE NAV
========================================================= */

.mobile-nav {
  display: none;
}


/* =========================================================
   TRANSITION
========================================================= */

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    all 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;

  transform:
    translateY(-10px);
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 850px) {

  .desktop-nav {
    gap: 17px;
  }

  .nav-link {
    font-size: 0.75rem;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .header-container {
    width:
      calc(100% - 28px);

    min-height: 68px;
  }


  .desktop-nav {
    display: none;
  }


  .cart-label {
    display: none;
  }


  .cart-button {
    width: 42px;

    padding: 0;
  }


  .menu-button {
    display: block;
  }


  .mobile-nav {
    display: flex;

    flex-direction: column;

    gap: 5px;

    padding:
      12px 14px 18px;

    border-top:
      1px solid #e7dfd6;

    background:
      rgba(
        250,
        248,
        244,
        0.98
      );
  }


  .mobile-nav-link {
    display: flex;

    align-items: center;

    gap: 12px;

    min-height: 48px;

    padding:
      0 13px;

    border-radius: 10px;

    color: #403a34;

    text-decoration: none;

    font-size: 0.85rem;

    font-weight: 800;
  }


  .mobile-nav-link:hover {
    background: #eee7de;

    color: #9b5b28;
  }


  .mobile-nav-link span:first-child {
    width: 25px;

    text-align: center;
  }


  .cart-mobile {
    margin-top: 5px;

    background: #29251f;

    color: white;
  }


  .cart-mobile:hover {
    background: #9b5b28;

    color: white;
  }


  .mobile-count {
    width: 22px !important;
    height: 22px;

    margin-left: auto;

    display: inline-flex;

    align-items: center;

    justify-content: center;

    border-radius: 50%;

    background: #9b5b28;

    color: white;

    font-size: 0.65rem;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 400px) {

  .brand-text {
    display: none;
  }

}
</style>