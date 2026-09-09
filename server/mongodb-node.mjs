import { MongoClient, ServerApiVersion } from 'mongodb';
export async function mongoDatabase({ uri, username, password, database } = {}) {
  if (!uri) throw new Error('MONGODB_URI is required');
  const client = new MongoClient(uri, {
    serverApi: {version:ServerApiVersion.v1,strict:true,deprecationErrors:true},
    serverSelectionTimeoutMS:10000,
    maxPoolSize:5,
    ...(username && password ? { auth: { username, password } } : {})
  });
  try {
  await client.connect();
  await client.db('admin').command({ping:1});
  const db = client.db(database || new URL(uri).pathname.replace(/^\//, '') || 'cretechem');
  const orders=db.collection('orders'), sessions=db.collection('sessions'), limits=db.collection('limits'), admins=db.collection('admins');
  await Promise.all([orders.createIndex({request_id:1},{unique:true}),orders.createIndex({created_at:-1}),sessions.createIndex({expires_at:1},{expireAfterSeconds:0}),limits.createIndex({expires_at:1},{expireAfterSeconds:0}),sessions.createIndex({token_hash:1},{unique:true})]);
  await Promise.all([sessions,limits].map(collection=>collection.updateMany({expires_at:{$type:'number'}},[{$set:{expires_at:{$toDate:'$expires_at'}}}])));
  const prepare=sql=>({bind:(...values)=>{const run=async()=>{
    if(sql.startsWith('SELECT token_hash FROM sessions'))return await sessions.findOne({token_hash:values[0],expires_at:{$gt:new Date(values[1])}});
    if(sql.startsWith('INSERT INTO sessions')){await sessions.insertOne({token_hash:values[0],expires_at:new Date(values[1])});return{};}
    if(sql.startsWith('DELETE FROM sessions WHERE token_hash')){await sessions.deleteOne({token_hash:values[0]});return{};}
    if(sql.startsWith('DELETE FROM sessions WHERE expires_at')){await sessions.deleteMany({expires_at:{$lt:new Date(values[0])}});return{};}
    if(sql.startsWith('INSERT INTO limits')){
      const expired={$lt:[{$ifNull:['$expires_at',new Date(0)]},new Date(values[2])]};
      return limits.findOneAndUpdate({_id:values[0]},[{$set:{count:{$cond:[expired,1,{$add:['$count',1]}]},expires_at:{$cond:[expired,new Date(values[1]),'$expires_at']}}}],{upsert:true,returnDocument:'after'});
    }
    if(sql.startsWith('SELECT * FROM orders WHERE request_id'))return await orders.findOne({request_id:values[0]});
    if(sql.startsWith('SELECT * FROM orders ORDER BY'))return await orders.find({}).sort({created_at:-1,_id:-1}).skip(values[0]).limit(100).toArray();
    if(sql.startsWith('SELECT COUNT(*) AS total')){const [total,newOrders,completed]=await Promise.all([orders.countDocuments(),orders.countDocuments({status:'New'}),orders.countDocuments({status:'Completed'})]);return{total,newOrders,completed};}
    if(sql.startsWith('UPDATE orders SET status'))return await orders.findOneAndUpdate({id:values[1]},{$set:{status:values[0]}},{returnDocument:'after'});
    if(sql.startsWith('INSERT INTO orders')){try{await orders.insertOne({id:values[0],request_id:values[1],created_at:values[2],status:'New',customer:values[3],items:values[4]});}catch(e){if(e.code!==11000)throw e;}return{};}
    throw new Error('Unsupported MongoDB query');};return{first:run,all:async()=>({results:await run()}),run};}});
  return{prepare,close:()=>client.close(),async adminCredentials(seed){
    if(seed.hash&&seed.salt)await admins.updateOne({_id:'admin'},{$setOnInsert:{passwordHash:seed.hash,passwordSalt:seed.salt,createdAt:new Date()}},{upsert:true});
    const admin=await admins.findOne({_id:'admin'});
    return admin?{hash:admin.passwordHash,salt:admin.passwordSalt}:null;
  }};
  } catch(error) { await client.close(); throw error; }
}
