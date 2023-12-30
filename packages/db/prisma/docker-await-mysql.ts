import * as mysql from "mysql2/promise";

const connect = async () => {
  const pool = mysql.createPool({
    host: "localhost",
    user: "docker",
    password: "docker",
    database: "docker",
    port: 1527,
  });

  try {
    await pool.execute("SELECT 1336 + 1 AS solution");
  } catch {
    console.log("The database is not running, please wait while it starts.");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await pool.execute("SELECT 1336 + 1 AS solution");
  }
  console.log("The database is running");
  await pool.end();
};

async function main() {
  try {
    await connect();
  } catch (err) {
    console.log(
      "This must be your first time running the docker image, please wait while the mysql instance is installed.",
    );
    await new Promise((resolve) => setTimeout(resolve, 20000));
    await connect();
  }
}

main().catch((err) => {
  console.error(err);
});
