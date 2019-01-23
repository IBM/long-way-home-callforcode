import {loadMtcnnModel, loadFaceRecognitionModel} from 'face-api.js';

export const loadModels = async (context, addNotification) => {
  const modelBaseUrl = 'https://s3.eu-de.objectstorage.softlayer.net/long-way-home-models/';
  context.setState({modelsLoding: true}, () => {
    Promise.all(
      [loadMtcnnModel(modelBaseUrl), loadFaceRecognitionModel(modelBaseUrl)]
    ).then(() => {
      context.setState({modelsLoaded: true});
    }).catch((e)=>{
      addNotification("Error Loading Models", "", "", "error");
    }).finally(context.setState({modelsLoding: false}));
  });

}

export const postencoding = (encoding, photoData, addNotification) => {
  fetch(
    'api/encoding',
    {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(encoding)
    }
  )
  .then((r) => {
    if(r.status === 200){
      r.json()
      .then( (j) =>{
        fetch(j.uploadUrl, {
          method: 'PUT',
          headers: {"Content-Type": "image/jpeg"},
          body: photoData
        })
        .then((r) => {
          if(r.status === 200)
            addNotification("Upload success", "", "", "success");
          else
            addNotification("Upload Failed", "", "", "error");
        });
      });
    }
  });
}