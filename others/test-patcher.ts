import { patch, unpatch } from "../src/patcher";
import { detect } from "../src/detect";

const { framework } = detect("C:/projects/contextgap");

console.log("Patching...");
const result = patch(framework, "myapp", "C:/projects/contextgap");
console.log(result);

// Check the config file manually — you should see allowedDevOrigins added

// Then unpatch
console.log("Unpatching...");
unpatch(framework, "C:/projects/contextgap");

// Check config again — line should be gone
