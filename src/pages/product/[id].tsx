import { useRouter } from 'next/router';

export default function ProductId() {

  const { query } = useRouter();

  return (
    <>
      <h1>Product - com id - {JSON.stringify(query.id)}</h1>
    </>
  );
}

// Ir para a aula Configurando Stitches