const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
const adminCollection = db.collection('mrzy_admin');

//登出
async function logOut(id) {
  let response = {}
  const _ = db.command
  await adminCollection.where({
    _id: _.eq(id.id)
  }).get() 
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

//获取信息
async function getInfo(form){
  let response = {}
  await adminCollection.where({
    tokenName:form.username
  }).get()
    .then(res => {
      if(res.data.length != 0){
        response={
          code:20000,
          data:token={
            roles: res.data[0].roles,
            introduction: res.data[0].introduction,
            avatar: res.data[0].avatar,
            name: res.data[0].name
          }
        }
      }else{
        response={
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }
    })
    .catch(res => {
      response = res;
    })
  return response;
}

//登陆验证
async function login(form) {
  let response = {}
  await adminCollection.where({
    adminName:form.username,
    adminPass:form.password
  }).get()
    .then(res => {
      if(res.data.length != 0){
        response={
          code:20000,
          data:token={
            roles: res.data[0].roles,
            introduction: res.data[0].introduction,
            avatar: res.data[0].avatar,
            name: res.data[0].name
          }
        }
      }else{
        response={
          code: 60204,
          message: '用户名或密码错误！'
        }
      }
    })
    .catch(res => {
      response = res;
    })
  return response;
}


router.post("/logout", async (ctx, next) => {
  ctx.body = {
    code:20000,
    data:"success"
  }
})

router.post("/login", async (ctx, next) => {
  await login(ctx.request.body).then((data) => {
    ctx.body = {
      ...data
    }
  });
})

router.post("/getinfo", async (ctx, next) => {
  await getInfo(ctx.request.body).then((data) => {
    ctx.body = {
      ...data
    }
  });
})

module.exports = router;