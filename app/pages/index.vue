<script setup>
import {
  computed,
  ref
} from 'vue'

import { products } from '~/data/products'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const searchText = ref('')

const selectedCategory = ref('ทั้งหมด')

const selectedSet = ref('ทั้งหมด')

const maxPrice = ref(5000)

const selectedDiscount = ref(false)


/*
|--------------------------------------------------------------------------
| SET
|--------------------------------------------------------------------------
|
| A = สินค้าทั้งหมด
| B = Strategy Games
| C = Discount Games
|
|--------------------------------------------------------------------------
*/

const allProductsSet = computed(() => {
  return new Set(
    products.map(product => product.id)
  )
})


const strategySet = computed(() => {
  return new Set(
    products
      .filter(product => {
        const categories =
          Array.isArray(
            product.categories
          )
            ? product.categories
            : [
                product.category
              ]

        return categories.includes(
          'Strategy'
        )
      })
      .map(product => product.id)
  )
})


const discountSet = computed(() => {
  return new Set(
    products
      .filter(product => {
        return Number(
          product.discount || 0
        ) > 0
      })
      .map(product => product.id)
  )
})


/*
|--------------------------------------------------------------------------
| SET OPERATIONS
|--------------------------------------------------------------------------
*/

const intersectionSet = (
  setA,
  setB
) => {
  return new Set(
    [...setA].filter(
      value => setB.has(value)
    )
  )
}


const unionSet = (
  setA,
  setB
) => {
  return new Set([
    ...setA,
    ...setB
  ])
}


const strategyAndDiscountSet =
  computed(() => {
    return intersectionSet(
      strategySet.value,
      discountSet.value
    )
  })


const strategyOrDiscountSet =
  computed(() => {
    return unionSet(
      strategySet.value,
      discountSet.value
    )
  })


/*
|--------------------------------------------------------------------------
| FUNCTION
|--------------------------------------------------------------------------
|
| f(price, discount)
|
|--------------------------------------------------------------------------
*/

const calculateFinalPrice = (
  price,
  discount = 0
) => {
  const safePrice =
    Number(price) || 0

  const safeDiscount =
    Number(discount) || 0

  return Math.round(
    safePrice *
      (
        1 -
        safeDiscount / 100
      )
  )
}


/*
|--------------------------------------------------------------------------
| LOGIC
|--------------------------------------------------------------------------
|
| Product จะผ่านเงื่อนไขเมื่อ
|
| Search
| AND
| Category
| AND
| Price
| AND
| Discount
|
|--------------------------------------------------------------------------
*/

const filteredProducts =
  computed(() => {

    return products.filter(
      product => {

        /*
        -----------------------------
        Search Logic
        -----------------------------
        */

        const keyword =
          searchText.value
            .trim()
            .toLowerCase()

        const productName =
          String(
            product.name || ''
          ).toLowerCase()

        const description =
          String(
            product.description || ''
          ).toLowerCase()

        const matchSearch =
          keyword === '' ||
          productName.includes(
            keyword
          ) ||
          description.includes(
            keyword
          )


        /*
        -----------------------------
        Category Logic
        -----------------------------
        */

        const categories =
          Array.isArray(
            product.categories
          )
            ? product.categories
            : [
                product.category
              ]

        const matchCategory =
          selectedCategory.value ===
            'ทั้งหมด' ||
          categories.includes(
            selectedCategory.value
          )


        /*
        -----------------------------
        Price Logic
        -----------------------------
        */

        const matchPrice =
          Number(
            product.price || 0
          ) <= maxPrice.value


        /*
        -----------------------------
        Discount Logic
        -----------------------------
        */

        const matchDiscount =
          !selectedDiscount.value ||
          Number(
            product.discount || 0
          ) > 0


        /*
        -----------------------------
        Set Logic
        -----------------------------
        */

        let matchSet = true

        if (
          selectedSet.value ===
          'Strategy'
        ) {
          matchSet =
            strategySet.value.has(
              product.id
            )
        }

        if (
          selectedSet.value ===
          'Discount'
        ) {
          matchSet =
            discountSet.value.has(
              product.id
            )
        }

        if (
          selectedSet.value ===
          'Strategy ∩ Discount'
        ) {
          matchSet =
            strategyAndDiscountSet
              .value
              .has(product.id)
        }

        if (
          selectedSet.value ===
          'Strategy ∪ Discount'
        ) {
          matchSet =
            strategyOrDiscountSet
              .value
              .has(product.id)
        }


        /*
        -----------------------------
        Boolean Logic
        -----------------------------
        */

        return (
          matchSearch &&
          matchCategory &&
          matchPrice &&
          matchDiscount &&
          matchSet
        )
      }
    )
  })


/*
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/

const categories = computed(() => {

  const categorySet =
    new Set()

  products.forEach(
    product => {

      const list =
        Array.isArray(
          product.categories
        )
          ? product.categories
          : [
              product.category
            ]

      list.forEach(
        category => {

          if (category) {
            categorySet.add(
              category
            )
          }

        }
      )
    }
  )

  return [
    'ทั้งหมด',
    ...categorySet
  ]
})


/*
|--------------------------------------------------------------------------
| CATEGORY COUNT
|--------------------------------------------------------------------------
*/

const categoryCount = (
  category
) => {

  if (
    category ===
    'ทั้งหมด'
  ) {
    return products.length
  }

  return products.filter(
    product => {

      const list =
        Array.isArray(
          product.categories
        )
          ? product.categories
          : [
              product.category
            ]

      return list.includes(
        category
      )
    }
  ).length
}


/*
|--------------------------------------------------------------------------
| PRICE DEMO
|--------------------------------------------------------------------------
*/

const demoPrice = ref(2000)

const demoDiscount = ref(20)

const demoFinalPrice =
  computed(() => {

    return calculateFinalPrice(
      demoPrice.value,
      demoDiscount.value
    )
  })


/*
|--------------------------------------------------------------------------
| RESET
|--------------------------------------------------------------------------
*/

const resetFilters = () => {

  searchText.value = ''

  selectedCategory.value =
    'ทั้งหมด'

  selectedSet.value =
    'ทั้งหมด'

  maxPrice.value = 5000

  selectedDiscount.value =
    false
}


/*
|--------------------------------------------------------------------------
| CART
|--------------------------------------------------------------------------
*/

const {
  addToCart
} = useCart()


const addedProduct =
  ref('')


const addProduct = product => {

  addToCart(
    product,
    1
  )

  addedProduct.value =
    product.name

  setTimeout(() => {
    addedProduct.value =
      ''
  }, 2000)
}


/*
|--------------------------------------------------------------------------
| HERO PRODUCTS
|--------------------------------------------------------------------------
*/

const featuredProducts =
  computed(() => {

    return products
      .slice(0, 4)
  })


/*
|--------------------------------------------------------------------------
| STATISTICS
|--------------------------------------------------------------------------
*/

const totalProducts =
  computed(() => {

    return allProductsSet
      .value.size
  })


const totalStrategy =
  computed(() => {

    return strategySet
      .value.size
  })


const totalDiscount =
  computed(() => {

    return discountSet
      .value.size
  })

</script>


<template>

  <div class="home-page">


    <!-- =====================================================
         HERO
    ====================================================== -->

    <section class="hero">

      <div class="container hero-grid">

        <div class="hero-content">

          <div class="eyebrow">
            BOARD GAME STORE
          </div>

          <h1>

            Play more.

            <br>

            <span>
              Think better.
            </span>

          </h1>

          <p>

            ร้านบอร์ดเกมออนไลน์
            สำหรับคนที่ชอบวางแผน
            แข่งขัน และสร้างช่วงเวลาดี ๆ
            บนโต๊ะเดียวกัน

          </p>


          <div class="hero-actions">

            <a
              href="#products"
              class="primary-button"
            >
              🎲 ดูบอร์ดเกม
            </a>

            <a
              href="#discrete"
              class="secondary-button"
            >
              ∑ Discrete Math
            </a>

          </div>


          <div class="hero-stats">

            <div>

              <strong>
                {{ totalProducts }}
              </strong>

              <span>
                Games
              </span>

            </div>

            <div>

              <strong>
                {{ totalStrategy }}
              </strong>

              <span>
                Strategy
              </span>

            </div>

            <div>

              <strong>
                {{ totalDiscount }}
              </strong>

              <span>
                Discount
              </span>

            </div>

          </div>

        </div>


        <!-- HERO VISUAL -->

        <div class="hero-visual">

          <div class="hero-card">

            <div class="dice">
              🎲
            </div>

            <div class="hero-card-title">
              BOARDGAME
            </div>

            <div class="hero-card-subtitle">
              TABLE
            </div>

            <div class="hero-card-line"></div>

            <div class="hero-card-text">
              Think.
              Plan.
              Play.
            </div>

          </div>

          <div class="floating-card card-one">
            ♟️
          </div>

          <div class="floating-card card-two">
            🃏
          </div>

          <div class="floating-card card-three">
            🎯
          </div>

        </div>

      </div>

    </section>


    <!-- =====================================================
         FEATURED
    ====================================================== -->

    <section class="featured-section">

      <div class="container">

        <div class="section-heading">

          <div>

            <span>
              FEATURED GAMES
            </span>

            <h2>
              เกมแนะนำ
            </h2>

          </div>

          <a
            href="#products"
            class="view-all"
          >
            ดูทั้งหมด →
          </a>

        </div>


        <div class="featured-grid">

          <NuxtLink
            v-for="product in featuredProducts"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="featured-card"
          >

            <div class="featured-image">

              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
              >

              <span v-else>
                🎲
              </span>

              <span
                v-if="product.discount > 0"
                class="featured-discount"
              >
                -{{ product.discount }}%
              </span>

            </div>


            <div class="featured-content">

              <span>
                {{
                  product.category ||
                  'BOARD GAME'
                }}
              </span>

              <h3>
                {{ product.name }}
              </h3>

              <strong>
                ฿{{
                  calculateFinalPrice(
                    product.price,
                    product.discount
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


    <!-- =====================================================
         PRODUCTS
    ====================================================== -->

    <section
      id="products"
      class="products-section"
    >

      <div class="container">

        <div class="section-heading">

          <div>

            <span>
              BOARDGAME COLLECTION
            </span>

            <h2>
              บอร์ดเกมทั้งหมด
            </h2>

          </div>

          <div class="result-count">

            พบ
            <strong>
              {{ filteredProducts.length }}
            </strong>
            รายการ

          </div>

        </div>


        <!-- FILTER -->

        <div class="filter-panel">


          <!-- SEARCH -->

          <div class="search-box">

            <span>
              🔎
            </span>

            <input
              v-model="searchText"
              type="text"
              placeholder="ค้นหาบอร์ดเกม..."
            >

          </div>


          <!-- CATEGORY -->

          <div class="filter-group">

            <label>
              หมวดหมู่
            </label>

            <select
              v-model="selectedCategory"
            >

              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
                ({{
                  categoryCount(
                    category
                  )
                }})
              </option>

            </select>

          </div>


          <!-- PRICE -->

          <div class="filter-group price-filter">

            <label>
              ราคาไม่เกิน
              ฿{{ maxPrice.toLocaleString('th-TH') }}
            </label>

            <input
              v-model.number="maxPrice"
              type="range"
              min="500"
              max="5000"
              step="100"
            >

          </div>


          <!-- DISCOUNT -->

          <label class="checkbox-filter">

            <input
              v-model="selectedDiscount"
              type="checkbox"
            >

            <span>
              เฉพาะสินค้าลดราคา
            </span>

          </label>


          <!-- RESET -->

          <button
            type="button"
            class="reset-button"
            @click="resetFilters"
          >
            รีเซ็ต
          </button>

        </div>


        <!-- SET FILTER -->

        <div class="set-filter">

          <span class="set-label">
            SET:
          </span>

          <button
            type="button"
            :class="{
              active:
                selectedSet ===
                'ทั้งหมด'
            }"
            @click="
              selectedSet =
                'ทั้งหมด'
            "
          >
            A
            ทั้งหมด
          </button>

          <button
            type="button"
            :class="{
              active:
                selectedSet ===
                'Strategy'
            }"
            @click="
              selectedSet =
                'Strategy'
            "
          >
            B
            Strategy
          </button>

          <button
            type="button"
            :class="{
              active:
                selectedSet ===
                'Discount'
            }"
            @click="
              selectedSet =
                'Discount'
            "
          >
            C
            Discount
          </button>

          <button
            type="button"
            :class="{
              active:
                selectedSet ===
                'Strategy ∩ Discount'
            }"
            @click="
              selectedSet =
                'Strategy ∩ Discount'
            "
          >
            B ∩ C
          </button>

          <button
            type="button"
            :class="{
              active:
                selectedSet ===
                'Strategy ∪ Discount'
            }"
            @click="
              selectedSet =
                'Strategy ∪ Discount'
            "
          >
            B ∪ C
          </button>

        </div>


        <!-- PRODUCT GRID -->

        <div
          v-if="
            filteredProducts.length
          "
          class="product-grid"
        >

          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >

            <NuxtLink
              :to="`/products/${product.id}`"
              class="product-image"
            >

              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
              >

              <span v-else>
                🎲
              </span>


              <span
                v-if="product.discount > 0"
                class="discount-badge"
              >
                -{{ product.discount }}%
              </span>

            </NuxtLink>


            <div class="product-content">

              <span class="product-category">

                {{
                  product.category ||
                  'BOARD GAME'
                }}

              </span>


              <NuxtLink
                :to="`/products/${product.id}`"
              >

                <h3>
                  {{ product.name }}
                </h3>

              </NuxtLink>


              <p>
                {{
                  product.description ||
                  'Board game สำหรับทุกโต๊ะ'
                }}
              </p>


              <div class="product-footer">

                <div class="price">

                  <strong>
                    ฿{{
                      calculateFinalPrice(
                        product.price,
                        product.discount
                      ).toLocaleString(
                        'th-TH'
                      )
                    }}
                  </strong>

                  <span
                    v-if="product.discount > 0"
                  >
                    ฿{{
                      Number(
                        product.price
                      ).toLocaleString(
                        'th-TH'
                      )
                    }}
                  </span>

                </div>


                <button
                  type="button"
                  class="add-button"
                  @click="
                    addProduct(product)
                  "
                >
                  +
                </button>

              </div>

            </div>

          </article>

        </div>


        <!-- NO RESULT -->

        <div
          v-else
          class="no-result"
        >

          <div>
            🔎
          </div>

          <h3>
            ไม่พบสินค้าที่ตรงเงื่อนไข
          </h3>

          <p>
            ลองเปลี่ยนหมวดหมู่
            ราคา หรือคำค้นหา
          </p>

          <button
            type="button"
            @click="resetFilters"
          >
            แสดงสินค้าทั้งหมด
          </button>

        </div>

      </div>

    </section>


    <!-- =====================================================
         DISCRETE MATHEMATICS
    ====================================================== -->

    <section
      id="discrete"
      class="discrete-section"
    >

      <div class="container">


        <div class="discrete-heading">

          <span>
            DISCRETE MATHEMATICS
          </span>

          <h2>
            คณิตศาสตร์ดิสครีต
            ในร้านบอร์ดเกม
          </h2>

          <p>
            ระบบนี้นำแนวคิดทางคณิตศาสตร์ดิสครีต
            มาประยุกต์กับการค้นหา
            การคัดกรอง และการคำนวณราคาสินค้า
          </p>

        </div>


        <!-- =================================================
             SET
        ================================================== -->

        <div class="math-card">

          <div class="math-number">
            01
          </div>

          <div class="math-content">

            <span>
              SET THEORY
            </span>

            <h3>
              Set — เซตของสินค้า
            </h3>

            <p>
              กำหนดให้ A เป็นเซตของสินค้าทั้งหมด
              B เป็นเซตของ Strategy Games
              และ C เป็นเซตของสินค้าที่ลดราคา
            </p>


            <div class="set-equation">

              <div>
                A =
                <strong>
                  {{ totalProducts }}
                </strong>
                products
              </div>

              <div>
                B =
                <strong>
                  {{ strategySet.size }}
                </strong>
                Strategy
              </div>

              <div>
                C =
                <strong>
                  {{ discountSet.size }}
                </strong>
                Discount
              </div>

            </div>


            <div class="set-results">

              <button
                type="button"
                @click="
                  selectedSet =
                    'Strategy ∩ Discount'
                "
              >

                B ∩ C

                <strong>
                  {{
                    strategyAndDiscountSet
                      .size
                  }}
                </strong>

                <small>
                  Strategy AND Discount
                </small>

              </button>


              <button
                type="button"
                @click="
                  selectedSet =
                    'Strategy ∪ Discount'
                "
              >

                B ∪ C

                <strong>
                  {{
                    strategyOrDiscountSet
                      .size
                  }}
                </strong>

                <small>
                  Strategy OR Discount
                </small>

              </button>

            </div>

          </div>

        </div>


        <!-- =================================================
             LOGIC
        ================================================== -->

        <div class="math-card">

          <div class="math-number">
            02
          </div>

          <div class="math-content">

            <span>
              PROPOSITIONAL LOGIC
            </span>

            <h3>
              Logic — เงื่อนไขการแสดงสินค้า
            </h3>

            <p>
              สินค้าจะถูกแสดงเมื่อเงื่อนไขทั้งหมด
              เป็นจริง
            </p>


            <div class="logic-box">

              <div class="logic-line">

                <span>
                  Search
                </span>

                <strong>
                  AND
                </strong>

                <span>
                  Category
                </span>

                <strong>
                  AND
                </strong>

                <span>
                  Price
                </span>

                <strong>
                  AND
                </strong>

                <span>
                  Discount
                </span>

              </div>


              <div class="logic-result">

                <span>
                  ผลลัพธ์
                </span>

                <strong>
                  {{ filteredProducts.length }}
                </strong>

                <span>
                  รายการ
                </span>

              </div>

            </div>


            <div class="truth-table">

              <div class="truth-row header">

                <span>
                  Search
                </span>

                <span>
                  Category
                </span>

                <span>
                  Price
                </span>

                <span>
                  Discount
                </span>

                <span>
                  Result
                </span>

              </div>


              <div class="truth-row">

                <span>
                  TRUE
                </span>

                <span>
                  TRUE
                </span>

                <span>
                  TRUE
                </span>

                <span>
                  TRUE
                </span>

                <strong>
                  TRUE
                </strong>

              </div>

            </div>

          </div>

        </div>


        <!-- =================================================
             FUNCTION
        ================================================== -->

        <div class="math-card">

          <div class="math-number">
            03
          </div>

          <div class="math-content">

            <span>
              FUNCTION
            </span>

            <h3>
              Function — ฟังก์ชันราคาสินค้า
            </h3>

            <p>
              ใช้ฟังก์ชัน
              f(price, discount)
              เพื่อหาค่าราคาสุทธิ
            </p>


            <div class="function-demo">

              <div class="function-input">

                <label>
                  Price
                </label>

                <input
                  v-model.number="
                    demoPrice
                  "
                  type="number"
                  min="0"
                >

              </div>


              <div class="function-symbol">
                ×
              </div>


              <div class="function-input">

                <label>
                  Discount %
                </label>

                <input
                  v-model.number="
                    demoDiscount
                  "
                  type="number"
                  min="0"
                  max="100"
                >

              </div>


              <div class="function-symbol">
                =
              </div>


              <div class="function-result">

                <span>
                  f(price, discount)
                </span>

                <strong>
                  ฿{{
                    demoFinalPrice
                      .toLocaleString(
                        'th-TH'
                      )
                  }}
                </strong>

              </div>

            </div>


            <div class="formula">

              f(p, d) =
              p × (1 − d / 100)

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- =====================================================
         CTA
    ====================================================== -->

    <section class="cta-section">

      <div class="container">

        <div>

          <span>
            READY TO PLAY?
          </span>

          <h2>
            เลือกเกม
            แล้วเริ่มเกมบนโต๊ะของคุณ
          </h2>

        </div>

        <a
          href="#products"
          class="cta-button"
        >
          เลือกบอร์ดเกม →
        </a>

      </div>

    </section>


    <!-- =====================================================
         TOAST
    ====================================================== -->

    <Transition name="toast">

      <div
        v-if="addedProduct"
        class="toast"
      >
        ✓ เพิ่ม
        "{{ addedProduct }}"
        ลงตะกร้าแล้ว
      </div>

    </Transition>

  </div>

</template>


<style scoped>
/* =========================================================
   BASE
========================================================= */

.home-page {
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

.hero {
  min-height:
    calc(100vh - 76px);

  display: flex;

  align-items: center;

  padding:
    70px 0;

  background:
    radial-gradient(
      circle at 85% 20%,
      #eee1d1,
      transparent 30%
    ),
    #faf8f4;
}

.hero-grid {
  display: grid;

  grid-template-columns:
    1fr 0.8fr;

  gap: 80px;

  align-items: center;
}

.eyebrow {
  color: #9b5b28;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.18em;
}

.hero h1 {
  margin:
    15px 0 25px;

  font-size:
    clamp(
      4rem,
      8vw,
      7rem
    );

  line-height: 0.88;

  letter-spacing: -0.07em;
}

.hero h1 span {
  color: #9b5b28;
}

.hero-content > p {
  max-width: 580px;

  color: #716a62;

  font-size: 1rem;

  line-height: 1.9;
}

.hero-actions {
  display: flex;

  gap: 12px;

  margin-top: 30px;
}

.primary-button,
.secondary-button {
  min-height: 50px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding:
    0 20px;

  border-radius: 10px;

  text-decoration: none;

  font-size: 0.85rem;

  font-weight: 900;
}

.primary-button {
  background: #29251f;

  color: white;
}

.secondary-button {
  border:
    1px solid #d8cfc4;

  background: white;

  color: #514a43;
}

.hero-stats {
  display: flex;

  gap: 40px;

  margin-top: 55px;
}

.hero-stats div {
  display: flex;

  flex-direction: column;
}

.hero-stats strong {
  font-size: 1.7rem;
}

.hero-stats span {
  margin-top: 3px;

  color: #918981;

  font-size: 0.7rem;

  text-transform: uppercase;

  letter-spacing: 0.1em;
}


/* HERO VISUAL */

.hero-visual {
  position: relative;

  min-height: 500px;

  display: grid;

  place-items: center;
}

.hero-card {
  width: 320px;
  height: 420px;

  padding: 45px 30px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  border-radius: 28px;

  background:
    linear-gradient(
      145deg,
      #302b25,
      #51463a
    );

  color: white;

  box-shadow:
    30px 30px 70px
    rgba(41,37,31,0.22);

  transform:
    rotate(5deg);
}

.dice {
  margin-bottom: 25px;

  font-size: 5rem;
}

.hero-card-title {
  font-size: 1.8rem;

  font-weight: 900;

  letter-spacing: 0.12em;
}

.hero-card-subtitle {
  margin-top: 5px;

  color: #d7a76e;

  font-size: 0.9rem;

  font-weight: 900;

  letter-spacing: 0.4em;
}

.hero-card-line {
  width: 80px;

  height: 2px;

  margin: 30px 0;

  background: #d7a76e;
}

.hero-card-text {
  font-size: 0.75rem;

  letter-spacing: 0.3em;

  text-transform: uppercase;
}

.floating-card {
  position: absolute;

  width: 70px;
  height: 70px;

  display: grid;

  place-items: center;

  border-radius: 18px;

  background: white;

  font-size: 2rem;

  box-shadow:
    0 15px 35px
    rgba(41,37,31,0.14);
}

.card-one {
  top: 60px;

  left: 20px;

  transform:
    rotate(-12deg);
}

.card-two {
  right: 20px;

  top: 150px;

  transform:
    rotate(10deg);
}

.card-three {
  left: 80px;

  bottom: 30px;

  transform:
    rotate(-8deg);
}


/* =========================================================
   SECTION
========================================================= */

.featured-section,
.products-section {
  padding:
    90px 0;
}

.section-heading {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 35px;
}

.section-heading span {
  color: #9b5b28;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.15em;
}

.section-heading h2 {
  margin:
    8px 0 0;

  font-size: 2.3rem;

  letter-spacing: -0.04em;
}

.view-all {
  color: #9b5b28;

  font-size: 0.8rem;

  font-weight: 900;
}

.result-count {
  color: #8c847c;

  font-size: 0.8rem;
}

.result-count strong {
  color: #29251f;
}


/* =========================================================
   FEATURED
========================================================= */

.featured-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 18px;
}

.featured-card {
  overflow: hidden;

  border:
    1px solid #e5ddd3;

  border-radius: 16px;

  background: white;

  color: #29251f;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.featured-card:hover {
  transform:
    translateY(-5px);

  box-shadow:
    0 15px 35px
    rgba(41,37,31,0.08);
}

.featured-image {
  position: relative;

  aspect-ratio: 1;

  display: grid;

  place-items: center;

  overflow: hidden;

  background: #e9e2d9;
}

.featured-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.featured-image > span:not(.featured-discount) {
  font-size: 4rem;
}

.featured-discount {
  position: absolute;

  top: 12px;
  left: 12px;

  padding:
    6px 9px;

  border-radius: 7px;

  background: #c84e4e;

  color: white;

  font-size: 0.65rem;

  font-weight: 900;
}

.featured-content {
  padding: 17px;
}

.featured-content > span {
  color: #9b5b28;

  font-size: 0.6rem;

  font-weight: 900;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.featured-content h3 {
  margin:
    7px 0 10px;

  font-size: 1rem;
}

.featured-content strong {
  color: #9b5b28;
}


/* =========================================================
   FILTER
========================================================= */

.products-section {
  background: #f0ebe4;
}

.filter-panel {
  display: grid;

  grid-template-columns:
    1.5fr
    1fr
    1.2fr
    auto
    auto;

  gap: 12px;

  padding: 18px;

  border:
    1px solid #ded5ca;

  border-radius: 15px;

  background: white;
}

.search-box {
  display: flex;

  align-items: center;

  gap: 8px;

  padding:
    0 12px;

  border:
    1px solid #ddd5cb;

  border-radius: 9px;
}

.search-box input {
  width: 100%;

  height: 42px;

  border: 0;

  outline: 0;

  background: transparent;
}

.filter-group {
  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: 5px;
}

.filter-group label {
  color: #8a8279;

  font-size: 0.65rem;

  font-weight: 800;
}

.filter-group select {
  height: 42px;

  padding:
    0 10px;

  border:
    1px solid #ddd5cb;

  border-radius: 9px;

  background: white;

  outline: 0;
}

.price-filter input {
  accent-color: #9b5b28;
}

.checkbox-filter {
  display: flex;

  align-items: center;

  gap: 7px;

  padding:
    0 5px;

  white-space: nowrap;

  font-size: 0.72rem;

  font-weight: 800;
}

.checkbox-filter input {
  accent-color: #9b5b28;
}

.reset-button {
  padding:
    0 13px;

  border: 0;

  border-radius: 9px;

  background: #eee8df;

  color: #6f665d;

  cursor: pointer;

  font-size: 0.72rem;

  font-weight: 800;
}


/* =========================================================
   SET FILTER
========================================================= */

.set-filter {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 8px;

  margin:
    20px 0 25px;
}

.set-label {
  color: #897f75;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.1em;
}

.set-filter button {
  min-height: 32px;

  padding:
    0 11px;

  border:
    1px solid #d7cec3;

  border-radius: 7px;

  background: transparent;

  color: #625a52;

  cursor: pointer;

  font-size: 0.7rem;

  font-weight: 800;
}

.set-filter button:hover,
.set-filter button.active {
  border-color: #29251f;

  background: #29251f;

  color: white;
}


/* =========================================================
   PRODUCT GRID
========================================================= */

.product-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 18px;
}

.product-card {
  overflow: hidden;

  border:
    1px solid #e2d9cf;

  border-radius: 16px;

  background: white;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform:
    translateY(-4px);

  box-shadow:
    0 15px 35px
    rgba(41,37,31,0.08);
}

.product-image {
  position: relative;

  display: grid;

  place-items: center;

  aspect-ratio: 1;

  overflow: hidden;

  background: #e9e2d9;
}

.product-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.product-image > span:not(.discount-badge) {
  font-size: 4rem;
}

.discount-badge {
  position: absolute;

  top: 12px;
  left: 12px;

  padding:
    6px 9px;

  border-radius: 7px;

  background: #c84e4e;

  color: white;

  font-size: 0.65rem;

  font-weight: 900;
}

.product-content {
  padding: 17px;
}

.product-category {
  color: #9b5b28;

  font-size: 0.6rem;

  font-weight: 900;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.product-content h3 {
  margin:
    7px 0;

  color: #29251f;

  font-size: 1rem;
}

.product-content > a {
  text-decoration: none;
}

.product-content p {
  min-height: 40px;

  margin: 0;

  color: #898179;

  font-size: 0.72rem;

  line-height: 1.5;
}

.product-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-top: 18px;
}

.price {
  display: flex;

  flex-direction: column;
}

.price strong {
  color: #9b5b28;

  font-size: 1rem;
}

.price span {
  color: #aaa29a;

  font-size: 0.7rem;

  text-decoration: line-through;
}

.add-button {
  width: 38px;
  height: 38px;

  border: 0;

  border-radius: 9px;

  background: #29251f;

  color: white;

  font-size: 1.3rem;

  cursor: pointer;
}

.add-button:hover {
  background: #9b5b28;
}


/* =========================================================
   NO RESULT
========================================================= */

.no-result {
  padding:
    80px 20px;

  text-align: center;
}

.no-result > div {
  font-size: 3rem;
}

.no-result h3 {
  margin:
    15px 0 7px;
}

.no-result p {
  margin:
    0 0 20px;

  color: #817970;
}

.no-result button {
  min-height: 42px;

  padding:
    0 17px;

  border: 0;

  border-radius: 8px;

  background: #29251f;

  color: white;

  cursor: pointer;

  font-weight: 800;
}


/* =========================================================
   DISCRETE
========================================================= */

.discrete-section {
  padding:
    100px 0;

  background: #29251f;

  color: white;
}

.discrete-heading {
  max-width: 700px;

  margin-bottom: 45px;
}

.discrete-heading > span {
  color: #d8a76f;

  font-size: 0.7rem;

  font-weight: 900;

  letter-spacing: 0.16em;
}

.discrete-heading h2 {
  margin:
    10px 0 15px;

  font-size:
    clamp(
      2.2rem,
      5vw,
      4rem
    );

  line-height: 1;

  letter-spacing: -0.05em;
}

.discrete-heading p {
  color: #a9a198;

  line-height: 1.8;
}


/* MATH CARD */

.math-card {
  display: grid;

  grid-template-columns:
    80px
    1fr;

  gap: 30px;

  margin-top: 18px;

  padding: 30px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.1
    );

  border-radius: 18px;

  background:
    rgba(
      255,
      255,
      255,
      0.045
    );
}

.math-number {
  color: #d8a76f;

  font-size: 0.8rem;

  font-weight: 900;
}

.math-content > span {
  color: #d8a76f;

  font-size: 0.65rem;

  font-weight: 900;

  letter-spacing: 0.15em;
}

.math-content h3 {
  margin:
    8px 0 12px;

  font-size: 1.7rem;
}

.math-content > p {
  max-width: 750px;

  color: #aaa29a;

  line-height: 1.8;
}


/* SET */

.set-equation {
  display: flex;

  flex-wrap: wrap;

  gap: 12px;

  margin-top: 25px;
}

.set-equation div {
  padding:
    12px 15px;

  border-radius: 9px;

  background:
    rgba(
      255,
      255,
      255,
      0.07
    );

  color: #aaa29a;

  font-family:
    monospace;

  font-size: 0.8rem;
}

.set-equation strong {
  color: white;

  font-size: 1rem;
}

.set-results {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 12px;

  margin-top: 15px;
}

.set-results button {
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 4px;

  padding: 18px;

  border:
    1px solid
    rgba(
      216,
      167,
      111,
      0.25
    );

  border-radius: 10px;

  background:
    rgba(
      216,
      167,
      111,
      0.08
    );

  color: white;

  text-align: left;

  cursor: pointer;
}

.set-results button:hover {
  background:
    rgba(
      216,
      167,
      111,
      0.15
    );
}

.set-results strong {
  color: #d8a76f;

  font-size: 1.5rem;
}

.set-results small {
  color: #aaa29a;
}


/* LOGIC */

.logic-box {
  margin-top: 25px;

  padding: 20px;

  border-radius: 12px;

  background:
    rgba(
      0,
      0,
      0,
      0.18
    );
}

.logic-line {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 9px;

  font-family:
    monospace;
}

.logic-line span {
  padding:
    7px 10px;

  border-radius: 6px;

  background:
    rgba(
      255,
      255,
      255,
      0.08
    );

  color: #ddd5cc;

  font-size: 0.75rem;
}

.logic-line strong {
  color: #d8a76f;

  font-size: 0.7rem;
}

.logic-result {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 18px;

  padding-top: 18px;

  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      0.1
    );

  color: #aaa29a;

  font-size: 0.8rem;
}

.logic-result strong {
  color: #d8a76f;

  font-size: 1.4rem;
}


/* TRUTH TABLE */

.truth-table {
  margin-top: 15px;

  overflow: auto;
}

.truth-row {
  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  min-width: 550px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      0.08
    );
}

.truth-row span,
.truth-row strong {
  padding:
    10px;

  color: #aaa29a;

  font-size: 0.7rem;

  text-align: center;
}

.truth-row.header span {
  color: #d8a76f;

  font-weight: 900;
}

.truth-row strong {
  color: #70b783;
}


/* FUNCTION */

.function-demo {
  display: grid;

  grid-template-columns:
    1fr
    auto
    1fr
    auto
    1.3fr;

  gap: 12px;

  align-items: end;

  margin-top: 25px;
}

.function-input label {
  display: block;

  margin-bottom: 6px;

  color: #aaa29a;

  font-size: 0.7rem;
}

.function-input input {
  width: 100%;

  height: 45px;

  padding:
    0 10px;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.15
    );

  border-radius: 8px;

  outline: 0;

  background:
    rgba(
      255,
      255,
      255,
      0.07
    );

  color: white;
}

.function-symbol {
  padding-bottom: 13px;

  color: #d8a76f;

  font-size: 1.2rem;

  font-weight: 900;
}

.function-result {
  display: flex;

  flex-direction: column;

  justify-content: center;

  min-height: 45px;

  padding:
    5px 12px;

  border-radius: 8px;

  background:
    rgba(
      216,
      167,
      111,
      0.12
    );
}

.function-result span {
  color: #aaa29a;

  font-family:
    monospace;

  font-size: 0.6rem;
}

.function-result strong {
  color: #d8a76f;

  font-size: 1.1rem;
}

.formula {
  margin-top: 18px;

  padding:
    14px;

  border-radius: 8px;

  background:
    rgba(
      255,
      255,
      255,
      0.05
    );

  color: #ddd5cc;

  font-family:
    monospace;

  font-size: 0.85rem;

  text-align: center;
}


/* =========================================================
   CTA
========================================================= */

.cta-section {
  padding:
    65px 0;

  background: #e9dfd2;
}

.cta-section .container {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;
}

.cta-section span {
  color: #9b5b28;

  font-size: 0.65rem;

  font-weight: 900;

  letter-spacing: 0.15em;
}

.cta-section h2 {
  max-width: 600px;

  margin:
    8px 0 0;

  font-size: 2.4rem;

  line-height: 1;

  letter-spacing: -0.04em;
}

.cta-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-height: 50px;

  padding:
    0 22px;

  border-radius: 10px;

  background: #29251f;

  color: white;

  text-decoration: none;

  font-size: 0.8rem;

  font-weight: 900;

  white-space: nowrap;
}


/* =========================================================
   TOAST
========================================================= */

.toast {
  position: fixed;

  right: 25px;
  bottom: 25px;

  z-index: 300;

  padding:
    14px 20px;

  border-radius: 11px;

  background: #29251f;

  color: white;

  box-shadow:
    0 15px 40px
    rgba(
      0,
      0,
      0,
      0.2
    );

  font-size: 0.8rem;

  font-weight: 800;
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

@media (max-width: 1000px) {

  .hero-grid {
    gap: 40px;
  }

  .featured-grid,
  .product-grid {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .filter-panel {
    grid-template-columns:
      1fr 1fr;
  }

  .checkbox-filter {
    min-height: 42px;
  }

}


@media (max-width: 800px) {

  .hero {
    padding:
      60px 0;
  }

  .hero-grid {
    grid-template-columns:
      1fr;
  }

  .hero-visual {
    min-height: 430px;
  }

  .hero-content {
    text-align: center;
  }

  .hero-content > p {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions,
  .hero-stats {
    justify-content: center;
  }

  .featured-grid,
  .product-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .math-card {
    grid-template-columns:
      1fr;
  }

  .function-demo {
    grid-template-columns:
      1fr;
  }

  .function-symbol {
    display: none;
  }

  .cta-section .container {
    flex-direction: column;

    align-items: flex-start;
  }

}


@media (max-width: 600px) {

  .container {
    width:
      calc(100% - 28px);
  }

  .hero h1 {
    font-size: 4rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-stats {
    gap: 25px;
  }

  .hero-visual {
    min-height: 380px;
  }

  .hero-card {
    width: 260px;
    height: 350px;
  }

  .floating-card {
    width: 55px;
    height: 55px;
  }

  .featured-section,
  .products-section {
    padding:
      65px 0;
  }

  .section-heading {
    align-items: flex-start;

    flex-direction: column;
  }

  .filter-panel {
    grid-template-columns: 1fr;
  }

  .featured-grid,
  .product-grid {
    gap: 12px;
  }

  .math-card {
    padding: 20px;
  }

  .set-results {
    grid-template-columns: 1fr;
  }

  .logic-line {
    align-items: flex-start;

    flex-direction: column;
  }

  .cta-section h2 {
    font-size: 2rem;
  }

}


@media (max-width: 420px) {

  .featured-grid,
  .product-grid {
    grid-template-columns:
      1fr;
  }

  .hero h1 {
    font-size: 3.4rem;
  }

}
</style>