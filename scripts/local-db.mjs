import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
export function localDatabase(filename='.local/orders.sqlite'){
 if(filename!==':memory:')mkdirSync('.local',{recursive:true});
 const db=new DatabaseSync(filename);db.exec('PRAGMA journal_mode=WAL');
 db.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
 for(const name of readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort()){
  if(!db.prepare('SELECT name FROM local_migrations WHERE name = ?').get(name)){
   db.exec('BEGIN');try{db.exec(readFileSync(`drizzle/${name}`,'utf8'));db.prepare('INSERT INTO local_migrations VALUES (?)').run(name);db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
  }
 }
 const prepare=sql=>({bind(...values){const statement=db.prepare(sql);return{async first(){return statement.get(...values)||null;},async all(){return{results:statement.all(...values)};},async run(){return statement.run(...values);}};}});
 return{prepare,close:()=>db.close()};
}
