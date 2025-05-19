import { getGeneratedContent } from '@/server/actions/user/queries';
import { getServerAuthSession } from '@/server/auth';
import { NextRequest, NextResponse } from 'next/server';

// Handler para requisições GET
export async function GET(req: NextRequest) {

    const session = await getServerAuthSession();
  
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }
  


  const resultado = await getGeneratedContent();

  return NextResponse.json(resultado, {
    status: 200,
  });
}
