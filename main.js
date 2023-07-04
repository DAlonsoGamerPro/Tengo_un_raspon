objects = [];
status = "";

function setup()
{
    canvas = createCanvas(380,380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380,380);
    video.hide();
}

function modelLoaded()
{
    console.log("Modelo cargado!");
    status = true;
}

function start()
{
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detectando objetos";
    object_name = document.getElementById("tag").value;
}

function gotResult(error,results)
{
    if(error)
    {
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function draw()
{
    image(video,0,0,380,380);
    if(status != "")
    {
        objectDetector.detect(video,gotResult);
        for(i = 0; i <objects.length; i++)
        {
            document.getElementById("status").innerHTML = "Estado: Objeto Detectado!";
            fill("#00ffff");
            percent = floor(objects[i].confidence*100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("#00ffff");
            rect(objects[i].x,objects[i].y,objects[i].width,objects[i].height);

            if(objects[i].label == object_name)
            {
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("object_status").innerHTML = "¡" + object_name + " Encontrado!";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(object_name + "encontrado");
                synth.speak(utterThis);
            }
            else
            {
                document.getElementById("object_status").innerHTML = object_name + "No encontrado :´(";
            }
        }
    }
}