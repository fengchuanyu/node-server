const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const fs = require('fs');
const path = require('path');

/**
 * @description 判断文件夹是否存在 如果不存在则创建文件夹
 */
function checkDirExist() {
  const date = new Date();
  let month = Number.parseInt(date.getMonth()) + 1;
  month = month.toString().length > 1 ? month : `0${month}`;
  const dataSrc = `${date.getFullYear()}${month}${date.getDate()}`
  const dir =path.join(__dirname, '../../public/uploads/')+ dataSrc;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return {dir,dataSrc}
}

//上传至服务器
router.post("/upimgserver", async (ctx, a) => {
  //判断文件夹是否存在
  const cde = checkDirExist();
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  // 修改文件的名称
  var myDate = new Date();
  var newFilename = myDate.getTime()+'.'+file.name.split('.')[1];
  var targetPath = cde.dir;
  //创建可写流
  const upStream = fs.createWriteStream(targetPath + `/${newFilename}`);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  //返回保存的路径
  ctx.body = { code: 200, data: { url:ctx.request.header.origin + '/public/uploads/' + cde.dataSrc + '/' + newFilename } };
})

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