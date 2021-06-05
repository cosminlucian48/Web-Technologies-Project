


window.addEventListener("load",function(){
    
    
    var checkDiv =false;
    
    let btn = document.getElementById("filtreaza");
    
    var thisYear= new Date().getFullYear();

    var rng=document.getElementById("price_canopy");
    if(rng!=null){
        rng.parentNode.insertBefore(document.createTextNode(rng.min),rng);
        rng.parentNode.appendChild(document.createTextNode(rng.max));
        let spval=document.createElement("span");
        rng.parentNode.appendChild(spval)
        rng.value=rng.max;
        spval.innerHTML=" ("+rng.value+")";
        rng.onchange=function(){
            spval.innerHTML=" ("+this.value+")";
        }
    }
    btn.onclick = function(){
        let priceMax = document.getElementById("price_canopy").value;
        
        let products = document.getElementsByClassName("product");

        let materialVal = document.getElementById("sel_simplu").value;
        
        let descriptionVal = document.getElementById("description_canopy").value;

        let nameVal = document.getElementById("name_canopy").value;

        let colorVal = document.getElementById("sel_multiplu").options;
        let colors = [];
        for(let opt of colorVal){
            if(opt.selected){
                colors.push(opt.innerHTML)
            }
        }
        let altiVal = null;
        let radioVal = document.getElementsByName("gr_rad");
        
        for(let rad of radioVal){
            if(rad.checked){
                altiVal = rad.value;
            }
        }
        if(altiVal==null){
            return alert("You need to check one radio button.");
        }
        
        
        let chkVal = document.getElementById("date_canopy");
        
        
        
        
        for ( let prod of products){
            prod.style.display="none";
            // se returneaza o colectie din care luam primul / singurul elem
            //let load = parseFloat(prod.getElementsByClassName("price")[0].innerHTML);
            //let conditie1=price<priceMax;

            let price = parseFloat(prod.getElementsByClassName("val_price")[0].innerHTML);
            let conditie1=price<priceMax;

            let mat = prod.getElementsByClassName("val_material")[0].innerHTML;
            let conditie2= (mat==materialVal|| materialVal=="all");
            console.log(mat, materialVal);

            let desc = prod.getElementsByClassName("val_description")[0].innerHTML;
            let conditie3 = desc.includes(descriptionVal)

            let name =[prod.getElementsByClassName("val_brand")[0].innerHTML,prod.getElementsByClassName("val_model")[0].innerHTML ];
            let conditie4 = (name[0].startsWith(nameVal) || name[1].startsWith(nameVal))
            
            let color = prod.getElementsByClassName("val_color")[0].innerHTML;
            let conditie5 = true;
            if(colors.length!=0){
                conditie5=false;
                for(let c of colors){
                    if(color.includes(c)){
                        conditie5=true;
                        break;
                    }
                }
            }
            let conditie6 = true;
            let alti = prod.getElementsByClassName("val_free_alti")[0].innerHTML;
            if(alti == "true"){
                alti = true;
            }
            else {
                alti = false;
            }
            if(altiVal == 1){
                conditie6 = true;
            }
            else if(altiVal ==2) {conditie6 = alti;}
            else {conditie6 = !alti}
            
            let yearVal = prod.getElementsByClassName("val_time")[0].dateTime.slice(0,4);
            //console.log("2->",yearVal)
            let conditie7 = true;
            //console.log(thisYear.toString(),yearVal)
            if(chkVal.checked){
                conditie7 = thisYear.toString() == yearVal;
            }
            
            let conditieTotala = conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6 && conditie7;
            //console.log("conditii:",conditieTotala,conditie1,conditie2,conditie3,conditie4,conditie5, conditie6, conditie7)
            //console.log(conditieTotala, conditie1, conditie2, mat, material);
            if(conditieTotala){
                prod.style.display="grid";
            }
        }
    }   

    function suma(){
        var produse=document.getElementsByClassName("product");
        sumaArt=0;
        for (let prod of produse){
            if (prod.style.display!="none"){
                sumaArt+=parseInt(prod.getElementsByClassName("val_price")[0].innerHTML);
            }
            
        }

        if(checkDiv == false){
            let infoSuma=document.createElement("div");//<p></p>
            checkDiv =true;
            infoSuma.innerHTML="Suma: "+sumaArt;//<p>...</p>
            infoSuma.className="info-produse";
            let p=document.getElementById("prod_sum")
            p.parentNode.insertBefore(infoSuma,p.nextSibling);
            setTimeout(function(){infoSuma.remove()}, 2000);
            setTimeout(function(){checkDiv = false}, 2000);
        }

        

    }
    function sortArticole(factor){
        
        var products=document.getElementsByClassName("product");
        let arrayProducts=Array.from(products);
        arrayProducts.sort(function(art1,art2){
            let nume1=art1.getElementsByClassName("val_brand")[0].innerHTML;
            let nume2=art2.getElementsByClassName("val_brand")[0].innerHTML;

            let pret1 = art1.getElementsByClassName("val_price")[0].innerHTML;
            let pret2 = art2.getElementsByClassName("val_price")[0].innerHTML;
            //console.log(nume1,nume2, nume1!=nume2);
            if(nume1!=nume2){
                console.log(nume1, " cu ", nume2);
                return factor*nume1.localeCompare(nume2);
                
            }
            else {
                console.log(factor*pret1.localeCompare( pret2,undefined, {'numeric': true}));
                console.log(pret1,pret2);
                return factor*(pret1.localeCompare( pret2,undefined, {'numeric': true}));
            }
            


            /*
            let rez=factor*nume1.localeCompare(nume2)
            if (rez==0)
                retrun factor*(pret1-pret2)
            return rez;
            */
        });
        console.log(arrayProducts); 
        for (let prod of arrayProducts){
            prod.parentNode.appendChild(prod);
        }
    }

    btn=document.getElementById("sortCrescNume");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescrescNume");
    btn.onclick=function(){
        sortArticole(-1);
    }

    btn=document.getElementById("sumEl");
    btn.onclick=function(){
        suma();
    }

    btn = document.getElementById("reseteaza");
    btn.onclick = function(){
        let products = document.getElementsByClassName("product");
        for ( let prod of products){
            prod.style.display="grid";
        }

    }
});