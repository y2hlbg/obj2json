const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const path = args.path
if(!path.endsWith('.obj')) {
  console.log('Can only deal with the obj model')
  return
}
const outputName = path.slice(0, -3) + 'json'
try {
  const data = fs.readFileSync(path, 'utf8')
  const lines = data.split(/\r?\n/);
  let position = []
  let uv = []
  let result = []
  lines.forEach((line) => {
    if(line.startsWith('v ')) {
      let [x, y, z] = line.substr(2).split(' ')
      position.push({x: Number(x), y: Number(y), z: Number(z)})
    }
    if(line.startsWith('vt ')) {
      let [u, v] = line.substr(3).split(' ')
      uv.push({u: Number(u), v: Number(v)})
    }
    if(line.startsWith('f ')) {
      let faceArr = line.substr(2).split(' ')
      faceArr.forEach((item) => {
        let [positionIndex, uvIndex] = item.split('/')
        if (!result[Number(positionIndex)]) {
          result[Number(positionIndex)] = {
            'position': position[Number(positionIndex)],
            'uv': uv[Number(uvIndex)]
          }
        }

      })
    }
  });
  let r = result.filter(item => {
    if(item && item.position && item.position.x && item.position.y && item.position.z && item.uv && item.uv.u  && item.uv.v ) return true
    return false
  })
  let Str_ans = JSON.stringify(r)
  fs.writeFile(outputName, Str_ans, 'utf8', (err) => {
    if (err) throw err;
    console.log('done');
  });
  // console.log(r)
} catch (err) {
  console.error(err)
}