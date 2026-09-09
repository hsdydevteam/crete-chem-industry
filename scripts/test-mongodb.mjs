import assert from 'node:assert/strict';
import { MongoClient } from 'mongodb';
import { pbkdf2Sync } from 'node:crypto';
import { mongoDatabase } from '../server/mongodb-node.mjs';
import { api } from '../server/worker.js';
process.loadEnvFile('C:/Users/PC/Downloads/atlas-credentials.env');
process.loadEnvFile('.env.admin.local');
const database=`cc_test_${crypto.randomUUID().replaceAll('-','').slice(0,24)}`;
const options={uri:process.env.MONGODB_URI,username:process.env.MONGODB_USERNAME,password:process.env.MONGODB_PASSWORD,database};
const DB=await mongoDatabase(options);
const env={...process.env,DB};
const client=new MongoClient(options.uri,{auth:{username:options.username,password:options.password},serverSelectionTimeoutMS:10000});
await client.connect();
const db=client.db(database);
let cookie='';
const password=process.env.ADMIN_TEST_PASSWORD;
assert.ok(password,'Set ADMIN_TEST_PASSWORD for the login check');
assert.equal(pbkdf2Sync(password,env.ADMIN_PASSWORD_SALT,100000,32,'sha256').toString('hex'),env.ADMIN_PASSWORD_HASH,'Configured password must match requested password');
async function call(path,method='GET',body,ip='atlas-test'){
 return api(new Request('https://test.example'+path,{method,headers:{origin:'https://test.example','content-type':'application/json',cookie,'cf-connecting-ip':ip},...(body?{body:JSON.stringify(body)}:{})}),env);
}
try{
 assert.equal((await call('/api/admin/session')).status,401);
 assert.equal((await call('/api/admin/login','POST',{password:'incorrect'})).status,401);
 let response=await call('/api/admin/login','POST',{password});
 assert.equal(response.status,200);
 cookie=response.headers.get('set-cookie').split(';')[0];
 const admin=await db.collection('admins').findOne({_id:'admin'});
 assert.equal(admin.passwordHash,env.ADMIN_PASSWORD_HASH);
 assert.ok(!('password' in admin));
 // Mongo credentials remain authoritative after bootstrapping.
 delete env.ADMIN_PASSWORD_HASH;delete env.ADMIN_PASSWORD_SALT;
 assert.equal((await call('/api/admin/login','POST',{password})).status,200);
 const request={requestId:crypto.randomUUID(),customer:{name:'Integration test',phone:'03001234567',address:'Test location'},items:[{id:'coatings',quantity:2}]};
 response=await call('/api/orders','POST',request);assert.equal(response.status,201);
 const saved=await response.json();assert.ok(saved.whatsappUrl.startsWith('https://wa.me/923008548956?text='));
 assert.equal((await call('/api/orders','POST',request)).status,200);
 response=await call('/api/admin/orders');assert.equal(response.status,200);
 const listing=await response.json();assert.equal(listing.orders.length,1);assert.equal(listing.orders[0].id,saved.order.id);
 response=await call(`/api/admin/orders/${saved.order.id}`,'PATCH',{status:'Completed'});assert.equal(response.status,200);
 assert.equal((await (await call('/api/admin/orders')).json()).stats.completed,1);
 assert.ok((await db.collection('sessions').findOne({})).expires_at instanceof Date);
 const attempts=await Promise.all(Array.from({length:10},()=>call('/api/admin/login','POST',{password:'wrong'},'concurrent-test')));
 assert.equal(attempts.filter(r=>r.status===429).length,2);
 await call('/api/admin/logout','POST',{});assert.equal((await call('/api/admin/session')).status,401);
 console.log('Atlas passed: password hash, password-only login, sessions, order save/list/status, duplicate protection, WhatsApp destination, concurrent rate limiting, logout.');
}finally{
 await DB.close();
 if(!/^cc_test_[a-f0-9]{24}$/.test(database))throw new Error('Invalid test database');
 await db.dropDatabase();await client.close();
}
