const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
const doctorCollection = db.collection('mrzy_doctor');

//根据ID获取医生
async function getDoctor(id) {
  let response = {}
  const _ = db.command
  await doctorCollection.where({
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
  await doctorCollection.doc(form.id).update({
      avatar:form.avatar,
      name:form.name,
      office:form.office,
      price:form.price,
      title:form.title
    })
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 删除医生
async function delDoctor(id) {
  let response = {}
  await doctorCollection.doc(id.id).remove()
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 添加医生
async function addDoctor(data) {
  let response = {}
  await doctorCollection.add({
      ...data
    })
    .then(res => {
      response = res
    })
    .catch(console.error)
  return response
}

// 获取医生列表
async function getData() {
  // 统计数据总量
  let res = await doctorCollection.count();
  let total = res.total;
  let data = [];
  let length = 0;
  let start = 0;
  // 循环将数据读出来
  while (total > length) {
    let res = await doctorCollection.skip(start).get();
    // 读出来后将数据存到data里
    data = data.concat(res.data);
    length += res.data.length;
    start += length;
  }
  return data;
}

router.post("/list", async (ctx, next) => {
  await getData().then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

router.post("/add", async (ctx, next) => {
  await addDoctor(ctx.request.body).then((data) => {
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

router.post("/get", async (ctx, next) => {
  await getDoctor(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data:data.data
    }
  });
})




module.exports = router;