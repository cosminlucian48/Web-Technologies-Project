//carousel
var slideIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("img_slider");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1}
  x[slideIndex-1].style.display = "block";
  setTimeout(carousel, 2000); // se schimba la fiecare 2 sec
}


//average in table
var table = document.getElementById('tabel_parasutism'),
  rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'),
  footer = table.getElementsByTagName('tfoot')[0];

// fiecare coloana
for(var i=0; i<5; i++){
  var sum = numOfValues = 0;
  // se aduna valorile de pe fiecare linie
  for(numOfValues=0, l=rows.length; numOfValues<l; numOfValues++){
    sum += parseFloat(
        rows[numOfValues].getElementsByTagName('td')[i]
          .innerHTML
      );
  
  }
  // calculeaza media
  var avg = sum / numOfValues;
  // se insereaza in td ul corespunzator, cu 2 decimale
  footer.getElementsByTagName('td')[i].innerHTML = Math.round(avg * 100) / 100;
}

