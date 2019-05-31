const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
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
async function getData() {
  // 统计数据总量
  let res = await appointmentCollection.count();
  let total = res.total;
  let data = [];
  let length = 0;
  let start = 0;
  // 循环将数据读出来
  while (total > length) {
    let res = await appointmentCollection.orderBy('_id', 'desc').skip(start).get();
    // 读出来后将数据存到data里
    data = data.concat(res.data);
    length += res.data.length;
    start += length;
  }
  return data;
}

router.get("/list", async (ctx, next) => {
  await getData().then((data) => {
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