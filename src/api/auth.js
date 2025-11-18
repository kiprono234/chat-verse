// Mock API for local development

export async function me() {
    // pretend we check for an existing session
    const user = JSON.parse(localStorage.getItem("chatverse_user") || "null");
    return user ? { user } : null;
  }
  
  export async function login({ email, password }) {
    // simple mock: accept any credentials
    const existing = JSON.parse(localStorage.getItem("chatverse_user") || "null");
    const user = existing && existing.email === email ? existing : { username: "Test User", email };
    localStorage.setItem("chatverse_user", JSON.stringify(user));
    return { user };
  }
  
  export async function signup({ name, email, password, photo }) {
    const user = { username: name, email, photo };
    localStorage.setItem("chatverse_user", JSON.stringify(user));
    return { user };
  }
  
  export async function logout() {
    localStorage.removeItem("chatverse_user");
    return { success: true };
  }
  
  export async function requestPasswordReset() {
    return { message: "Password reset email sent (mock)" };
  }
  
  export async function resetPassword() {
    return { message: "Password reset successful (mock)" };
  }
  