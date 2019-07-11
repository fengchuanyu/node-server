const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
const userCollection = db.collection('mrzy_user');

//根据ID获取用户
async function getDoctor(id) {
  let response = {}
  const _ = db.command
  await userCollection.where({
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

//修改医生
async function updateDoctor(form) {
  let response = {}
  await userCollection.doc(form.id).update({
    userType:form.type,
    doctor:form.doctor?form.doctor:""
    })
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 获取用户列表
async function getData(info) {
  // 统计数据总量
  let counts = info.count,start = info.start;
  let res = await userCollection.count();
  let total = res.total;
  res = await userCollection.orderBy('_id','asc').limit(counts).skip(start).get();
  let data = res.data;
  return {data,total};
  // // 统计数据总量
  // let res = await userCollection.count();
  // let total = res.total;
  // let data = [];
  // let length = 0;
  // let start = 0;
  // // 循环将数据读出来
  // while (total > length) {
  //   let res = await userCollection.skip(start).get();
  //   // 读出来后将数据存到data里
  //   data = data.concat(res.data);
  //   length += res.data.length;
  //   start += length;
  // }
  // return data;
}

router.post("/list", async (ctx, next) => {
  await getData(ctx.request.body).then((data) => {
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

router.post("/get", async (ctx, next) => {
  await getDoctor(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data:data.data
    }
  });
})

module.exports = router;