const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const fs = require('fs')

//上传图片
router.post("/upimg", async (ctx, a) => {
  let resObj = {};
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const fsCRS = fs.createReadStream(file.path);

  const cloudPath = 'avatar/doctor' + new Date().getTime() + file.name.match(/\.[^.]+?$/)[0]
  await cloud.uploadFile({
    cloudPath,
    fileContent: fsCRS,
  }).then(res => {
    resObj.fileId = res.fileID;
    resObj.msg="ok";
  }).catch(error => {
    resObj.msg = error
  })


  ctx.body = resObj
})

//换取临时地址
router.post("/tempfile", async (ctx, next) => {
  let fileList = [ctx.request.body.id]
  if(typeof ctx.request.body.id == "object"){
    fileList = [...ctx.request.body.id]
  }
  const result = await cloud.getTempFileURL({
    fileList,
  })
  ctx.body = {
    code: 20000,
    data: result.fileList
  }
})

module.exports = router;