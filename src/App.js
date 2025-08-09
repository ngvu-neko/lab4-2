import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL

async function getUsers() {
  const r = await fetch(API_URL);
  if (!r.ok) throw new Error(`GET failed: ${r.status}`);
  return r.json();
}
async function createUser(name) {
  const r = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!r.ok) throw new Error(`POST failed: ${r.status}`);
  return r.json();
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setMsg("");
    try {
      const created = await createUser(name.trim());
      setUsers((u) => [created, ...u]);
      setName("");
      setMsg("Created!");
    } catch (e) { setMsg(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Users</h1>
      <form onSubmit={onCreate} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name..." style={{ flex: 1, padding: 8 }} />
        <button type="submit" disabled={loading}>Add</button>
      </form>
      {msg && <div style={{ marginBottom: 8 }}>{msg}</div>}
      {loading && <div>Loading...</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map(u => (
          <li key={u.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{u.name}</strong><div style={{ fontSize: 12, color: "#666" }}>{u.id}</div>
          </li>
        ))}
        {!loading && users.length === 0 && <li>No users yet.</li>}
      </ul>
    </div>
  );
}