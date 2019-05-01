/************************************************************************************/ 
// open color menu and its overlay
/***********************************************************************************/ 
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}



$('body').on('click','#faq', function(){
  $('#questions').toggle();
})

$('body').on('click','#questions', function(){
  $('#answers').toggle();
})

$('body').on('click','.ref', function(){
  $('#description').toggle();

  console.log ("click")
})


// $('body').on('click','#faq', function(){
//   $('#question').toggle();
// })

$('body').on('click','.ref2', function(){
  $('#description2').toggle();

  console.log ("click")
})

// $('body').on('click','#faq', function(){
//   $('#questions').toggle();
// })

// $('body').on('click','#usage', function(){
//   $('#answers2').toggle();
// })






$('body').on('click','#pink-info', function(){
  $('#pink').toggle();
})

$('body').on('click','#orange-info', function(){
  $('#orange').toggle();
})

$('body').on('click','#yellow-info', function(){
  $('#yellow').toggle();
})

$('body').on('click','#green-info', function(){
  $('#green').toggle();
})

$('body').on('click','#blue-info', function(){
  $('#blue').toggle();
})

$('body').on('click','#purple-info', function(){
  $('#purple').toggle();
})

$('body').on('click','#brown-info', function(){
  $('#brown').toggle();
})


$('body').on('click','#black-info', function(){
  $('#black').toggle();
})

$('body').on('click','#white-info', function(){
  $('#white').toggle();
})

$('body').on('click','#undefined-info', function(){
  $('#undefined').toggle();
})
