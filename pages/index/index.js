//index.js
//获取应用实例
const app = getApp()
const { watch, computed } = require('./vuefy.js')
Page({
  data: {
    type:'商业贷',
    total:100,
    businessLoan:70,
    fundLoan:70,
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    firstPay: [
      { value: 0.1, name: '10%' },
      { value: 0.2, name: '20%' },
      { value: 0.3, name: '30%' },
      { value: 0.4, name: '40%' },
      { value: 0.5, name: '50%' },
      { value: 0.6, name: '60%' },
      { value: 0.7, name: '70%' },
      { value: 0.8, name: '80%' },
      { value: 0.9, name: '90%' },
    ],
    firstIndex:2,
    payYears:[
      { value: 12, name: '1年(12期)' },
      { value: 24, name: '2年(24期)' },
      { value: 36, name: '3年(36期)' },
      { value: 48, name: '4年(48期)' },
      { value: 60, name: '5年(60期)' },
      { value: 72, name: '6年(72期)' },
      { value: 84, name: '7年(84期)' },
      { value: 96, name: '8年(96期)' },
      { value: 108, name: '9年(108期)' },
      { value: 120, name: '10年(120期)' },
      { value: 132, name: '11年(132期)' },
      { value: 144, name: '12年(144期)' },	
      { value: 156, name: '13年(156期)' },
      { value: 168, name: '14年(168期)' },
      { value: 180, name: '15年(180期)' },
      { value: 192, name: '16年(192期)' },	
      { value: 204, name: '17年(204期)' },
      { value: 216, name: '18年(216期)' },
      { value: 228, name: '19年(228期)' },
      { value: 240, name: '20年(240期)' },
      { value: 252, name: '21年(252期)' },
      { value: 52, name: '22年(264期)' },
      { value: 264, name: '23年(276期)' },
      { value: 288, name: '24年(288期)' },
      { value: 300, name: '25年(300期)' },
      { value: 312, name: '26年(312期)' },
      { value: 324, name: '27年(324期)' },
      { value: 336, name: '28年(336期)' },
      { value: 348, name: '29年(348期)' },
      { value: 360, name: '30年(360期)' },
    ],
    businessYearIndex:19,
    fundYearIndex: 19,
    businessRates:[
      { value: 0.049, name: '15年10月24日基准利率 4.90%'},
      { value: 0.0515, name: '15年08月26日基准利率 5.15%' },
      { value: 0.054, name: '15年06月28日基准利率 5.40%' },
      { value: 0.0565, name: '15年05月11日基准利率 5.65%' },
      { value: 0.059, name: '15年03月01日基准利率 5.90%' },
      { value: 0.0615, name: '14年11月21日基准利率 6.15%' },
      { value: 0.0655, name: '12年07月06日基准利率 6.55%' },
      { value: 0.068, name: '12年06月08日基准利率 6.80%' },
      { value: 0.0705, name: '11年07月06日基准利率 7.05%' },
      { value: 0.068, name: '11年04月05日基准利率 6.80%' },
      { value: 0.066, name: '11年02月09日基准利率 6.60%' },
      { value: 0.064, name: '10年12月26日基准利率 6.40%' },
    ],
    businessIndex:0,
    fundRates: [
      { value: 0.0325, name: '15年10月24日基准利率 3.25%' },
      { value: 0.0325, name: '15年08月26日基准利率 3.25%' },
      { value: 0.035, name: '15年06月28日基准利率 3.50%' },
      { value: 0.0375, name: '15年05月11日基准利率 3.75%' },
      { value: 0.04, name: '15年03月01日基准利率 4.00%' },
      { value: 0.0425, name: '14年11月21日基准利率 4.25%' },
      { value: 0.045, name: '12年07月06日基准利率 4.50%' },
      { value: 0.047, name: '12年06月08日基准利率 4.70%' },
      { value: 0.049, name: '11年07月06日基准利率 4.90%' },
      { value: 0.047, name: '11年04月05日基准利率 4.70%' },
      { value: 0.045, name: '11年02月09日基准利率 4.50%' },
      { value: 0.043, name: '10年12月26日基准利率 4.30%' },
    ],
    fundIndex:0,
    allowance:[
      { value: 0.7, name: '7折' },
      { value: 0.8, name: '8折' },
      { value: 0.85, name: '85折' },
      { value: 0.88, name: '88折' },
      { value: 0.9, name: '9折' },
      { value: 1, name: '10折' },
    ],
    businessAllowanceIndex:5,
    fundAllowanceIndex:5,
  },

  // tab页切换
  businessTap:function(event){
    let that = this;
    that.setData({
      type: event.target.dataset.type,
    });
  },
  fundTap: function (event) {
    let that = this;
    that.setData({
      type: event.target.dataset.type,
    });
  },
  combinedTap: function (event) {
    let that = this;
    that.setData({
      type: event.currentTarget.dataset.type
    });
  },

  // 首付百分比
  bindFirstPicker: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log('picker发送选择改变，携带值为', this.data.firstPay[e.detail.value].name)
    this.setData({   
      firstIndex: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
  },

  // 按揭年数
  bindBusinessYearsPicker: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({   
      businessYearIndex: e.detail.value,  
    })
  },
  bindFundYearsPicker: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      fundYearIndex: e.detail.value,
    })
  },

  // 不同利率
  bindBusinessRates: function (e){
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
      that.setData({   
        businessIndex: e.detail.value,  
      })
  },
  bindFundRates: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    that.setData({
      fundIndex: e.detail.value,
    })
  },

  // 折扣
  bindBusinessAllowance:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({   
      businessAllowanceIndex: e.detail.value,  
    })
  },
  bindFundAllowance: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      fundAllowanceIndex: e.detail.value,
    })
  },

  // 房款总价input
  watchInput: function (event) {
     this.setData({
       total: event.detail.value,
    })
  },
  //组合贷的两个input
  businessInput: function (event) {
    console.log(event.detail.value)
    this.setData({
      businessLoan: event.detail.value,
    })
  },
  fundInput: function (event) {
    this.setData({
      fundLoan: event.detail.value,
    })
  },

  // 开始计算传值
  bindViewTap: function() {  //路由
    let that = this;
    let d=that.data;
    let params = {
      type: that.data.type
    }
    if (params.type == '商业贷'){
      params.businessLoan = d.total - d.total * d.firstPay[d.firstIndex].value;
      params.businessrate = d.businessRates[d.businessIndex].value;
      params.businessyear = d.payYears[d.businessYearIndex].value;
      params.businessallowance = d.allowance[d.businessAllowanceIndex].value;
      let b=[];
      for(var key in params){
        b.push(key + '=' + params[key])
      }
      let final = b.join('&')
      wx.navigateTo({
        url: '../details/details?' + final
      })
      // console.log(params)
    } else if (params.type == '公积金贷'){
      params.fundLoan = d.total - d.total * d.firstPay[d.firstIndex].value;
      params.fundrate = d.fundRates[d.fundIndex].value;
      params.fundyear = d.payYears[d.fundYearIndex].value;
      params.fundallowance = d.allowance[d.fundAllowanceIndex].value;
      // console.log(params)
      let b = [];
      for (var key in params) {
        b.push(key + '=' + params[key])
      }
      let final = b.join('&')
      wx.navigateTo({
        url: '../details/details?' + final
      })
    }else{
      params.businessLoan = d.businessLoan;
      params.businessrate = d.businessRates[d.businessIndex].value;
      params.businessyear = d.payYears[d.businessYearIndex].value;
      params.businessallowance = d.allowance[d.businessAllowanceIndex].value;
      params.fundLoan = d.fundLoan;
      params.fundrate = d.fundRates[d.fundIndex].value;
      params.fundyear = d.payYears[d.fundYearIndex].value;
      params.fundallowance = d.allowance[d.fundAllowanceIndex].value;
      let b = [];
      for (var key in params) {
        b.push(key + '=' + params[key])
      }
      let final = b.join('&')
      wx.navigateTo({
        url: '../details/details?' + final
      })
    }
  },
  onLoad: function () {
    computed(this, {
      test1: function () {
        // console.log(parseFloat(this.data.firstValue)/100)
        return this.data.total * (this.data.firstPay[this.data.firstIndex].value) 
      },
      test2: function () {
        return this.data.total - this.data.total * (this.data.firstPay[this.data.firstIndex].value)
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   // this.setData({
  //   //   total: this.total,
  //   // })
  // }
})
