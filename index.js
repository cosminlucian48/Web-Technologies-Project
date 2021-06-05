const express = require ('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const ejs=require('ejs');
const { exec } = require("child_process");

const {Client} = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'cosmin',
  password: '123qweasd',
  database: 'skydiving_tw',
  port:5432
});

client.connect((err) => {
  if (err) throw err;
  console.log('conectat boss!');
});






const app = express();  //obiectul server

app.set("view engine","ejs");

app.get("*/galerie.json",function(req,res){
    res.setHeader("Content-Type","text/html");
    res.status(403).render("pagini/403");
});
app.use("/resurse", express.static(path.join(__dirname,"resurse")));

var rNr = Math.floor(Math.random() * 9 / 2) * 2 + 6;

var month = new Array();
  month[0] = "ianuarie";
  month[1] = "februarie";
  month[2] = "martie";
  month[3] = "aprilie";
  month[4] = "mai";
  month[5] = "iunie";
  month[6] = "iulie";
  month[7] = "august";
  month[8] = "septembrie";
  month[9] = "octombrie";
  month[10] = "noiembrie";
  month[11] = "decembrie";

  

function verificaImagini(){
    var textFisier = fs.readFileSync("resurse/json/galerie.json")
    var jsi = JSON.parse(textFisier);
    var caleGalerie = jsi.cale_galerie;
    
    //luna actuala
    var dataActuala = new Date();
    var lunaActuala = dataActuala.getMonth();

    let vectorCai=[];
    let counter = 0;
    let ok=0;
    
    for( let im of jsi.imagini){
        var imVeche = path.join(caleGalerie, im.fisier);
        var ext = path.extname (im.fisier);
        var numeFisier = path.basename(im.fisier, ext);
        let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-350"+".webp");
        
        for (let dat of im.luni){
            if(dat == month[lunaActuala+2]){ //iunie are 9, mai 19, nov 0
                vectorCai.push({mare:"/"+imVeche, mic:"/"+imMica,mediu:"/"+imMedie, titlu:im.titlu, alt:im.alt, descriere:im.descriere, cr:im.cr, cr_link:im.cr_link});
                
                vectorCai.push({mare:" ", mic:"",mediu:"", titlu:"", alt:"", descriere:"", cr:""})
                counter+=1;
                
            }
        }
        
        if(!fs.existsSync(imMica))
        sharp(imVeche)
            .resize(200)
            .toFile(imMica, function(err){
                if(err)
                console.group("eroare conversie", imVeche, "->",imMica, err);
            });
        if(!fs.existsSync(imMedie))
        sharp(imVeche)
            .resize(350)
            .toFile(imMedie, function(err){
                if(err)
                console.group("eroare conversie", imVeche, "->",imMedie, err);
            });

            
        if(counter==12){
                
            break;
        }
        
    }
    
    
    if(counter!=6 && counter !=12){
        console.log(counter)
        if (counter<6)
            return []
        else
            while(counter>6){
                counter--;
                vectorCai.pop();
                vectorCai.pop();
            }
    }
   
        return vectorCai;

}


function verificaImagini2(numar_max){
    var textFisier = fs.readFileSync("resurse/json/galerie.json")
    var jsi = JSON.parse(textFisier);
    var caleGalerie = jsi.cale_galerie;
    //luna actuala
    var dataActuala = new Date();
    var lunaActuala = dataActuala.getMonth();
    let vectorCai=[];
    let counter = 0;
    for( let im of jsi.imagini){
        var imVeche = path.join(caleGalerie, im.fisier);
        var ext = path.extname (im.fisier);
        var numeFisier = path.basename(im.fisier, ext);
        let imMica = path.join(caleGalerie+"/mic/", numeFisier+"-200"+".webp");
        let imMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-350"+".webp");
        
        if(counter%2==0){
            vectorCai.push({mare:"/"+imVeche, mic:"/"+imMica,mediu:"/"+imMedie, titlu:im.titlu, alt:im.alt, descriere:im.descriere});

        }     
        counter+=1;
        if(!fs.existsSync(imMica))
        sharp(imVeche)
            .resize(200)
            .toFile(imMica, function(err){
                if(err)
                console.group("eroare conversie", imVeche, "->",imMica, err);
            });
        if(!fs.existsSync(imMedie))
        sharp(imVeche)
            .resize(350)
            .toFile(imMedie, function(err){
                if(err)
                console.group("eroare conversie", imVeche, "->",imMedie, err);
            });

        
        if(counter==2*numar_max)
            break;
        
    }
    return vectorCai;

}

app.get(["/","/index"],function(req, res){
    
    res.render("pagini/index", {imagini: verificaImagini(), ip:req.ip}); 
});




app.get("*/galerie-animata.css",function(req, res){
    
    /*Atentie modul de rezolvare din acest app.get() este strict pentru a demonstra niste tehnici
    si nu pentru ca ar fi cel mai eficient mod de rezolvare*/
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resurse/scss/galerie_animata.scss").toString("utf-8");//citesc scss-ul cs string
    console.log(rNr);
    
   
    //transmit nr de poze
    let rezScss=ejs.render(sirScss,{nrPoze:rNr});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
    
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        console.log(`stdout: ${stdout}`);
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });
    

});

app.get("/galery",function(req, res){
    let vectorCai = verificaImagini();
    res.render( "pagini/galery",{imagini:vectorCai}); //numele obiectului este locals, ex locals.a  / locals['a']
});

app.get("/animation",function(req, res){
    rNr = Math.floor(Math.random() * 9 / 2) * 2 + 6;
    console.log(rNr);
    let vectorCai2 = verificaImagini2(rNr);
    res.render( "pagini/animation",{imagini:vectorCai2}); //numele obiectului este locals, ex locals.a  / locals['a']
});

app.get("/products",function(req,res){
    console.log(req.url);
    console.log("Query:", req.query.type);

    var conditie = req.query.type ? " and type='"+req.query.type+"'": "";
    //console.log( "select id,brand,model,price,imag,description,type,date_man, material, sizes, free_altimeter from canopies where 1=1 " + conditie);
    client.query("select id,brand,model,price,imag,description,type, to_char(date_man,'Day DD Month YYYY ') as dm,extract(DAY from date_man) as dy,extract(MONTH from date_man) as mon, extract (YEAR from date_man) as yr, material, sizes, free_altimeter,color from canopies where 1=1 " + conditie, function(err, rez){
        client.query("Select unnest(enum_range(null::material_canopie)) as mats", function(err,rezMats){ //'zi_saptamana, zi nume_luna an', de exemplu Sambata 15 Septembrie 2018
            //console.log(rezMats.rows);
            res.render( "pagini/products",{produse:rez.rows, materials:rezMats.rows});
        });
        
        
    } );
    
});

app.get("/product/:id_product",function(req,res){
    
     const rezultat = client.query("select *,to_char(date_man,'Day DD Month YYYY ') as dm  from canopies where id="+req.params.id_product, function(err, rez){
         
         res.render( "pagini/product",{prod:rez.rows[0]});
     } );
    
});



app.get("/*",function(req,res){
    console.log(req.url);
    res.render("pagini"+req.url, function(err, rezultatulRender){
        
       if(err){
           if(err.message.includes("Failed to lookup view")){
            res.status(404).render("pagini/404")
           }
           else 
            throw err;
       }
       else 
            res.send(rezultatulRender);
    });
})


app.listen(8080);
console.log("A pornit serverul.");