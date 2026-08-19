<script setup>

const {
  cartItemCount
} = useCart()

const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}

</script>


<template>

  <header class="navbar">

    <div class="navbar-container">

      <!-- LOGO -->

      <NuxtLink
        to="/"
        class="brand"
        @click="closeMenu"
      >

        <div class="brand-mark">
          🎲
        </div>

        <div class="brand-text">

          <strong>
            Boardgame
          </strong>

          <span>
            table
          </span>

        </div>

      </NuxtLink>


      <!-- DESKTOP NAV -->

      <nav class="desktop-nav">

        <NuxtLink
          to="/"
          class="nav-link"
        >
          หน้าแรก
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="nav-link"
        >
          บอร์ดเกม
        </NuxtLink>

        <a
          href="/Boardgame-table/#discrete"
          class="nav-link"
        >
          Discrete Math
        </a>

      </nav>


      <!-- ACTIONS -->

      <div class="navbar-actions">

        <NuxtLink
          to="/cart"
          class="cart-button"
          aria-label="ตะกร้าสินค้า"
        >

          <span class="cart-icon">
            🛒
          </span>

          <span class="cart-text">
            Cart
          </span>

          <span
            v-if="cartItemCount > 0"
            class="cart-count"
          >
            {{ cartItemCount }}
          </span>

        </NuxtLink>


        <!-- MOBILE BUTTON -->

        <button
          type="button"
          class="menu-button"
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


    <!-- MOBILE MENU -->

    <Transition name="menu">

      <div
        v-if="isMenuOpen"
        class="mobile-menu"
      >

        <NuxtLink
          to="/"
          class="mobile-link"
          @click="closeMenu"
        >
          หน้าแรก
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="mobile-link"
          @click="closeMenu"
        >
          บอร์ดเกม
        </NuxtLink>

        <a
          href="/Boardgame-table/#discrete"
          class="mobile-link"
          @click="closeMenu"
        >
          Discrete Math
        </a>

        <NuxtLink
          to="/cart"
          class="mobile-cart"
          @click="closeMenu"
        >

          🛒

          ตะกร้าสินค้า

          <strong>
            {{ cartItemCount }}
          </strong>

        </NuxtLink>

      </div>

    </Transition>

  </header>

</template>


<style scoped>

.navbar {
  position: sticky;

  top: 0;

  z-index: 1000;

  border-bottom:
    1px solid #e5ddd3;

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


.navbar-container {
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
  display: flex;

  align-items: center;

  gap: 10px;

  color: #29251f;

  text-decoration: none;

  flex-shrink: 0;
}

.brand-mark {
  width: 42px;
  height: 42px;

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
  font-size: 0.95rem;

  letter-spacing: -0.03em;
}

.brand-text span {
  margin-top: 4px;

  color: #9b5b28;

  font-size: 0.65rem;

  font-weight: 800;

  letter-spacing: 0.16em;

  text-transform: uppercase;
}


/* =========================================================
   DESKTOP NAV
========================================================= */

.desktop-nav {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-left: auto;
}

.nav-link {
  position: relative;

  padding:
    9px 13px;

  border-radius: 7px;

  color: #716a62;

  text-decoration: none;

  font-size: 0.75rem;

  font-weight: 800;

  transition:
    0.2s ease;
}

.nav-link:hover {
  background: #eee8df;

  color: #29251f;
}

.nav-link.router-link-active {
  color: #9b5b28;
}


/* =========================================================
   ACTIONS
========================================================= */

.navbar-actions {
  display: flex;

  align-items: center;

  gap: 10px;
}

.cart-button {
  position: relative;

  min-height: 42px;

  display: flex;

  align-items: center;

  gap: 7px;

  padding:
    0 13px;

  border:
    1px solid #ddd5cb;

  border-radius: 9px;

  background: white;

  color: #29251f;

  text-decoration: none;

  transition:
    0.2s ease;
}

.cart-button:hover {
  border-color: #9b5b28;

  transform:
    translateY(-1px);
}

.cart-icon {
  font-size: 1rem;
}

.cart-text {
  font-size: 0.7rem;

  font-weight: 900;
}

.cart-count {
  min-width: 20px;
  height: 20px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #9b5b28;

  color: white;

  font-size: 0.6rem;

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
    1px solid #ddd5cb;

  border-radius: 9px;

  background: white;

  cursor: pointer;
}

.menu-button span {
  display: block;

  height: 2px;

  margin: 4px 0;

  border-radius: 10px;

  background: #29251f;
}


/* =========================================================
   MOBILE MENU
========================================================= */

.mobile-menu {
  display: none;

  width: min(
    1180px,
    calc(100% - 40px)
  );

  margin: 0 auto;

  padding:
    10px 0 20px;
}

.mobile-link,
.mobile-cart {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    14px 10px;

  border-bottom:
    1px solid #eee8df;

  color: #29251f;

  text-decoration: none;

  font-size: 0.8rem;

  font-weight: 800;
}

.mobile-cart {
  margin-top: 8px;

  border:
    1px solid #ddd5cb;

  border-radius: 8px;

  background: white;
}

.mobile-cart strong {
  min-width: 24px;
  height: 24px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #9b5b28;

  color: white;

  font-size: 0.65rem;
}


/* =========================================================
   TRANSITION
========================================================= */

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;

  transform:
    translateY(-8px);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 760px) {

  .navbar-container {
    min-height: 68px;

    width:
      calc(100% - 28px);
  }

  .desktop-nav {
    display: none;
  }

  .menu-button {
    display: block;
  }

  .mobile-menu {
    display: block;

    width:
      calc(100% - 28px);
  }

  .cart-text {
    display: none;
  }

}

</style>