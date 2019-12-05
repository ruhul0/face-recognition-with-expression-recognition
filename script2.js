const video = document.getElementById('video') //assigning the uploaded image into imageUpload

//adding models
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/f/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/f/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/f/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/f/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/f/models')
]).then(startVideo)
function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
video.addEventListener('play', () => {


    let image
    var name = ['']
    let expression
    let angry
    let disgusted
    let fearful
    let happy
    let neutral
    let sad
    let surprised
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        const labeledFaceDescriptors = await loadLabeledImages() //it'll call the image with label those are in folder
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6) //load the face to match
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        expression = resizedDetections[0].expressions
           //console.log(resizedDetections2[0].expressions)
    resizedDetections2.forEach((result2,i) => {
        //console.log(resizedDetections2[i])
        console.log(result2.expressions) //showing the expressions result in console
        //console.log(result2.expressions) //showing the expressions result in console
        expression = result2.expressions
      }
      )
      results.forEach((result, i) => {
        name = result.toString()
        console.log(name)
        //console.log(result.toString()) //showing result in console. showing the name
        const box = resizedDetections[i].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
  
        drawBox.draw(canvas)
      })
      function loadLabeledImages() {
        const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark','Ruhul'] //add new lebeled folder here
        return Promise.all(
          labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
              //fetching data from online. you can replace this with local directory
              const img = await faceapi.fetchImage(`/f/labeled_images/${label}/${i}.jpg`) 
              const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
              descriptions.push(detections.descriptor)
            }
      
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
          })
        )
      }
    }, 100)
  })
//function start 
async function start() {

  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {

    //console.log(results)
    

    
    var i = 0
    while(name[i] != null){
      console.log(name[i])
      i++
    }
    
    var i = 0
    //container.append(image)
    container.append(canvas)
    const detections2 = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections2 = faceapi.resizeResults(detections2, displaySize)
    //console.log(resizedDetections2[0].expressions)
    resizedDetections2.forEach((result2,i) => {
      //console.log(resizedDetections2[i])
     // console.log(result2.expressions) //showing the expressions result in console
     alert('here')
      expression = result2.expressions
      //name2 = results.toString()
    //}
    //)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections2)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections2)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections2)
    //const results2 = resizedDetections2.map(d => faceMatcher.findBestMatch(d.descriptor))
    //expression = resizedDetections2[0].expressions
    //insert(name,expression)
    
    console.log(expression)
    angry = expression.angry
    disgusted = expression.disgusted
    fearful = expression.fearful
    happy = expression.happy
    neutral = expression.neutral
    sad = expression.sad
    surprised = expression.surprised
    let express
   // let i=0;
    if(angry<1.0 && angry > 0.90){
      express = "Angry"
    } else if(disgusted<1.0 && disgusted > 0.90){
      express ="Disgusted"
    } else if(fearful<1.0 && fearful > 0.90){
      express = "Fearful"
    } else if(happy<1.0 && happy > 0.90){
      express = "Happy"
    } else if(neutral<1.0 && neutral > 0.90){
      express = "Neutral"
    } else if(sad<1.0 && sad > 0.90){
      express = "Sad"
    } else if(surprised<1.0 && surprised > 0.90){
      express = "Surprised"
    }
    else{
      express = "Unknown"
    }
    insert(name[i],express,angry,disgusted,fearful,happy,neutral,sad,surprised)
  })
})

}


//api call to pass data to php page
//function insert(name,expression) {
  function insert(name,express,angry,disgusted,fearful,happy,neutral,sad,surprised) {
$.ajax({
  type: 'POST',
  url: 'insert.php',
  data: {
      name:name,
      express:express,
      angry:angry,
      disgusted:disgusted,
      fearful:fearful,
      happy:happy,
      neutral:neutral,
      sad:sad,
      surprised:surprised
  },
  error: function (xhr, status) {
      alert(status);
  },
  success: function(response) {
      alert(response);
      //alert("Status Accepted");
      //alert(response);
      //location.reload();
  }
});
}