
 function multSelect(){
  userCheckbox = document.querySelectorAll('.userCheckbox');
  if (!document.querySelector('#multCheckbox').checked){
    userCheckbox.forEach(element => {
      if (element.checked){
        element.checked = 0;
      } else element.checked = 0;
      
    });
  } else if(document.querySelector('#multCheckbox').checked) {
    userCheckbox.forEach(element => {
      if (element.checked){
        element.checked = 1;
      } else element.checked = 1;
      
    });
  }
  
 }
