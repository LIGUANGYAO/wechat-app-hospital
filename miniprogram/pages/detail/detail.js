// pages/detail/detail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //截取参数
    var html = decodeURIComponent(options.html);  
    this.getPaper(html);
  },

  getPaper:function(html){
    //加载提示
    wx.showLoading({
      title: '加载中...',
    })
    wx.createSelectorQuery().select('#editor').context(res => {
      this.editorCtx = res.context;     
      this.editorCtx.setContents({
        html: html,
        success: res => {
          wx.hideLoading();
        }
      })
    }).exec()  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})