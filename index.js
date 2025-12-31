import express from "express";
import cors from "cors";
import fs from "fs";

// import { promisify } from "node:util";
import child_process from "node:child_process";
// const exec = promisify(child_process.exec);
const spawn = child_process.spawn


const app = express();
app.use(express.json());
app.use(cors());

const execute =  (command, args, input) => {
  
  return new Promise((resolve, reject)=>{
      const compile = spawn(command, args);

  compile.stdin.write(input || "");
  compile.stdin.end();

  let stdout = "";
  let stderr = "";

  compile.stdout.on("data", (data) => {
    stdout += data.toString();
  });
  compile.stderr.on("data", (data) => {
    stderr += data.toString();
  });
  
  compile.on('close',()=>{
    resolve({stdout,stderr})
  })
  compile.on('error',err=>{
    reject({stdout, stderr : err.message})
  })})
};

const handle_language = async (language, code, input) => {
  if (language === "python") {
    fs.writeFileSync("main.py", code);
    return await execute("python3", ["main.py"], input);
  } else if (language === "cpp") {
    fs.writeFileSync("main.cpp", code);
    
    const compile = await execute("g++", ["main.cpp", "-o", "main"], "");
    if (compile.stderr) return compile; 

    return await execute("./main", [], input);
  } else if (language === "javascript") {
    fs.writeFileSync("main.js", code);
    return await execute("node", ["main.js"], input);
  }
};

app.post("/compile/:language", async (req, res) => {
  const { language } = req.params;

  const { code, input } = req.body;

  try {
    const result = await handle_language(language, code, input);
    if (!result) {
      return res.status(400).json({ stdout: "", stderr: "Unsupported language" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ stdout: "", stderr: err.stderr || err.message });
  }
});

app.listen(3000, () => {
  console.log("app started in port 3000");
});
