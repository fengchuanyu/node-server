const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors');
const Router = require('koa-router');
const koaBody = require('koa-body')
const cloud = require('tcb-admin-node');

const router = new Router({
  prefix:"/mrzymz"
});

app.use(cors({
    origin: ['http://localhost:9527'],
    credentials: true
}));

app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));

cloud.init({
  secretId: 'AKIDwh03sRhJbfVAamvTyEKCsITO5XkhcwEI',
  secretKey: 'xgAPPBk5Azby6yd5JJ5dz6yfBRSDk7F7',
});


let doctor = require('./controller/doctor.js');
let util = require('./controller/util.js');
let user = require('./controller/user.js');
let office = require('./controller/office.js');
let appointment = require('./controller/appointment.js');
let caseRouter = require('./controller/case.js');
router.use('/doctor', doctor.routes());
router.use('/util', util.routes());
router.use('/muser', user.routes());
router.use('/office', office.routes());
router.use('/appointment', appointment.routes());
router.use('/case', caseRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);

/*
    // Post
    router.post('/login',async (ctx,next)=>{
    console.log('login Success!')
    //ctx.request.body 用于获取post的参数
    ctx.body=ctx.request.body;
    })

    // GET
    router.get('/user',async (ctx,next)=>{
    console.log('user Ok!')
    //crx.query 是用于获取get请求的参数
    ctx.body=ctx.query;
    })
*/