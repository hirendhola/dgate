import { register, getPort, list } from "./src/registry";

await register("myapp", 3000);
await register("api", 3001);

list();

console.log("getPort myapp:", getPort("myapp"));
console.log("getPort unknown:", getPort("unknown"));

list();
