import { useState } from 'react';

export default function AddCamera() {
    const [form, setForm] = useState({
        ip_address: '',
        zoo_name: '',
        camera_position: '',
        animal_name: '',
        camera_url: '',
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined })); // ล้าง error ของช่องนั้น ๆ
    }

    function validateClient() {
        const errs = {};
        // เช็ก IP แบบง่าย (ถ้าใช้ hostname ก็ข้ามได้)
        const ip = form.ip_address.trim();
        const ipRegex =
            /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
        if (!ip) errs.ip_address = 'กรุณากรอก IP';
        else if (!ipRegex.test(ip)) errs.ip_address = 'รูปแบบ IP ไม่ถูกต้อง (เช่น 192.168.1.10)';

        if (!form.zoo_name.trim()) errs.zoo_name = 'กรุณากรอกชื่อสวนสัตว์';
        if (!form.camera_position.trim()) errs.camera_position = 'กรุณากรอกตำแหน่งกล้อง';
        if (!form.animal_name.trim()) errs.animal_name = 'กรุณากรอกชื่อสัตว์';

        try {
            const u = new URL(form.camera_url);
            if (!/^https?:$/.test(u.protocol)) throw new Error();
        } catch {
            errs.camera_url = 'URL ต้องขึ้นต้นด้วย http:// หรือ https://';
        }
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        console.log(form)
        // client-side validation ก่อน ส่งเร็วขึ้น/ข้อความชัด
        if (!validateClient()) {
            setLoading(false);
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "ip_address": form.ip_address,
            "zoo_name": form.zoo_name,
            "camera_position": form.camera_position,
            "animal_name": form.animal_name,
            "camera_url": form.camera_url
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost/lumen-api/public/api/v1/Addcamera", requestOptions)
            .then((response) => response.json())
            .then((result) => {

                if (result.success === true) {
                    alert(result.message)
                } else {
                    alert(result.message)
                }
            })
            .catch((error) => console.error(error));


    }

    const inputClass =
        'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200';
    const errorClass = 'mt-1 text-xs text-red-600';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200"
            >
                <h1 className="text-xl font-bold text-center mb-4">เพิ่มข้อมูลกล้อง</h1>

                {error && <div className="text-red-600 text-sm">{error}</div>}
                {message && <div className="text-green-600 text-sm">{message}</div>}

                <div>
                    <label className="block text-sm font-medium mb-1">เลขที่ IP กล้อง</label>
                    <input
                        name="ip_address"
                        value={form.ip_address}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                    {fieldErrors.ip_address && <div className={errorClass}>{fieldErrors.ip_address}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">ชื่อสวนสัตว์</label>
                    <input
                        name="zoo_name"
                        value={form.zoo_name}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                    {fieldErrors.zoo_name && <div className={errorClass}>{fieldErrors.zoo_name}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">ตำแหน่งกล้อง</label>
                    <input
                        name="camera_position"
                        value={form.camera_position}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                    {fieldErrors.camera_position && <div className={errorClass}>{fieldErrors.camera_position}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">ชื่อสัตว์</label>
                    <input
                        name="animal_name"
                        value={form.animal_name}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                    {fieldErrors.animal_name && <div className={errorClass}>{fieldErrors.animal_name}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">URL กล้อง</label>
                    <input
                        type="url"
                        name="camera_url"
                        value={form.camera_url}
                        onChange={handleChange}
                        className={inputClass}
                        required
                        placeholder="http://example.com/stream"
                    />
                    {fieldErrors.camera_url && <div className={errorClass}>{fieldErrors.camera_url}</div>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
            </form>
        </div>
    );
}
