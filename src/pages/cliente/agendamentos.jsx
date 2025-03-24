import { useEffect, useState } from 'react';
import styles from '@/styles/agendamentos.module.css';
import { Card } from 'antd';
import dayjs from 'dayjs';
import SideBarClient from '@/components/sideBarClient';

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const buscarAgendamentos = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/appointments', {
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Erro ao buscar agendamentos');
                }

                const data = await res.json();
                console.log('Resposta da API:', data); 
                setAgendamentos(data.agendamentos);
            } catch (err) {
                setErro(err.message);
            } finally {
                setLoading(false);
            }
        };

        buscarAgendamentos();
    }, []);

    if (loading) return <p>Carregando agendamentos...</p>;
    if (erro) return <p>Erro: {erro}</p>;

    return (
        <div className={styles.container}>
            <SideBarClient />
            <h2 className={styles.titulo}>Meus Agendamentos</h2>
            {agendamentos.length === 0 ? (
                <p>Você ainda não possui agendamentos.</p>
            ) : (
                <div className={styles.lista}>
                    {agendamentos.map((agendamento) => (
                        <Card key={agendamento.id} className={styles.card}>
                            <h3>{agendamento.serviceName}</h3>
                            <p><strong>Data:</strong> {dayjs(agendamento.date).format('DD/MM/YYYY')}</p>
                            <p><strong>Horário:</strong> {agendamento.time}</p>
                            <p><strong>Profissional:</strong> {agendamento.professionalName}</p>
                            <p><strong>Duração:</strong> {agendamento.duration} minutos</p>
                            <p><strong>Valor:</strong> R$ {agendamento.price.toFixed(2)}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
    
}