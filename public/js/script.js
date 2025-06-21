(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

  // function togglePassword() {
  //   const pwd = document.getElementById('password');
  //   const icon = document.getElementById('toggleIcon');
  //   if (pwd.type === 'password') {
  //     pwd.type = 'text';
  //     icon.innerHTML = '<i class="bi bi-eye-slash fs-5"></i>';
  //   } else {
  //     pwd.type = 'password';
  //     icon.innerHTML = '<i class="bi bi-eye fs-5"></i>';
  //   }
  // }