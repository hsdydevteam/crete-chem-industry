import { api } from '../server/worker.js';
import { mongoDatabase } from '../server/mongodb-node.mjs';

let databasePromise;
function database() {
  if (!databasePromise) databasePromise = mongoDatabase({
    uri: process.env.MONGODB_URI,
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE
  }).catch(error => { databasePromise = undefined; throw error; });
  return databasePromise;
}

async function bodyBuffer(req) {
  if (req.body !== undefined) {
    const body=Buffer.isBuffer(req.body)?req.body:Buffer.from(typeof req.body==='string'?req.body:JSON.stringify(req.body));
    if(body.length>16000)throw new Error('Request is too large.');
    return body;
  }
  const chunks=[]; let size=0;
  for await (const chunk of req) { size += chunk.length; if (size > 16000) throw new Error('Request is too large.'); chunks.push(chunk); }
  return Buffer.concat(chunks);
}

export default async function handler(req,res) {
  try {
    const body=['GET','HEAD'].includes(req.method)?undefined:await bodyBuffer(req);
    const headers=new Headers();
    for(const [key,value] of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(', '):value);
    headers.set('cf-connecting-ip',req.headers['x-vercel-forwarded-for']?.split(',')[0]?.trim()||req.socket?.remoteAddress||'local');
    const request=new Request(`https://${req.headers.host||'localhost'}${req.url}`,{method:req.method,headers,...(body?.length?{body}:{})});
    const response=await api(request,{...process.env,DB:await database()});
    res.statusCode=response.status; response.headers.forEach((value,key)=>res.setHeader(key,value)); res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    const causes=Array.from(error?.reason?.servers?.values?.()||[]).map(server=>({name:server.error?.name,code:server.error?.cause?.code||server.error?.code}));
    console.error('Vercel API failed',error?.name||'Error',JSON.stringify(causes)); res.statusCode=503; res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store'); res.end(JSON.stringify({error:'Order storage is temporarily unavailable. Please try again.'}));
  }
}

export const config={api:{bodyParser:false}};
