import { StatItem } from '@/design-system/components/StatItem'

export function CompanySignUpSidebar() {
  return (
    <div className="flex w-full min-w-80 flex-col justify-between gap-12 bg-primary p-12 text-primary-foreground md:w-[36%]">
      <p className="text-sm font-extrabold">
        Piê <span className="font-normal opacity-70">/ para lojas</span>
      </p>

      <div className="flex flex-col gap-5">
        <h1 className="text-display font-extrabold">
          Sua loja dentro
          <br />
          do closet clientes.
        </h1>
        <p className="max-w-[348px] text-body text-primary-foreground/[0.92]">
          Cadastre seus produtos uma vez. Piê recomenda cada peça para as
          clientes cujo estilo e colorimetria combinam com ela.
        </p>
      </div>

      <div className="flex gap-8 border-t-2 border-brand-secondary pt-5">
        <StatItem value="32 mil" label="peças na vitrine" />
        <StatItem value="148" label="lojas ativas" />
      </div>
    </div>
  )
}
