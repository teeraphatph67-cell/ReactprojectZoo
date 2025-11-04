export async function login(email, password) {
  const res = await fetch('http://192.168.1.51:8000/library_api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return data;
}