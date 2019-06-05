const Koa = require('koa');
const app = new Koa();
const bodyparser = require('koa-bodyparser');
const Router = require("koa-router");
const cors = require('koa2-cors');

app.use(cors({
    origin: ['http://localhost:9527'],
    credentials: true
}));

const router = new Router({
  prefix:"/mrzymz"
});
app.use(bodyparser());

router.post("/doctor/list",(ctx,next)=>{
  console.log('come');
  ctx.body = {
    code:20000,
    data:[0,1,2]
  }
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
