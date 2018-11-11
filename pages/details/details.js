// details.js
import * as echarts from '../../ec-canvas/echarts';
const { watch, computed } = require('./vuefy.js');
const app = getApp();


Page({
  data: {
    type:'等额本息',
    firstPercent:null,//首付百分比
    years:null,//分多少期
    rates:null,//利率
    allowance:null,
    loan:null,
    loantype:null,
    loanTotalData:null,
    payInterestData:null,
    interestData:null,
    ec:{},
  },
  
  initChart:function (canvas, width, height) {
    let that = this;
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    var data = [{ value: that.data.loanTotalData, name: '贷款总额' }, { value: that.data.payInterestData/10000, name: '支付利息' }];
    var dataSum = data[0].value + data[1].value;
    var option = {
      // backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9"],
      legend: {
        orient: 'vertical',
        x: 'right',
        data: ['贷款总额', '支付利息']
      },
      series: [{
        radius: ['60%', '100%'],
        itemStyle: {
          normal: {
            label: { show: false },
            labelLine: { show: false }
          }
        },
        type: 'pie',
        data: data,
      }]
    };
    if (that.data.type =='等额本息'){
      chart.setOption(option);
      console.log(data)
      return chart;
    }else{
      chart.clear();
      chart.setOption(option);
      console.log(data)
      return chart;
    }
  },


  equalInterest:function(event){
    let that = this;
    that.setData({
      type: event.currentTarget.dataset.type,
    })
  },
  equalPrincipal: function (event) {
    let that = this;
    that.setData({
      type: event.currentTarget.dataset.type,
    })
  },
  
  onLoad:function(options) {
    console.log(options);
    let data = options;
    let that = this;
    if (data.type =='商业贷'){
      this.setData({
        loantype: data.type,
        years: Number(data.businessyear),
        rates: Math.floor(Number(data.businessrate*100)*1000)/1000,
        loan: Number(data.businessLoan),
        allowance: Number(data.businessallowance),
      })
    } else if (data.type == '公积金贷'){
      this.setData({
        loantype: data.type,
        years: Number(data.fundyear),
        rates: Math.floor(Number(data.fundrate*100) * 1000) / 1000,
        loan: Number(data.fundLoan),
        allowance: Number(data.fundallowance),
      })
    }else{
      this.setData({
        loantype: data.type,
        loan: Number(data.fundLoan) + Number(data.businessLoan),
        rates: [Number(data.businessrate), Number(data.fundrate)],
        years: [Number(data.businessyear),Number(data.fundyear)],
        allowance: [Number(data.businessallowance), Number(data.fundallowance)],
      })
    }
    let monthRate = that.data.rates/100 / 12 * that.data.allowance;
    let each = Math.pow(1 + monthRate, that.data.years);
    let eachMonthPay = Math.floor(that.data.loan * 10000 * monthRate * each / (each - 1));
    let interest = (that.data.years + 1) * that.data.loan*10000 * monthRate / 2;
    
    computed(that,{
      payInterest: function () {  //支付利息
        if (data.type == '商业贷' || data.type == '公积金贷'){
          if (that.data.type == '等额本息'){
            that.data.loanTotalData = that.data.loan;
            that.data.payInterestData = eachMonthPay * that.data.years - that.data.loan*10000;
          }else{
            let average = Math.floor((that.data.loan*10000 + interest) / that.data.years);
            that.data.loanTotalData = that.data.loan;
            that.data.payInterestData = average * that.data.years - that.data.loan*10000;
          }
          let payin = (eachMonthPay * that.data.years / 10000 - that.data.loan);
          return  Math.floor(payin*100)/100;
        }else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12;
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businesspow = Math.pow(1 + businessMonthRate, that.data.years[0]);
          let fundpow = Math.pow(1 + fundMonthRate, that.data.years[1]);
          let businessEachMonth = Math.floor(data.businessLoan * 10000 * businessMonthRate * businesspow / (businesspow - 1));
          let fundEachMonth = Math.floor(data.fundLoan * 10000 * fundMonthRate * fundpow / (fundpow - 1));
          let eachMonthPay = businessEachMonth + fundEachMonth;
          let loanTotal = (businessEachMonth * that.data.years[0] - data.businessLoan * 10000) + (fundEachMonth * that.data.years[1] - data.fundLoan * 10000);
          let businessinterest = (that.data.years[0] + 1) * data.businessLoan * 10000 * businessMonthRate / 2;
          let fundinterest = (that.data.years[0] + 1) * data.fundLoan * 10000 * fundMonthRate / 2;

          if (that.data.type == '等额本息'){
            that.data.loanTotalData = that.data.loan;
            that.data.payInterestData = loanTotal;
          }else{
            that.data.loanTotalData = that.data.loan;
            that.data.payInterestData = businessinterest + fundinterest;
          }
          // console.log(eachMonthPay)
          return Math.floor(loanTotal/10000 * 100) / 100;
        }
      },
      _total:function(){
        if (data.type == '商业贷' || data.type == '公积金贷'){
          let payin = (eachMonthPay * that.data.years / 10000 - that.data.loan);
          return Math.floor((payin+that.data.loan) * 100) / 100;
        }else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12;
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businesspow = Math.pow(1 + businessMonthRate, that.data.years[0]);
          let fundpow = Math.pow(1 + fundMonthRate, that.data.years[1]);
          let businessEachMonth = Math.floor(data.businessLoan * 10000 * businessMonthRate * businesspow / (businesspow - 1));
          let fundEachMonth = Math.floor(data.fundLoan * 10000 * fundMonthRate * fundpow / (fundpow - 1));
          let eachMonthPay = businessEachMonth + fundEachMonth;
          let loanTotal = (businessEachMonth * that.data.years[0] - data.businessLoan * 10000) + (fundEachMonth * that.data.years[1] - data.fundLoan * 10000);
          let businessinterest = (that.data.years[0] + 1) * data.businessLoan * 10000 * businessMonthRate / 2;
          let fundinterest = (that.data.years[0] + 1) * data.fundLoan * 10000 * fundMonthRate / 2;
          return Math.floor((loanTotal/10000 + that.data.loan) * 100) / 100;
        }
      },

      eachMonthPay: function () {  //平均月供，首月月供
        if (data.type == '商业贷' || data.type == '公积金贷') {
          return eachMonthPay;
        }else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12; 
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businesspow = Math.pow(1 + businessMonthRate, that.data.years[0]);
          let fundpow = Math.pow(1 + fundMonthRate, that.data.years[1]);
          let businessEachMonth = Math.floor(data.businessLoan * 10000 * businessMonthRate * businesspow / (businesspow - 1));
          let fundEachMonth = Math.floor(data.fundLoan * 10000 * fundMonthRate * fundpow / (fundpow - 1));
          return (businessEachMonth + fundEachMonth);
        }
      },

      //等额本金
      interest: function () {  //支付利息
        if (data.type == '商业贷' || data.type == '公积金贷'){
          return Math.floor((interest/10000)*100)/100;
        }else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12;
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businessinterest = (that.data.years[0] + 1) * data.businessLoan * 10000 * businessMonthRate / 2;
          let fundinterest = (that.data.years[0] + 1) * data.fundLoan * 10000 * fundMonthRate / 2;
          return Math.floor(((businessinterest + fundinterest)/10000)*100)/100;
        }
      },
      __total: function(){
        if (data.type == '商业贷' || data.type == '公积金贷'){
          return Math.floor((interest / 10000+that.data.loan) * 100) / 100;
        }else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12;
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businessinterest = (that.data.years[0] + 1) * data.businessLoan * 10000 * businessMonthRate / 2;
          let fundinterest = (that.data.years[0] + 1) * data.fundLoan * 10000 * fundMonthRate / 2;
          return Math.floor(((businessinterest + fundinterest) / 10000+that.data.loan) * 100) / 100;
        }
      },
      average: function () { //平均月供
        if (data.type == '商业贷' || data.type == '公积金贷'){
          return Math.floor((that.data.loan * 10000 + interest) / that.data.years);
        }
        else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12;
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businessinterest = (that.data.years[0] + 1) * data.businessLoan * 10000 * businessMonthRate / 2;
          let fundinterest = (that.data.years[0] + 1) * data.fundLoan * 10000 * fundMonthRate / 2;
          let businessAve = (data.businessLoan * 10000 + businessinterest) / that.data.years[0];
          let fundAve = (data.fundLoan * 10000 + fundinterest) / that.data.years[1];
          return Math.floor(businessAve + fundAve);
        }
      },
      firstMonthPay: function () { //首月
        if (data.type == '商业贷' || data.type == '公积金贷'){
          return Math.floor((that.data.loan * 10000 / that.data.years) + (that.data.loan * 10000 * monthRate))
        }else{
          let businessMonthRate = that.data.rates[0] * that.data.allowance[0] / 12;
          let fundMonthRate = that.data.rates[1] / 12 * that.data.allowance[1];
          let businessinterest = (that.data.years[0] + 1) * data.businessLoan * 10000 * businessMonthRate / 2;
          let fundinterest = (that.data.years[0] + 1) * data.fundLoan * 10000 * fundMonthRate / 2;
          let businessFirstPay = (data.businessLoan * 10000 / that.data.years[0]) + (data.businessLoan * 10000 * businessMonthRate);
          let fundFirstPay = (data.fundLoan * 10000 / that.data.years[1]) + (data.fundLoan * 10000 * fundMonthRate);
          return Math.floor(businessFirstPay + fundFirstPay)
        }
      },
    })
  },

  echartInit(e) {
    this.initChart(e.detail.canvas, e.detail.width, e.detail.height);
  }
});