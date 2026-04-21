import { useEffect, useState } from 'react';
import type { List } from '../types';

type ListSectionProps = {
  selectedListId: number | null;
  onSelectList: (id: number) => void;
};

export default function ListSection({
  selectedListId,
  onSelectList,
}: ListSectionProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch('http://localhost:3000/lists');
        const data = await res.json();
        setLists(data);
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, []);

  async function handleAddList(e: React.FormEvent) {
    e.preventDefault();

    if (!newListName.trim()) return;

    try {
      const res = await fetch('http://localhost:3000/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newListName }),
      });

      const createdList: List = await res.json();

      setLists((prev) => [createdList, ...prev]);
      setNewListName('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }

  async function handleDeleteList(id: number) {
  try {
    await fetch(`http://localhost:3000/lists/${id}`, {
      method: 'DELETE',
    });

    setLists((prev) => prev.filter((l) => l.id !== id));
  } catch (error) {
    console.error('Error deleting list:', error);
  }
}

  return (
    <section>
      <h2>Listar</h2>

      <form onSubmit={handleAddList}>
        <input
          type="text"
          placeholder="Nýr listi"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button type="submit">Bæta við</button>
      </form>

      {loading && <p>Hleður listum...</p>}

      {!loading && lists.length === 0 && <p>Engir listar enn.</p>}

      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <button
              type="button"
              onClick={() => onSelectList(list.id)}
              style={{
                fontWeight: selectedListId === list.id ? 'bold' : 'normal',
                color: selectedListId === list.id ? 'blue' : 'black',
              }}
            >
              {list.name}
            </button>
            <button
  type="button"
  onClick={() => handleDeleteList(list.id)}
  style={{ marginLeft: '0.5rem' }}
>
  Eyða
</button>
          </li>
        ))}
      </ul>
    </section>
  );
}