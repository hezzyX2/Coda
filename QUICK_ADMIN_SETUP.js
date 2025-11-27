/**
 * Quick Admin Account Setup Script
 * 
 * Run this in your browser console after opening the app
 * This will create/update your admin account with the correct password
 */

(async function setupAdminAccount() {
  console.log('🔧 Setting up admin account...');
  
  const email = 'ryan.policicchio@gmail.com';
  const password = 'pinEapple14!';
  const name = 'Ryan Policicchio';
  
  // Hash password
  async function hashPassword(pwd) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  const passwordHash = await hashPassword(password);
  console.log('✅ Password hashed');
  
  // Get or create users array
  let users = [];
  const stored = localStorage.getItem('codak.users.v1') || localStorage.getItem('coda.users.v1');
  if (stored) {
    users = JSON.parse(stored);
  }
  
  // Find or create user
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (userIndex !== -1) {
    // Update existing user
    users[userIndex] = {
      ...users[userIndex],
      email: email.toLowerCase(),
      name: name
    };
    console.log('✅ Updated existing user account');
  } else {
    // Create new user
    users.push({
      email: email.toLowerCase(),
      name: name,
      createdAt: new Date().toISOString(),
      isPremium: false
    });
    console.log('✅ Created new user account');
  }
  
  // Save users
  localStorage.setItem('codak.users.v1', JSON.stringify(users));
  if (!localStorage.getItem('coda.users.v1')) {
    localStorage.setItem('coda.users.v1', JSON.stringify(users));
  }
  
  // Set password hash
  localStorage.setItem(`codak.password.${email.toLowerCase()}`, passwordHash);
  localStorage.setItem(`coda.password.${email.toLowerCase()}`, passwordHash);
  console.log('✅ Password hash stored');
  
  // Log in automatically
  const sessionToken = crypto.randomUUID();
  localStorage.setItem('codak.session_token', sessionToken);
  localStorage.setItem('codak.auth.v1', JSON.stringify({
    email: email.toLowerCase(),
    name: name,
    createdAt: users.find(u => u.email.toLowerCase() === email.toLowerCase())?.createdAt || new Date().toISOString(),
    isPremium: false
  }));
  console.log('✅ Session created - you are now logged in!');
  
  console.log('');
  console.log('🎉 Admin account setup complete!');
  console.log('');
  console.log('Your credentials:');
  console.log('  Email: ryan.policicchio@gmail.com');
  console.log('  Password: pinEapple14!');
  console.log('');
  console.log('You should now see Admin links in the navigation.');
  console.log('Refresh the page to see the changes.');
})();

