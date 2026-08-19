<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'add-to-cart'
])

/*
|--------------------------------------------------------------------------
| Product price logic
|--------------------------------------------------------------------------
| คำนวณราคาสุทธิจากราคาเต็มและส่วนลด
*/

const originalPrice = computed(() => {
  return Number(props.product.price) || 0
})

const discount = computed(() => {
  return Number(props.product.discount) || 0
})

const finalPrice = computed(() => {
  const price = originalPrice.value
  const discountPercent = discount.value

  return Math.round(
    price * (1 - discountPercent / 100)
  )
})

const discountAmount = computed(() => {
  return Math.max(
    0,
    originalPrice.value - finalPrice.value
  )
})

const hasDiscount = computed(() => {
  return discount.value > 0
})

const isOutOfStock = computed(() => {
  return Number(props.product.stock) <= 0
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(price)
}

const addToCart = () => {
  if (isOutOfStock.value) {
    return
  }

  emit('add-to-cart', props.product)
}
</script>

<template>
  <article class="product-card">

    <!-- Product image -->
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

      <!-- Discount -->
      <span
        v-if="hasDiscount"
        class="discount-badge"
      >
        -{{ discount }}%
      </span>

    </div>

    <!-- Product information -->
    <div class="product-content">

      <div class="product-category">
        {{ product.category || 'Board Game' }}
      </div>

      <h3 class="product-name">
        {{ product.name }}
      </h3>

      <p
        v-if="product.description"
        class="product-description"
      >
        {{ product.description }}
      </p>

      <!-- Price -->
      <div class="price-area">

        <span
          v-if="hasDiscount"
          class="original-price"
        >
          {{ formatPrice(originalPrice) }}
        </span>

        <span class="final-price">
          {{ formatPrice(finalPrice) }}
        </span>

      </div>

      <!-- Discount information -->
      <div
        v-if="hasDiscount"
        class="discount-info"
      >
        ประหยัด
        {{ formatPrice(discountAmount) }}
      </div>

      <!-- Stock -->
      <div class="stock-info">

        <span
          v-if="isOutOfStock"
          class="out-of-stock"
        >
          สินค้าหมด
        </span>

        <span
          v-else
          class="in-stock"
        >
          เหลือ {{ product.stock }} ชิ้น
        </span>

      </div>

      <!-- Add to cart -->
      <button
        class="add-cart-button"
        :disabled="isOutOfStock"
        @click="addToCart"
      >
        <span v-if="!isOutOfStock">
          🛒 เพิ่มลงตะกร้า
        </span>

        <span v-else>
          สินค้าหมด
        </span>
      </button>

    </div>

  </article>
</template>

<style scoped>
.product-card {
  position: relative;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  height: 100%;

  background: white;

  border: 1px solid #e8e0d5;

  border-radius: 18px;

  box-shadow:
    0 8px 24px
    rgba(50, 40, 30, 0.07);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);

  box-shadow:
    0 14px 32px
    rgba(50, 40, 30, 0.12);
}

.product-image {
  position: relative;

  width: 100%;
  aspect-ratio: 1 / 1;

  overflow: hidden;

  background: #f3eee7;
}

.product-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  transition:
    transform 0.3s ease;
}

.product-card:hover
.product-image img {
  transform: scale(1.04);
}

.image-placeholder {
  width: 100%;
  height: 100%;

  display: grid;
  place-items: center;

  font-size: 4rem;
}

.discount-badge {
  position: absolute;

  top: 12px;
  left: 12px;

  padding: 6px 10px;

  background: #c94b4b;

  color: white;

  border-radius: 999px;

  font-size: 0.8rem;
  font-weight: 800;
}

.product-content {
  display: flex;
  flex-direction: column;

  flex: 1;

  padding: 18px;
}

.product-category {
  margin-bottom: 6px;

  color: #a17b45;

  font-size: 0.75rem;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.08em;
}

.product-name {
  margin: 0;

  color: #29251f;

  font-size: 1.15rem;

  line-height: 1.4;
}

.product-description {
  margin: 8px 0 0;

  color: #766f66;

  font-size: 0.85rem;

  line-height: 1.5;

  display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
line-clamp: 2;

  overflow: hidden;
}

.price-area {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 16px;
}

.original-price {
  color: #999;

  font-size: 0.85rem;

  text-decoration: line-through;
}

.final-price {
  color: #9b5b28;

  font-size: 1.25rem;
  font-weight: 900;
}

.discount-info {
  margin-top: 4px;

  color: #2f7d4a;

  font-size: 0.75rem;
  font-weight: 700;
}

.stock-info {
  margin-top: 12px;

  font-size: 0.8rem;
}

.in-stock {
  color: #4d805d;
}

.out-of-stock {
  color: #c94b4b;

  font-weight: 700;
}

.add-cart-button {
  width: 100%;

  margin-top: auto;
  padding: 12px 16px;

  border: 0;

  border-radius: 12px;

  background: #29251f;

  color: white;

  font-size: 0.9rem;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.add-cart-button:hover:not(:disabled) {
  background: #9b5b28;

  transform: translateY(-1px);
}

.add-cart-button:disabled {
  background: #c9c3bb;

  cursor: not-allowed;
}
</style>