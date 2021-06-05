function makeLine(length) {
    // length has the number of lines the triangle should have
    var line = "";
    for (var i = 1; i <= length; i++) {
      // Enter the first for loop for the number of lines
      for(var j=1; j<=i; j++){ 
        // Enter the second loop to figure how many *'s to print based on the current line number in i. So the 1st line will have 1 *, the second line will have 2 *s and so on.
        line += "*";
      }
      // Add a newline after finishing printing the line and move to the next line in the outer for loop
      line+="\n";
  
    }
    // Print an additional newline "\n" if desired.
    return line + "\n";
  }
  console.log(makeLine(10));