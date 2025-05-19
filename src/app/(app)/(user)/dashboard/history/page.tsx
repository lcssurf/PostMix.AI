"use client";

import { AppPageShell } from '@/app/(app)/_components/page-shell';
import React from 'react';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/app/(app)/_components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableHistoryData } from '@/types/data-table';
import { getColumns } from './_components/columns';



// Componente da página
const HistoryPage = () => {

    const columns = React.useMemo(() => getColumns(), []);

    const [data, setData] = React.useState<DataTableHistoryData[]>([]);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/content');
                if (!response.ok) {
                    throw new Error('Erro ao buscar histórico');
                }
                const result = await response.json();
                setData(result); // Atualiza o estado com os dados retornados
            } catch (error) {
                console.error('Erro ao buscar histórico:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    
    const pageCount = 1;

    // Hook da tabela
    const { table } = useDataTable<DataTableHistoryData, unknown>({
        data,
        columns,
        pageCount,
        searchableColumns: [],
        filterableColumns: [],
    });

    return (
        <AppPageShell title='Histórico' description='Histórico dos Conteúdos Gerados'>
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Carregando...</p>
                    </div>
                ) : data.length > 0 ? (
                    <DataTable table={table} columns={columns} totalRows={data.length} />
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Nenhum conteúdo gerado ainda.</p>
                    </div>
                )}
        </AppPageShell>
    );
};

export default HistoryPage;