import { getGeneratedContentById } from '@/server/actions/user/mutations';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400,
            headers:{
                'Access-Control-Allow-Origin': '*',
            }
         });
    }

    const resultado = await getGeneratedContentById({ id });
    return NextResponse.json(resultado, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    });
}