const args = Bun.argv.slice(2);

const [command, ...rest] = args;

if (command === "greet") {
  if (rest.length === 0) {
    console.error("Error: Please provide a name, Use greet <name>");
    process.exit(1);
  }
  console.log(`Hello, ${rest[0]}!`);
} else if (!command) {
  console.error("Error: No command provided");
  process.exit(1);
} else {
  console.error(`Unknown command: "${command}"`);
  process.exit(1);
}
