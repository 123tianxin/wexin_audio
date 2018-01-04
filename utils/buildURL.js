
function getAudioURL(audioName){
  let prefix = "http://118.89.63.139/wangsg/audio/"
  let suffix = "_audio.mp3"
  
  return prefix + audioName + suffix
}

function getImageURL(imageName){
  let prefix = "http://118.89.63.139/wangsg/image/"
  let suffix = "_img.jpg"

  return prefix + imageName + suffix
}

module.exports = {
  getAudioURL: getAudioURL,
  getImageURL: getImageURL
}