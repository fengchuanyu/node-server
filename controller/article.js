const Router = require('koa-router');
let router = new Router();
const cloud = require('tcb-admin-node');
const db = cloud.database();
const _ = db.command;
const articleCollection = db.collection('mrzy_article');

//根据ID获取文章
async function getArticle(id) {
  let response = {}
  const _ = db.command
  await articleCollection.where({
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

//修改文章
async function updateArticle(form) {
  console.log(form)
  let response = {}
  response = await articleCollection.doc(form.id).update({
      content,
      title,
      type,
      typeText
    }=form)
    console.log(response)
  return response;
}

// 删除文章
async function delArticle(id) {
  let response = {}
  await articleCollection.doc(id.id).remove()
    .then(res => {
      response = res;
    })
    .catch(res => {
      response = res;
    })
  return response;
}

// 添加文章
async function addArticle(data) {
  let response = {}
  let date = new Date();
  let time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate())
  await articleCollection.add({
      ...data,
      creatTime:time,
      creatDate:db.serverDate(),
      view:0
    })
    .then(res => {
      response = res
    })
    .catch(console.error)
  return response
}

//获取其他类型文章
async function getOtherArticle(){
  let response = {}
  await articleCollection.where({
    type: _.in(['zhinan', 'guanyu'])
  }).get().then((res)=>{
    response = res.data
  }).catch((res)=>{
    response = res
  })
  return response;
}

// 获取文章列表
async function getData() {
  // 统计数据总量
  let res = await articleCollection.where({
    type: _.nin(['zhinan', 'guanyu'])
  }).count();
  let total = res.total;
  let data = [];
  let length = 0;
  let start = 0;
  // 循环将数据读出来
  while (total > length) {
    let res = await articleCollection.where({
      type: _.nin(['zhinan', 'guanyu'])
    }).skip(start).get();
    // 读出来后将数据存到data里
    data = data.concat(res.data);
    length += res.data.length;
    start += length;
  }
  return data;
}

//根据类型获取文章
async function  getArticleByType(params){
  let start = params.start;
  let count = params.count;
  let response = {}
  // 统计数据总量
  let res = await articleCollection.where({
    type: _.in(params.types)
  }).count();
  let total = res.total;
  await articleCollection.where({
    type: _.in(params.types)
  }).orderBy('creatDate', 'desc').limit(count).skip(start).get().then((res)=>{
    response = res.data
  }).catch((res)=>{
    response = res
  })
  return {response,total};
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
  await addArticle(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

router.post("/del", async (ctx, next) => {
  await delArticle(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

router.post("/update", async (ctx, next) => {
  await updateArticle(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data: data
    }
  });
})

router.post("/get", async (ctx, next) => {
  await getArticle(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data:data.data
    }
  });
})

router.post("/type", async (ctx, next) => {
  await getArticleByType(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data:data
    }
  });
})

router.get("/other", async (ctx, next) => {
  await getOtherArticle(ctx.request.body).then((data) => {
    ctx.body = {
      code: 20000,
      data:data
    }
  });
})




module.exports = router;