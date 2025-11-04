import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('กำลังเข้าสู่ระบบ...');

    try {
      const res = await fetch('http://192.168.1.51:8000/library_api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      console.log('ผลลัพธ์จาก API:', data);

      if (data.token) {
        // ถ้า API ส่ง token กลับมา
        localStorage.setItem('token', data.token);
        setMessage('เข้าสู่ระบบสำเร็จ ✅');
        // ตัวอย่าง: redirect ไปหน้า Team
        window.location.href = '/Team';
      } else if (data.status === 'success') {
        setMessage('เข้าสู่ระบบสำเร็จ ✅');
      } else {
        setMessage(data.message || 'เข้าสู่ระบบไม่สำเร็จ ❌');
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาด: ' + error.message);
    }
  }

  return (
    <div style={{maxWidth:400,margin:'80px auto',fontFamily:'sans-serif'}}>
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:10}}>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}