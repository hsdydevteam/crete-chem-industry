import { products, contact } from '../data.js';
const encoder=new TextEncoder();
const statuses=['New','Contacted','Confirmed','In progress','Completed','Cancelled'];
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const hex=buffer=>Array.from(new Uint8Array(buffer),b=>b.toString(16).padStart(2,'0')).join('');
const hash=async text=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(text)));
const query=(env,sql,...values)=>env.DB.prepare(sql).bind(...values);
const sessionCookie=(token,secure,age=28800)=>`cc_admin=${token}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${age}${secure?'; Secure':''}`;
async function limited(env,key,max,seconds){
 const now=Date.now();
 const row=await query(env,'INSERT INTO limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at < ? THEN 1 ELSE count+1 END, expires_at=CASE WHEN expires_at < ? THEN excluded.expires_at ELSE expires_at END RETURNING count',key,now+seconds*1000,now,now).first();
 return row.count>max;
}
async function session(request,env){
 const token=request.headers.get('cookie')?.match(/(?:^|;\s*)cc_admin=([a-f0-9]{64})(?:;|$)/)?.[1];
 if(!token)return null;const tokenHash=await hash(token);
 const row=await query(env,'SELECT token_hash FROM sessions WHERE token_hash = ? AND expires_at > ?',tokenHash,Date.now()).first();
 return row?tokenHash:null;
}
async function readBody(request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new Error('Please send JSON data.');
 if(Number(request.headers.get('content-length')||0)>16000)throw new Error('Request is too large.');
 const reader=request.body?.getReader();if(!reader)throw new Error('Missing request body.');let length=0,chunks=[];
 while(true){const{done,value}=await reader.read();if(done)break;length+=value.length;if(length>16000){await reader.cancel();throw new Error('Request is too large.');}chunks.push(value);}
 const all=new Uint8Array(length);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length;}return JSON.parse(new TextDecoder().decode(all));
}
const clean=(v,max,required=false)=>{if(typeof v!=='string'||v.trim().length>max||(required&&!v.trim()))throw new Error('Please check your customer details.');return v.trim();};
function orderView(row){return{id:row.id,createdAt:row.created_at,status:row.status,customer:JSON.parse(row.customer),items:JSON.parse(row.items)};}
function orderReply(row){const order=orderView(row);const c=order.customer;const message=`CRETE-CHEM Order / Quotation Request\nReference: ${order.id}\n\n${order.items.map(x=>`${x.quantity} × ${x.name}`).join('\n')}\n\nName: ${c.name}\nPhone: ${c.phone}\nAddress / project location: ${c.address}\nNotes: ${c.notes||'None'}\n\nPlease confirm product specifications, pack sizes, availability and quotation.`;return{order:{id:order.id,status:order.status},whatsappUrl:`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`};}
export async function api(request,env){
 const url=new URL(request.url),path=url.pathname,method=request.method;
 if(!env.DB)return json({error:'Order storage is unavailable. Please try again shortly.'},503);
 if(!['GET','POST','PATCH'].includes(method))return json({error:'Method not allowed'},405);
 if(method!=='GET'&&request.headers.get('origin')!==url.origin)return json({error:'Invalid request origin.'},403);
 const ip=request.headers.get('cf-connecting-ip')||'local';
 try{
  if(path==='/api/admin/login'&&method==='POST'){
   if(await limited(env,`login:${await hash(ip)}`,8,900))return json({error:'Too many login attempts. Try again in 15 minutes.'},429);
   const data=await readBody(request);
   const credentials=env.DB.adminCredentials?await env.DB.adminCredentials({hash:env.ADMIN_PASSWORD_HASH,salt:env.ADMIN_PASSWORD_SALT}):{hash:env.ADMIN_PASSWORD_HASH,salt:env.ADMIN_PASSWORD_SALT};
   if(!credentials?.hash||!credentials?.salt)return json({error:'Admin access has not been configured.'},503);
   const password=typeof data.password==='string'&&data.password.length<=200?data.password:'';
   const key=await crypto.subtle.importKey('raw',encoder.encode(password),{name:'PBKDF2'},false,['deriveBits']);
   const derived=hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(credentials.salt),iterations:100000,hash:'SHA-256'},key,256));
   let mismatch=derived.length^credentials.hash.length;for(let i=0;i<derived.length;i++)mismatch|=derived.charCodeAt(i)^(credentials.hash.charCodeAt(i)||0);
   if(mismatch)return json({error:'Incorrect password.'},401);
   const token=hex(crypto.getRandomValues(new Uint8Array(32)));
   await query(env,'INSERT INTO sessions (token_hash,expires_at) VALUES (?,?)',await hash(token),Date.now()+28800000).run();
   await query(env,'DELETE FROM sessions WHERE expires_at < ?',Date.now()).run();
   return json({ok:true},200,{'Set-Cookie':sessionCookie(token,url.protocol==='https:')});
  }
  if(path.startsWith('/api/admin/')){
   const tokenHash=await session(request,env);if(!tokenHash)return json({error:'Please sign in.'},401);
   if(path==='/api/admin/logout'&&method==='POST'){await query(env,'DELETE FROM sessions WHERE token_hash = ?',tokenHash).run();return json({ok:true},200,{'Set-Cookie':sessionCookie('',url.protocol==='https:',0)});}
   if(path==='/api/admin/session'&&method==='GET')return json({ok:true});
   if(path==='/api/admin/orders'&&method==='GET'){
    const offset=Math.max(0,parseInt(url.searchParams.get('offset')||'0',10)||0);
    const result=await query(env,'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100 OFFSET ?',offset).all();
    const stats=await query(env,"SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS newOrders, SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed FROM orders").first();
    return json({orders:result.results.map(orderView),stats,nextOffset:result.results.length===100?offset+100:null});
   }
   if(/^\/api\/admin\/orders\/CC-[a-f0-9-]+$/.test(path)&&method==='PATCH'){
    const data=await readBody(request);if(!statuses.includes(data.status))return json({error:'Choose a valid status.'},400);
    const row=await query(env,'UPDATE orders SET status = ? WHERE id = ? RETURNING *',data.status,path.split('/').at(-1)).first();
    return row?json({order:orderView(row)}):json({error:'Order not found.'},404);
   }
   return json({error:'Not found'},404);
  }
  if(path==='/api/orders'&&method==='POST'){
   const data=await readBody(request);
   if(typeof data.requestId!=='string'||!/^[a-f0-9-]{36}$/.test(data.requestId))throw new Error('Invalid order request.');
   const customer={name:clean(data.customer?.name,100,true),phone:clean(data.customer?.phone,25,true),address:clean(data.customer?.address,600,true),notes:clean(data.customer?.notes||'',1000)};
   if(!/^[+0-9 ()-]{7,25}$/.test(customer.phone))throw new Error('Please enter a valid phone number.');
   if(!Array.isArray(data.items)||data.items.length<1||data.items.length>6)throw new Error('Your cart must contain 1 to 6 product families.');
   const seen=new Set();const items=data.items.map(x=>{const p=products.find(p=>p.id===x.id);if(!p||seen.has(x.id)||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>999)throw new Error('Please check your cart quantities.');seen.add(x.id);return{id:p.id,name:p.name,quantity:x.quantity};});
   const existing=await query(env,'SELECT * FROM orders WHERE request_id = ?',data.requestId).first();
   if(existing){if(existing.customer!==JSON.stringify(customer)||existing.items!==JSON.stringify(items))return json({error:'This request was already used. Refresh your cart and try again.'},409);return json(orderReply(existing));}
   if(await limited(env,`order:${await hash(ip)}`,20,3600))return json({error:'Too many orders. Please try again later.'},429);
   const id=`CC-${crypto.randomUUID()}`;
   await query(env,"INSERT INTO orders (id,request_id,created_at,status,customer,items) VALUES (?,?,?,'New',?,?) ON CONFLICT(request_id) DO NOTHING",id,data.requestId,Date.now(),JSON.stringify(customer),JSON.stringify(items)).run();
   const row=await query(env,'SELECT * FROM orders WHERE request_id = ?',data.requestId).first();
   if(row.customer!==JSON.stringify(customer)||row.items!==JSON.stringify(items))return json({error:'Conflicting order request.'},409);
   return json(orderReply(row),201);
  }
  return json({error:'Not found'},404);
 }catch(error){if(error instanceof SyntaxError||/Please|Invalid|Missing|Request|cart/.test(error.message))return json({error:error.message},400);console.error('Order API failed',error.name);return json({error:'Unable to complete the request. Please try again.'},500);}
}
export default {async fetch(request,env){
 if(new URL(request.url).pathname.startsWith('/api/'))return api(request,env);
 return env.ASSETS.fetch(request);
}};
