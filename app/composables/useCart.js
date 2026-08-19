export const useCart = () => {
  const cart = useState('boardgame-cart', () => [])

  const isReady = useState(
    'boardgame-cart-ready',
    () => false
  )

  const loadCart = () => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const savedCart =
        localStorage.getItem(
          'boardgame_cart'
        )

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart)

        if (Array.isArray(parsedCart)) {
          cart.value = parsedCart
        } else {
          cart.value = []
        }
      } else {
        cart.value = []
      }
    } catch (error) {
      console.error(
        'Cannot load cart:',
        error
      )

      cart.value = []
    }

    isReady.value = true
  }

  const saveCart = () => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(
        'boardgame_cart',
        JSON.stringify(cart.value)
      )

      window.dispatchEvent(
        new Event(
          'boardgame-cart-updated'
        )
      )
    } catch (error) {
      console.error(
        'Cannot save cart:',
        error
      )
    }
  }

  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (!product) {
      return
    }

    const existingItem =
      cart.value.find(item => {
        return item.id === product.id
      })

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        id: product.id,

        name: product.name,

        price: Number(product.price) || 0,

        discount:
          Number(product.discount) || 0,

        image:
          product.image || '',

        quantity: quantity
      })
    }

    saveCart()
  }

  const removeFromCart = id => {
    cart.value =
      cart.value.filter(item => {
        return item.id !== id
      })

    saveCart()
  }

  const updateQuantity = (
    id,
    quantity
  ) => {
    const item =
      cart.value.find(item => {
        return item.id === id
      })

    if (!item) {
      return
    }

    const newQuantity =
      Number(quantity)

    if (
      !Number.isFinite(
        newQuantity
      ) ||
      newQuantity <= 0
    ) {
      removeFromCart(id)
      return
    }

    item.quantity =
      Math.floor(newQuantity)

    saveCart()
  }

  const increaseQuantity = id => {
    const item =
      cart.value.find(item => {
        return item.id === id
      })

    if (!item) {
      return
    }

    item.quantity++

    saveCart()
  }

  const decreaseQuantity = id => {
    const item =
      cart.value.find(item => {
        return item.id === id
      })

    if (!item) {
      return
    }

    if (item.quantity <= 1) {
      removeFromCart(id)
      return
    }

    item.quantity--

    saveCart()
  }

  const clearCart = () => {
    cart.value = []

    saveCart()
  }

  /*
  |--------------------------------------------------------------------------
  | Function
  |--------------------------------------------------------------------------
  | คำนวณราคาหลังส่วนลด
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
        (1 - safeDiscount / 100)
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Function
  |--------------------------------------------------------------------------
  | คำนวณจำนวนสินค้าทั้งหมด
  */

  const cartCount = computed(() => {
    return cart.value.reduce(
      (total, item) => {
        return (
          total +
          Number(item.quantity || 0)
        )
      },
      0
    )
  })

  /*
  |--------------------------------------------------------------------------
  | Function
  |--------------------------------------------------------------------------
  | คำนวณยอดรวม
  */

  const cartTotal = computed(() => {
    return cart.value.reduce(
      (total, item) => {
        const price =
          calculateFinalPrice(
            item.price,
            item.discount
          )

        return (
          total +
          price *
            Number(item.quantity || 0)
        )
      },
      0
    )
  })

  /*
  |--------------------------------------------------------------------------
  | Function
  |--------------------------------------------------------------------------
  | คำนวณส่วนลดรวม
  */

  const discountTotal =
    computed(() => {
      return cart.value.reduce(
        (total, item) => {
          const originalPrice =
            Number(item.price) || 0

          const finalPrice =
            calculateFinalPrice(
              item.price,
              item.discount
            )

          const quantity =
            Number(
              item.quantity || 0
            )

          return (
            total +
            (originalPrice -
              finalPrice) *
              quantity
          )
        },
        0
      )
    })

  /*
  |--------------------------------------------------------------------------
  | Browser Event
  |--------------------------------------------------------------------------
  */

  if (
    typeof window !== 'undefined'
  ) {
    onMounted(() => {
      loadCart()

      const handleCartUpdate =
        () => {
          loadCart()
        }

      window.addEventListener(
        'boardgame-cart-updated',
        handleCartUpdate
      )

      onBeforeUnmount(() => {
        window.removeEventListener(
          'boardgame-cart-updated',
          handleCartUpdate
        )
      })
    })
  }

  return {
    cart,

    isReady,

    cartCount,

    cartTotal,

    discountTotal,

    loadCart,

    addToCart,

    removeFromCart,

    updateQuantity,

    increaseQuantity,

    decreaseQuantity,

    clearCart,

    calculateFinalPrice
  }
}