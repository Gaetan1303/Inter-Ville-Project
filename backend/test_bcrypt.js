const bcrypt = require('bcryptjs');

const password = 'password123';
const hash = '$2a$12$nXJGLKVK5u8laZwkO.JG3Otg8zNcJMHq9AXu2zSraXTVFRlKvZw3a';

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('Erreur bcrypt:', err);
  } else {
    console.log('Résultat comparaison:', result);
  }
});
