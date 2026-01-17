const crypto = require('crypto');

class ObfuscatorEngine {
  constructor() {
    this.variableMap = new Map();
    this.functionMap = new Map();
    this.stringMap = new Map();
    this.counter = 0;
  }

  obfuscate(code, options = {}) {
    const {
      level = 3,
      stringEncryption = true,
      variableRenaming = true,
      antiDebug = true,
      antiTamper = true,
      watermark = '-- Obfuscated with ShinraGuard'
    } = options;

    this.resetMaps();
    let result = code;

    result = this.addWatermark(result, watermark);
    
    if (antiDebug) {
      result = this.addAntiDebug(result);
    }
    
    if (antiTamper) {
      result = this.addAntiTamper(result);
    }

    for (let i = 0; i < level; i++) {
      if (variableRenaming) {
        result = this.renameVariables(result);
      }
      
      if (stringEncryption) {
        result = this.encryptStrings(result);
      }
      
      result = this.obfuscateLogic(result);
      result = this.addJunk(result);
    }

    result = this.addVMProtection(result, level);
    
    return {
      code: result,
      compressionRatio: 0,
      variables: this.variableMap.size,
      functions: this.functionMap.size,
      strings: this.stringMap.size
    };
  }

  addWatermark(code, watermark) {
    return `${watermark}\n-- Obfuscated Code - ShinraGuard Protection\n${code}`;
  }

  addAntiDebug(code) {
    const antiDebugCode = `
local AntiDebug = {}
AntiDebug.Detected = false
function AntiDebug:Check()
  if debug.traceback then
    self.Detected = true
    error("Debug detected - Script terminated")
  end
  if debug.getlocal then
    self.Detected = true
    error("Debug detected - Script terminated")
  end
end
AntiDebug:Check()
`;
    return antiDebugCode + code;
  }

  addAntiTamper(code) {
    const antiTamperCode = `
local OriginalCode = "${this.hashCode(code)}"
local CurrentCode = game:GetService("HttpService"):JSONEncode(_G)
if string.sub(CurrentCode, 1, 1) ~= string.sub(OriginalCode, 1, 1) then
  error("Code tampering detected - Script terminated")
end
`;
    return antiTamperCode + code;
  }

  renameVariables(code) {
    let obfuscated = code;
    
    const varPattern = /local\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    const matches = [...code.matchAll(varPattern)];
    
    matches.forEach(match => {
      const oldName = match[1];
      if (!this.variableMap.has(oldName)) {
        const newName = `_${this.generateHash(oldName)}`;
        this.variableMap.set(oldName, newName);
      }
    });

    this.variableMap.forEach((newName, oldName) => {
      const regex = new RegExp(`\\b${oldName}\\b`, 'g');
      obfuscated = obfuscated.replace(regex, newName);
    });

    return obfuscated;
  }

  encryptStrings(code) {
    let obfuscated = code;
    const stringPattern = /["']([^"']*)["']/g;
    const matches = [...code.matchAll(stringPattern)];

    matches.forEach(match => {
      const original = match[0];
      const stringContent = match[1];
      
      if (!this.stringMap.has(stringContent)) {
        const encrypted = this.encryptString(stringContent);
        this.stringMap.set(stringContent, encrypted);
      }
      
      const encrypted = this.stringMap.get(stringContent);
      obfuscated = obfuscated.replace(original, `(function()local _=${encrypted};return _;end)()`);
    });

    return obfuscated;
  }

  encryptString(str) {
    const key = crypto.randomBytes(16).toString('hex');
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'hex'), Buffer.alloc(16, 0));
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `"${encrypted}"`; 
  }

  obfuscateLogic(code) {
    let obfuscated = code;
    
    obfuscated = obfuscated.replace(/if\s+(.+?)\s+then/g, (match, condition) => {
      return `if (${condition}) then`;
    });
    
    obfuscated = this.addControlFlowFlatten(obfuscated);
    
    return obfuscated;
  }

  addControlFlowFlatten(code) {
    return code.split('\n').map(line => {
      if (line.trim().length === 0) return line;
      const indent = line.match(/^\s*/)[0];
      return indent + `do ${line.trim()} end`;
    }).join('\n');
  }

  addJunk(code) {
    const junkLines = [
      `local _${this.counter++} = math.random()`,
      `local _${this.counter++} = {} for i=1,100 do table.insert(_${this.counter-1}, i) end`,
      `local _${this.counter++} = function() return 0 end`,
      `local _${this.counter++} = string.char(65, 66, 67)`
    ];
    
    const randomJunk = junkLines[Math.floor(Math.random() * junkLines.length)];
    return code + '\n' + randomJunk;
  }

  addVMProtection(code, level) {
    if (level < 4) return code;
    
    const vmCode = `
local VM = {}
VM.Bytecode = "${Buffer.from(code).toString('base64')}"
VM.Decoder = function(b)
  return string.char(bit32.bxor(b, 0xFF))
end
VM.Execute = function(self)
  local decoded = ""
  for i=1,#self.Bytecode do
    decoded = decoded .. self.Decoder(string.byte(string.sub(self.Bytecode, i, i)))
  end
  return loadstring(decoded)()
end
return VM:Execute()
`;
    return vmCode;
  }

  generateLoader(obfuscatedCode, options = {}) {
    const {
      blockBrowser = true,
      onlyRobloxExecutor = true,
      encryption = 'AES-256'
    } = options;

    const encryptedCode = Buffer.from(obfuscatedCode).toString('base64');
    
    const loaderCode = `
${blockBrowser ? `
if not game or not game:GetService then
  error("ShinraGuard Loader: Browser access denied. This script can only be executed in Roblox.")
  return
end

if _G.EXECUTION_TYPE and _G.EXECUTION_TYPE:lower() == "browser" then
  error("ShinraGuard Loader: Browser executors are not allowed.")
  return
end
` : ''}

local ShinraLoader = {}
ShinraLoader.EncryptedCode = "${encryptedCode}"
ShinraLoader.Version = "1.0.0"
ShinraLoader.Protected = true

function ShinraLoader:Decrypt()
  return game:GetService("HttpService"):DecodeJson(game:GetService("HttpService"):DecodeJson(self.EncryptedCode))
end

function ShinraLoader:Verify()
  ${onlyRobloxExecutor ? `
  if getgenv then
    local executor_name = identifyexecutor and identifyexecutor() or "unknown"
    local allowed_executors = {"Synapse", "Script-Ware", "Deltaexe", "Calamari", "Fluxus", "Oxygen-U"}
    local is_allowed = false
    for _, name in ipairs(allowed_executors) do
      if string.find(executor_name:lower(), name:lower()) then
        is_allowed = true
        break
      end
    end
    if not is_allowed and executor_name ~= "unknown" then
      error("ShinraGuard: Your executor is not supported")
      return false
    end
  end
  ` : ''}
  return true
end

function ShinraLoader:Execute()
  if not self:Verify() then
    return
  end
  local code = game:GetService("HttpService"):DecodeJson(self.EncryptedCode)
  local fn = loadstring(code)
  if fn then
    fn()
  end
end

ShinraLoader:Execute()
`;
    return loaderCode;
  }

  hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex').substring(0, 16);
  }

  generateHash(str) {
    return crypto.createHash('md5').update(str + Math.random()).digest('hex').substring(0, 8);
  }

  resetMaps() {
    this.variableMap.clear();
    this.functionMap.clear();
    this.stringMap.clear();
    this.counter = 0;
  }
}

module.exports = ObfuscatorEngine;
