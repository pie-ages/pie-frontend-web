import Link from 'next/link'

export default function Page() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-2 text-muted-foreground">
        Página de login da plataforma Piê.
      </p>
      <Link href="/CompanySignUp" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        Cadastrar minha loja
      </Link>
    </main>
  )
}
