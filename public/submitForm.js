function submitForm(action) {
  console.log(action);
  var form = document.querySelector('.form');
  form.action = action;
  form.submit();
}