// pages/delete_info/delete_info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    department_name:{},
    disease_name:{},
    multiArray: [],
    multiIndex: [],
    fileid:{},
    listdata:[]
  },
  bindMultiPickerChange: function (e) {
    var disease_key=0;
    var diseaseList=this.data.diseaseList;
    var select_key=e.detail.value[1];
    console.log("bindmultipickerchange-selectkey"+select_key);
    var real_key = select_key ;
    if (real_key < disease_key) {
      this.setData({
        disease_name: 0
      })
    } else {
      this.setData({
        disease_name: diseaseList[real_key]['name']　　　　　　
      })
    }
    this.setData({
      multiIndex: e.detail.value
    })
    this.getpaperlist(this.data.disease_name,this.data.department_name);
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    var department_name_session = this.data.department_name; 
    switch(e.detail.column){
      case 0:
        var departmentList = this.data.departmentList;
        var department_name = departmentList[e.detail.value]['name'];
        if(department_name_session!=department_name){
          this.getDisease(department_name);
        }
        data.multiIndex[1] = 0;
        break;
      };
    this.setData(data);
  },
  submit2(e){
    /**删除疾病，触发二次确认 */
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdepartmentData(); 
  },
//获取科室数据
getdepartmentData: function(){
  //加载提示
  wx.showLoading({
    title: '加载中...',
    })
  wx.cloud.callFunction({
    name:'get_departments',
    config:{ env: 'medremangement-cloud-8bn8d3d8486' },      
    data:{},    
    success: res => {
      // 关闭加载提示
      wx.hideLoading();
      console.log('res ==> ', res);
      var departmentList = res.result.data;
      var departmentArr = departmentList.map(item => {
        return item.name;
      });
      this.setData({
        multiArray:[departmentArr,[]],
        departmentList,
        departmentArr
      })
      var default_department = departmentArr[0];
      if(default_department)
      {
        this.getDisease(default_department);
      }
    },
    fail: err => {
      // 关闭加载提示
      wx.hideLoading();
      console.log('出错了 err ==> ', err);
    }
  })
},  
//获取病类数据
getDisease: function (name) {
  //加载提示
  wx.showLoading({
    title: '加载中...',
  })
  var that=this;
  if (name) {
    this.setData({
      department_name: name
    })
  //调用云函数【get_disease】获取疾病
  wx.cloud.callFunction({
    name: 'get_disease',
    config:{ env: 'medremangement-cloud-8bn8d3d8486' },      
    //参数
    data: {
    name: name
    },
    success: res => {
      // 关闭加载提示
      wx.hideLoading();
      console.log('res ==> ', res);
      var diseaseList = res.result.data;
      var diseaseArr = diseaseList.map(item =>{
        return item.name;
      })
      var departmentArr = this.data.departmentArr;
      that.setData({
        multiArray:[departmentArr,diseaseArr],
        diseaseArr,
        diseaseList
      })
    },
    fail: err => {
      // 关闭加载提示
      wx.hideLoading();
      console.log('出错了 err ==> ', err);
    }
  })
}
},
getpaperlist: function (disease,department) {

  //加载提示
  wx.showLoading({
    title: '加载中...',
  })

  //调用云函数【get_paperlist】获取商品
  wx.cloud.callFunction({
    config:{ env: 'medremangement-cloud-8bn8d3d8486' },
    name: 'get_paperlist',
    //参数
    data: {
      disease:disease,
      department:department
    },

    success: res => {
      // 关闭加载提示
      wx.hideLoading();
      console.log('res ==> ', res);
      this.setData({
        listdata: res.result.data.reverse()
      })
    },

    fail: err => {
      // 关闭加载提示
      wx.hideLoading();
      console.log('出错了 err ==> ', err);
    }
  })
},
delItem: function(e){
  var thiss=this;
   var id = e.currentTarget.dataset.index;
  wx.showModal({
    cancelColor: 'cancelColor',
    title:'提示',
    content:'确认删除该文章？（删除不可恢复）',
    success : function(res){
      if(res.confirm){
        console.log('用户确定删除这篇文章');
             //数据删除
        console.log(thiss.data.listdata[id]._id)
        wx.cloud.callFunction({
        config:{ env: 'medremangement-cloud-8bn8d3d8486' },
        name:'delete_paper',
        data: {
          _id: thiss.data.listdata[id]._id
         },
         success: res =>{
           console.log("云函数删除成功")
        }
       })
        //视图层删除
        thiss.data.listdata.splice(id,1)
        thiss.setData({
          listdata: thiss.data.listdata
        })
        wx.showToast({
          title: '删除成功',
          icon:'success',
        })
      }else if(res.cancel){
        console.log('用户取消删除')
      }
    }
  })
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