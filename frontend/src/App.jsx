import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/users'

const initialForm = { name: '', email: '' }

function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Impossible de charger les utilisateurs.')
      }
      const data = await response.json()
      setUsers(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    fetch(API_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Impossible de charger les utilisateurs.')
        }
        return response.json()
      })
      .then((data) => {
        setUsers(data)
        setError('')
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
    }

    if (!payload.name || !payload.email) {
      setError('Les champs nom et email sont obligatoires.')
      return
    }

    const isEdit = editingId !== null

    try {
      const response = await fetch(isEdit ? `${API_URL}/${editingId}` : API_URL, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Échec de l\'enregistrement de l\'utilisateur.')
      }

      resetForm()
      setLoading(true)
      await fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setForm({ name: user.name, email: user.email })
  }

  const handleDelete = async (id) => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Suppression impossible.')
      }
      setLoading(true)
      await fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">CRUD Utilisateurs</h1>
        <p className="mt-1 text-sm text-slate-600">React + Tailwind + Spring Boot</p>

        <form className="mt-6 grid gap-3 sm:grid-cols-3" onSubmit={handleSubmit}>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            type="text"
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <button
              className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              type="submit"
            >
              {editingId !== null ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingId !== null && (
              <button
                className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                type="button"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {error && <p className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Liste des utilisateurs</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Chargement...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun utilisateur pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex flex-col gap-2 rounded border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
                      type="button"
                      onClick={() => handleEdit(user)}
                    >
                      Éditer
                    </button>
                    <button
                      className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                      type="button"
                      onClick={() => handleDelete(user.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
