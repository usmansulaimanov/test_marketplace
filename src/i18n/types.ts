export type Language = 'kk' | 'ru';

export interface Translations {
  common: {
    loading: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    back: string;
    close: string;
    search: string;
    all: string;
    yes: string;
    no: string;
    currency: string;
    units: string;
    empty: string;
    error: string;
    success: string;
    status: string;
    actions: string;
  };
  nav: {
    home: string;
    catalog: string;
    cart: string;
    wishlist: string;
    profile: string;
    login: string;
    logout: string;
    adminPanel: string;
    sellerPanel: string;
    mainMenu: string;
    overview: string;
    products: string;
    orders: string;
    analytics: string;
    warehouse: string;
    showcase: string;
  };
  header: {
    searchPlaceholder: string;
    toggleTheme: string;
    cartSummary: (count: number, sum: number) => string;
    loginBtn: string;
  };
  landing: {
    badge: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    viewCatalog: string;
    viewFootwear: string;
    stats: {
      originalQuality: { val: string; label: string };
      fastDelivery: { val: string; label: string };
      categoriesCount: { val: string; label: string };
      kaspiPay: { val: string; label: string };
    };
    categoriesTitle: string;
    viewAll: string;
    hitsTitle: string;
    viewAllHits: string;
    emptyHitsTitle: string;
    emptyHitsDesc: string;
    benefits: {
      deliveryTitle: string;
      deliveryDesc: string;
      guaranteeTitle: string;
      guaranteeDesc: string;
      returnsTitle: string;
      returnsDesc: string;
    };
  };
  catalog: {
    title: string;
    searchResultFor: (query: string) => string;
    foundCount: (count: number) => string;
    allCategories: string;
    sort: {
      label: string;
      popular: string;
      priceAsc: string;
      priceDesc: string;
      rating: string;
    };
    noProductsTitle: string;
    noProductsDesc: string;
    resetFilters: string;
    categories: Record<string, string>;
  };
  product: {
    addToCart: string;
    inCart: string;
    buyNow: string;
    addToWishlist: string;
    inWishlist: string;
    outOfStock: string;
    leftCount: (count: number) => string;
    reviewsCount: (count: number) => string;
    noReviews: string;
    selectSize: string;
    selectColor: string;
    colorLabel: string;
    description: string;
    editProduct: string;
    viewDetails: string;
    similarProducts: string;
    guarantees: {
      delivery: string;
      original: string;
      returns: string;
    };
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    goToCatalog: string;
    itemsCount: (count: number) => string;
    deliveryAddress: string;
    summary: string;
    subtotal: string;
    delivery: string;
    free: string;
    total: string;
    checkoutBtn: string;
    clearCart: string;
  };
  auth: {
    buyerTab: string;
    sellerTab: string;
    loginTitle: string;
    registerTitle: string;
    loginSub: string;
    registerSub: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    submitLogin: string;
    submitRegister: string;
    haveAccount: string;
    noAccount: string;
    toRegister: string;
    toLogin: string;
  };
  dashboard: {
    title: string;
    clientRole: string;
    balance: string;
    topUp: string;
    ordersTab: string;
    overviewTab: string;
    profileTab: string;
    noOrdersTitle: string;
    noOrdersDesc: string;
    orderNum: (id: string) => string;
    orderDate: (date: string) => string;
    orderStatus: string;
    totalAmount: string;
    topUpModalTitle: string;
    topUpPlaceholder: string;
  };
  seller: {
    title: string;
    shopLabel: string;
    overviewTab: string;
    productsTab: string;
    ordersTab: string;
    analyticsTab: string;
    addProductBtn: string;
    kpi: {
      totalRevenue: string;
      allTime: string;
      noSales: string;
      totalOrders: string;
      newOrdersToProcess: (count: number) => string;
      activeProducts: string;
      inCatalog: string;
      storeRating: string;
      noReviews: string;
      unitsSold: string;
      conversion: string;
      returns: string;
      noReturns: string;
    };
    salesTrend: string;
    salesTrendSub: string;
    viewAllAnalytics: string;
    categorySales: string;
    categorySalesSub: string;
    monthlyRevenue: string;
    table: {
      product: string;
      category: string;
      price: string;
      stock: string;
      status: string;
      actions: string;
      month: string;
      revenue: string;
      growth: string;
      planStatus: string;
    };
    orderStatuses: {
      new: string;
      processing: string;
      shipped: string;
      delivered: string;
      cancelled: string;
    };
    addProductModal: {
      title: string;
      editTitle: string;
      name: string;
      brand: string;
      category: string;
      price: string;
      oldPrice: string;
      stock: string;
      imageUrl: string;
      description: string;
      sizes: string;
      colors: string;
    };
  };
  admin: {
    title: string;
    subtitle: string;
    quickStats: {
      totalRevenue: string;
      ordersCount: string;
      itemsInStock: string;
      totalProducts: string;
    };
    tabs: {
      analytics: string;
      inventory: string;
      orders: string;
      addProduct: string;
    };
  };
  footer: {
    categories: string;
    forClients: string;
    management: string;
    description: string;
    rights: string;
    links: {
      delivery: string;
      returns: string;
      guarantee: string;
      sellerDashboard: string;
      adminPanel: string;
    };
  };
  errors: {
    notFoundTitle: string;
    notFoundDesc: string;
    goHome: string;
  };
}
