const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
const caseCollection = db.collection('mrzy_case');

//根据ID获取病例
async function getDoctor(id) {
  let response = {}
  const _ = db.command
  await caseCollection.where({
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
      avatar,
      name,
      office,
      price,
      title
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
  await caseCollection.doc(id.id).remove()
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 创建病例
async function addCase(data) {
  let response = {}
  let date = new Date();
  let time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()+1)
  await caseCollection.add({
      ...data,
      creatDate:time
    })
    .then(res => {
      response = res
    })
    .catch(console.error)
  return response
}

// 获取病例列表
async function getData() {
  // 统计数据总量
  let res = await caseCollection.count();
  let total = res.total;
  let data = [];
  let length = 0;
  let start = 0;
  // 循环将数据读出来
  while (total > length) {
    let res = await caseCollection.orderBy('_id', 'desc').skip(start).get();
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

router.post("/add", async (ctx, next) => {
  await addCase(ctx.request.body).then((data) => {
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