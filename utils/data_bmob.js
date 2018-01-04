var Bmob = require('../utils/bmob.js')
var buildURL = require('../utils/buildURL.js')

function getAllObjectID(callback) {
  var radioData = Bmob.Object.extend("radio_data");
  var query = new Bmob.Query(radioData);
  // 查询所有数据
  query.find({
    success: function (results) {
      let dataInfo = []
      console.log("共查询到 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        dataInfo.push(object.id)
      }
      callback(dataInfo)
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getOneInfo(objectID, callback){
  var radioData = Bmob.Object.extend("radio_data");
  var query = new Bmob.Query(radioData);
  query.get(objectID, {
    success: function (result) {
      // The object was retrieved successfully.
      let oneInfo = {}
      oneInfo.title = result.get("title")
      oneInfo.des = result.get("des")
      oneInfo.date = result.get("date")
      callback(oneInfo)
    },
    error: function (result, error) {
      console.log("查询失败");
    }
  });
}

function getAllInfo(callback){
  var radioData = Bmob.Object.extend("radio_data");
  var query = new Bmob.Query(radioData);
  // 查询所有数据
  query.find({
    success: function (results) {
      let list_content = []
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        let temp_content = {}
        temp_content.objectId = object.id
        temp_content.title = object.get('title')
        temp_content.date = object.get('date')
        temp_content.list_content = object.get('des')
        temp_content.list_img = buildURL.getImageURL(temp_content.date)
        list_content.push(temp_content)
      }
      callback(list_content)
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

module.exports = {
  getAllObjectID: getAllObjectID,
  getAllInfo: getAllInfo,
  getOneInfo: getOneInfo
}