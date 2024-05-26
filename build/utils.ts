import { exec } from 'child_process';
import  {promisify} from 'util';

function makeid(length) {
  let result           = '';
  const characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function getGitRevision() {
  if (process.env.GIT_HASH) {
    return process.env.GIT_HASH;
  }
  try {
    const { stdout, stderr } = await promisify(exec)('git rev-parse --short=10 HEAD', {encoding: 'utf8'});
    return stdout.trim();
  } catch (e) {
    console.error(e)
    let result = `_${makeid(9)}`;
    console.log(`Git hash is unavailable, mocking with randoms string ${result}`);
    return result
  }
}

export async function getConsts() {
  const env = process.env.VITE_BUILD_ENV || 'local';
  console.log(`Using ${env}.json`)
  const result = JSON.parse(JSON.stringify(await import(`./${env}.json`)));
  Object.keys(result).forEach(k => {
    if (typeof result[k] === 'string' && result[k].startsWith("@@")) {
      const envVarName = result[k].substring(2);
      result[k] = process.env[envVarName]
      console.log(`Replacing ${k} ${envVarName} = ${result[k]}`);
    }
  })
    if (!result.GIT_HASH) {
    result.GIT_HASH =  await getGitRevision();
  }
  return result;
}
