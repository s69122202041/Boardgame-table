export function calculateFinalPrice(price, discount = 0) {
  const safePrice = Number(price) || 0
  const safeDiscount = Number(discount) || 0

  const finalPrice =
    safePrice * (1 - safeDiscount / 100)

  return Math.round(finalPrice)
}

export function calculateDiscountAmount(
  price,
  discount = 0
) {
  const originalPrice = Number(price) || 0

  const finalPrice = calculateFinalPrice(
    originalPrice,
    discount
  )

  return Math.max(
    0,
    originalPrice - finalPrice
  )
}

export function calculateSubtotal(
  price,
  discount,
  quantity
) {
  const finalPrice = calculateFinalPrice(
    price,
    discount
  )

  const safeQuantity =
    Number(quantity) || 0

  return finalPrice * safeQuantity
}

export function calculateCartTotal(
  cart,
  products
) {
  return cart.reduce(
    (total, cartItem) => {
      const product = products.find(
        item =>
          item.id === cartItem.productId
      )

      if (!product) {
        return total
      }

      return (
        total +
        calculateSubtotal(
          product.price,
          product.discount,
          cartItem.quantity
        )
      )
    },
    0
  )
}

export function calculateShipping(total) {
  const safeTotal = Number(total) || 0

  if (safeTotal >= 1500) {
    return 0
  }

  return 80
}

export function calculateGrandTotal(total) {
  const shipping =
    calculateShipping(total)

  return Number(total) + shipping
}

export function canBuyProduct(
  product,
  quantity = 1
) {
  const hasStock =
    product?.stock > 0

  const validQuantity =
    Number(quantity) > 0

  return (
    hasStock &&
    validQuantity
  )
}

export function hasDiscount(product) {
  return (
    Number(product?.discount) > 0
  )
}

export function recommendProducts(
  currentProduct,
  products,
  limit = 4
) {
  if (!currentProduct) {
    return []
  }

  return products
    .filter(product => {
      if (
        product.id ===
        currentProduct.id
      ) {
        return false
      }

      const currentCategories =
        currentProduct.categories || []

      const productCategories =
        product.categories || []

      return productCategories.some(
        category =>
          currentCategories.includes(
            category
          )
      )
    })
    .sort(
      (a, b) =>
        (b.popularity || 0) -
        (a.popularity || 0)
    )
    .slice(0, limit)
}