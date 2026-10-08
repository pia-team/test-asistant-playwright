/** Synthetic credentials for local E2E smoke (not production secrets). */
window.E2E_AUTH = {
  expectedUsername: 'e2e-user',
  expectedPassword: 'e2e-secret-pass',
  validate: function (username, password) {
    return username === this.expectedUsername && password === this.expectedPassword;
  },
};
