const zh = {
  nav: {
    home: "首页",
    cart: "购物车",
    user: "我的账户",
    products: "全部商品",
    categories: "商品分类",
    brands: "品牌",
  },
  error: {
    pageNotFound: "页面不存在",
  },
  common: {
    title: "SOSO商城",
    backToHome: "返回首页",
    viewAll: "查看全部",
    error: {
      fetchFailed: "数据加载失败",
    },
    allRightsReserved: "版权所有",
    loading: "加载中...",
    noData: "暂无数据",
    confirm: "确认",
    cancel: "取消",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    search: "搜索",
    filter: "筛选",
    sort: "排序",
    price: "价格",
    priceRange: "价格区间",
    currency: "¥",
  },
  home: {
    banner: {
      viewMore: "了解更多",
    },
    categories: {
      title: "商品分类",
      products: "商品",
    },
    hotProducts: {
      title: "热销商品",
    },
    specialProducts: {
      title: "特价商品",
      discount: "立省{amount}元",
      originalPrice: "原价",
      countdown: "剩余时间",
    },
    newProducts: {
      title: "新品上市",
    },
    brands: {
      title: "品牌",
      products: "商品",
    },
    promotion: {
      title: "促销活动",
      validUntil: "有效期至",
      minPurchase: "满{amount}元可用",
      maxDiscount: "最高优惠{amount}元",
    },
  },
  product: {
    addToCart: "加入购物车",
    tags: {
      new: "新品",
      hot: "热销",
      special: "特价",
      discount: "优惠{discount}%",
    },
    sales: "已售{count}件",
    actions: {
      addToCart: "加入购物车",
      addToFavorite: "收藏",
      buyNow: "立即购买",
    },
    messages: {
      addToCartSuccess: "已加入购物车",
      addToCartFailed: "加入购物车失败",
      addToFavoriteSuccess: "已加入收藏",
      addToFavoriteFailed: "收藏失败",
    },
    specifications: "规格参数",
    selectSpecification: "请选择{name}",
    quantity: "数量",
    stock: "库存：{count}件",
    reviews: {
      title: "商品评价",
      total: "{count}条评价",
      logistics: "物流评分",
      service: "服务评分",
      quality: "商品质量",
      filter: {
        all: "全部",
        positive: "好评",
        neutral: "中评",
        negative: "差评",
        hasImage: "有图",
        hasVideo: "有视频",
      },
    },
  },
  user: {
    profile: {
      title: "个人资料",
      avatar: "头像",
      nickname: "昵称",
      gender: "性别",
      birthday: "生日",
      phone: "手机号",
      email: "邮箱",
      save: "保存修改",
      changePassword: "修改密码",
    },
    orders: {
      title: "我的订单",
      tabs: {
        all: "全部订单",
        pending: "待付款",
        processing: "处理中",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消",
      },
      status: {
        pending: "待付款",
        processing: "处理中",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消",
      },
      actions: {
        pay: "付款",
        cancel: "取消订单",
        confirm: "确认收货",
        review: "评价",
        delete: "删除",
        viewDetails: "查看详情",
      },
    },
    favorites: {
      title: "我的收藏",
      empty: "暂无收藏商品",
    },
    reviews: {
      title: "我的评价",
      pending: "待评价",
      completed: "已评价",
    },
    service: {
      title: "客户服务",
      newTicket: "提交工单",
      myTickets: "我的工单",
      contactUs: "联系我们",
    },
    promotion: {
      title: "推广中心",
      myLink: "我的推广链接",
      qrCode: "推广二维码",
      banners: "推广素材",
      earnings: "推广收益",
    },
  },
  cart: {
    title: "购物车",
    empty: "购物车是空的",
    selected: "已选{count}件商品",
    total: "合计：",
    actions: {
      checkout: "结算",
      clear: "清空购物车",
      continue: "继续购物",
    },
    messages: {
      deleteConfirm: "确定要删除这件商品吗？",
      clearConfirm: "确定要清空购物车吗？",
    },
  },
  checkout: {
    title: "结算",
    address: {
      title: "收货地址",
      add: "添加新地址",
      edit: "编辑地址",
      default: "默认地址",
    },
    payment: {
      title: "支付方式",
      methods: {
        alipay: "支付宝",
        wechat: "微信支付",
        card: "信用卡",
      },
    },
    summary: {
      title: "订单摘要",
      subtotal: "商品小计",
      shipping: "运费",
      discount: "优惠",
      total: "应付总额",
    },
    submit: "提交订单",
  },
  footer: {
    about: {
      title: "关于我们",
      content:
        "SOSO商城是一个综合性电商平台，致力于为用户提供优质的商品和服务。",
    },
    service: {
      title: "客户服务",
      items: {
        shipping: "配送说明",
        returns: "退换货政策",
        warranty: "保修条款",
      },
    },
    policy: {
      title: "政策条款",
      items: {
        privacy: "隐私政策",
        terms: "服务条款",
        payment: "支付条款",
      },
    },
    contact: {
      title: "联系我们",
      phone: "电话：400-123-4567",
      email: "邮箱：service@sosomall.com",
      hours: "服务时间：9:00-21:00",
    },
  },
};

export default zh;
