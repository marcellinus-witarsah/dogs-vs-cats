// JavaScript Code

// ! constants
const WIDTH = 150;
const LENGTH = 150;

// variables
let uploadImage = document.querySelector('input');
let preview = document.querySelector('.preview');
let predictBtn  = document.querySelector('.inference-btn')
let predictResult = document.querySelector('.inference-result')

// ! adding event listener if the file 
uploadImage.addEventListener('change', updateImagePreview);
predictBtn.addEventListener('click', predict);

// create async function for model initialization
async function initializeModel(){
    model = await tf.loadGraphModel('http://127.0.0.1:5500/js_models/vgg16_ver_4/model.json');
}
// initialize model immediately
initializeModel();

// ! function for updating image preview after file is submitted
function updateImagePreview(){
    console.log('masuk')
    let files = uploadImage.files
    if (files.length === 0){
        console.log('file is empty')
    }
    else{
        preview.innerHTML = ''
        let img = document.createElement('img');
        for (let file of files){
            img.src = URL.createObjectURL(file);
            img.width = 50
            img.id = 'preview_img'
            preview.appendChild(img)
        }
    }
}

// ! predict the input image
async function predict(){
    // get the image element
    let img = document.getElementById('preview_img')
    // resize the image and adding extra dimension
    let tensorImg = tf.browser.fromPixels(img).resizeNearestNeighbor([WIDTH, LENGTH]).toFloat().expandDims();
    // normalize the image pixel values
    let normTensorImg = tensorImg.div(255);
    let prediction = await model.predict(normTensorImg).data();
    let alertText = ''
    console.log(prediction)
    if (prediction[0] <= 0.1) {
        alertText = `Cat with ${((1-prediction[0]) * 100)}% confidence`;
    } else if (prediction[0] >= 0.9) {
        alertText = `Dog with ${(prediction[0] * 100)}% confidence`;
    } else {
        alertText = "This is Something else";
    }
    alert(alertText)
}





