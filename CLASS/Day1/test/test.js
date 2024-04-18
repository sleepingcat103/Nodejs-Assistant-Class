function test() {
  let valA = 'I am value A.' ;
  
  setTimeout(function() { 
    console.log('print valA'); 
  }, 3000);
  
  console.log('valA:', valA);
}

test()