const login = async (email, password) => {
  const storedEmail = localStorage.getItem('adminEmail');
  const storedPassword = localStorage.getItem('adminPassword');
  return email === storedEmail && password === storedPassword;
};

const authService = {
  login,
};

export default authService;