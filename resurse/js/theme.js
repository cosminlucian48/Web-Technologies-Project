window.addEventListener("load", function(){
    let selectedTheme = localStorage.getItem("theme");
    
    if(selectedTheme == "dark"){
        document.body.classList.add("dark");
        document.getElementById('theme').innerHTML = 
                '<i class="fas fa-sun"></i>';
    }
    else {
        document.getElementById('theme').innerHTML = 
        '<i class="fas fa-moon"></i>';
    }
        
    
    
    document.getElementById("theme").onclick = function(){
        document.body.classList.toggle("dark");
        
        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme","dark");
            document.getElementById('theme').innerHTML = 
                '<i class="fas fa-sun"></i>';
            
        }
        else{
            localStorage.setItem("theme","light");
            document.getElementById('theme').innerHTML = 
        '<i class="fas fa-moon"></i>';
            
        }
    };
});