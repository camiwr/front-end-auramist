import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SideBarClient from '@/components/sideBarClient';
import styles from '@/styles/agendamentos.module.css'; // vamos criar esse CSS abaixo

export default function AgendamentosCliente() {
  const [user, setUser] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Buscar usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/protected', {
          credentials: 'include',
        });

        if (!res.ok) return router.push('/login');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Erro ao buscar usuário', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, []);

  // Buscar agendamentos do cliente logado
  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch('http://localhost:3001/api/appointments/client/2', {
            credentials: 'include',
          });
          
          if (!res.ok) {
            const errorText = await res.text(); // para debug
            throw new Error(`Erro ${res.status}: ${errorText}`);
          }
          
          const data = await res.json();           
        setAgendamentos(data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [user]);

  return (
    <div className={styles.container}>
      <SideBarClient />
      <div className={styles.conteudo}>
        <h1 className={styles.titulo}>Meus Agendamentos</h1>

        {loading ? (
          <p>Carregando agendamentos...</p>
        ) : agendamentos.length === 0 ? (
          <p>Você ainda não tem agendamentos.</p>
        ) : (
          <div className={styles.lista}>
            {agendamentos.map((a) => (
              <div key={a.id} className={styles.card}>
                <h3>{a.service.name}</h3>
                <p><strong>Profissional:</strong> {a.professional?.name || '---'}</p>
                <p><strong>Data:</strong> {new Date(a.date).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {a.time}</p>
                <p><strong>Status:</strong> <span className={styles[a.status]}>{a.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
