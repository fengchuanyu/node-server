const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
const _ = db.command;
const appointmentCollection = db.collection('mrzy_appointment');


//修改挂号信息
async function updateDoctor(form) {
  let response = {}
  await appointmentCollection.doc(form.id).update({
    createCase
    } = form)
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 删除挂号信息
async function delDoctor(id) {
  let response = {}
  await appointmentCollection.doc(id.id).remove()
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 获取挂号列表
async function getData(type,pageinfo) {
  let dater = new Date()
  let timer = dater.getFullYear() + "-" + (dater.getMonth() + 1) + "-" + (dater.getDate())
  dater = new Date(timer)
  let thisOrder = {
    selecteTime:_.lt(dater)
  }
  if(type == 'gt'){
    thisOrder.selecteTime = _.gte(dater);
  }
  // 统计数据总量
  let res = await appointmentCollection.where({
    ...thisOrder
  }).count();
  let total = res.total;
  let data = [];
  let start = parseInt(pageinfo.start);
  let counts = parseInt(pageinfo.count);
  let resu = await appointmentCollection.where({
    ...thisOrder
  }).orderBy('_id', 'desc').limit(counts).skip(start).get();
  // 读出来后将数据存到data里
  data = resu.data;
  return {data,total};
}

router.get("/list", async (ctx, next) => {
  let pageInfo = {...ctx.query}
  await getData(ctx.query.order,pageInfo).then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

router.post("/del", async (ctx, next) => {
  await delDoctor(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

router.post("/update", async (ctx, next) => {
  await updateDoctor(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

module.exports = router;